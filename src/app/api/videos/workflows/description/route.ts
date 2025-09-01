import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
interface InputType {
  userId: string;
  videoId: string;
}
const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;
export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;
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
  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = response.text();
    if (!text) {
      throw new Error("Bad request");
    }
    return text;
  });
  const geminiResponse = await context.run("generate-description", async () => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set.");
    }

    const payload = {
      contents: [
        {
          parts: [
            { text: DESCRIPTION_SYSTEM_PROMPT },
            { text: transcript }
          ]
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    return response.json();
  });

  const description = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!description) {
    throw new Error("Bad request or no description generated");
  }
  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        description: description || video.description,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});