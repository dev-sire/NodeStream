export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const model = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
  const apiURL = `https://api.cloudflare.com/client/v4/accounts/${process.env.WORKERSAI_ACCOUNT_ID}/ai/run/${model}`;

  const aiResponse = await fetch(apiURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WORKERSAI_API_KEY}`,
      Accept: "image/png",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      height: 512,
      width: 512,
    }),
  });

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    return new Response(
      JSON.stringify({ error: `Cloudflare AI failed: ${errorText}` }),
      { status: 500 }
    );
  }

  // Stream the PNG back to caller
  return new Response(aiResponse.body, {
    status: 200,
    headers: { "Content-Type": "image/png" },
  });
}