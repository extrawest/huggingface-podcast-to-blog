import { imagePrompt } from "@/lib/llm";
import { generateImage } from "@/lib/hf";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { summary } = await request.json();
    if (!summary) return Response.json({ error: "Missing summary" }, { status: 400 });
    const prompt = await imagePrompt(summary);
    const image = await generateImage(prompt);
    return Response.json({ image, prompt });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
