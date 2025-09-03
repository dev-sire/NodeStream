import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

interface InputType {
	userId: string;
	videoId: string;
	prompt: string;
}

export const { POST } = serve(async (context) => {
	const input = context.requestPayload as InputType;
	const { videoId, userId, prompt } = input;
	const utapi = new UTApi();

	const video = await context.run("get-video", async () => {
		const [existingVideo] = await db
			.select()
			.from(videos)
			.where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
		if (!existingVideo) {
			throw new Error("Not found");
		}
		return existingVideo;
	});

	const { body } = await context.call<{ result: { base64: string } }>(
		"generate-thumbnail",
		{
			url: `https://api.cloudflare.com/client/v4/accounts/${process.env.WORKERSAI_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.WORKERSAI_API_KEY}`,
			},
			body: JSON.stringify({
				prompt,
				height: 1080,
				width: 1920,
			}),
		}
	);

	const tempThumbnailBase64 = body.result.base64;
	if (!tempThumbnailBase64) {
		throw new Error("Bad request: Missing base64 data from AI");
	}

	await context.run("thumbnail-cleanup", async () => {
		if (video.thumbnailKey) {
			await utapi.deleteFiles(video.thumbnailKey);
			await db
				.update(videos)
				.set({ thumbnailKey: null, thumbnailUrl: null })
				.where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
		}
	});

	const uploadedThumbnail = await context.run("upload-thumbnail", async () => {
		const blob = await fetch(`data:image/png;base64,${tempThumbnailBase64}`).then(res => res.blob());
		
		const { data } = await utapi.uploadFiles(new File([blob], "thumbnail.png", { type: 'image/png' }));
		if (!data) {
			throw new Error("Bad request: UploadThing failed to upload");
		}
		return data;
	});

	await context.run("update-video", async () => {
		await db
			.update(videos)
			.set({
				thumbnailKey: uploadedThumbnail.key,
				thumbnailUrl: uploadedThumbnail.url,
			})
			.where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
	});
});