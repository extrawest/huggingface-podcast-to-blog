import { generateTitle } from "@/lib/llm";

export async function POST(request) {
  try {
    const { summary } = await request.json();
    if (!summary) return Response.json({ error: "Missing summary" }, { status: 400 });
    const title = await generateTitle(summary);
    return Response.json({ title });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
