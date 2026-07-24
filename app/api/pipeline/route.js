import { pipeline } from "@/lib/graph/pipeline";

export const maxDuration = 60;

export async function POST(request) {
  const { audioUrl } = await request.json();
  if (!audioUrl) return Response.json({ error: "Missing audioUrl" }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        for await (const update of await pipeline.stream({ audioUrl }, { streamMode: "updates" })) {
          for (const [node, delta] of Object.entries(update)) {
            if (node !== "__metadata__") send(delta);
          }
        }
      } catch (err) {
        send({ error: err.message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson" },
  });
}
