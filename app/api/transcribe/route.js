import { transcribe } from "@/lib/hf";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { audioUrl } = await request.json();
    if (!audioUrl) return Response.json({ error: "Missing audioUrl" }, { status: 400 });
    const transcript = await transcribe(audioUrl);
    return Response.json({ transcript });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
