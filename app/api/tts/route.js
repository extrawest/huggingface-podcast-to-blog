import { textToSpeech } from "@/lib/elevenlabs";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text) return Response.json({ error: "Missing text" }, { status: 400 });
    const audio = await textToSpeech(text);
    return Response.json({ audio });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
