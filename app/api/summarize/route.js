import { summarize } from "@/lib/hf";

export async function POST(request) {
  try {
    const { transcript } = await request.json();
    if (!transcript) return Response.json({ error: "Missing transcript" }, { status: 400 });
    const summary = await summarize(transcript);
    return Response.json({ summary });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
