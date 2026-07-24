import { translateGraph } from "@/lib/graph/translate";

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text) return Response.json({ error: "Missing text" }, { status: 400 });
    const { french } = await translateGraph.invoke({ text });
    return Response.json({ translated: french });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
