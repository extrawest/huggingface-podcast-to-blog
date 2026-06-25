import { translateToFrench } from "@/lib/llm";

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text) return Response.json({ error: "Missing text" }, { status: 400 });
    const translated = await translateToFrench(text);
    return Response.json({ translated });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
