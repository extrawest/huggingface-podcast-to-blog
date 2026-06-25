import { chatAboutTranscript } from "@/lib/llm";

export async function POST(request) {
  try {
    const { transcript, messages } = await request.json();
    if (!transcript) return Response.json({ error: "Missing transcript" }, { status: 400 });
    const reply = await chatAboutTranscript(transcript, messages);
    return Response.json({ reply });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
