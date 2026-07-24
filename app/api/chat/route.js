import { HumanMessage } from "@langchain/core/messages";
import { chatGraph } from "@/lib/graph/chat";

export async function POST(request) {
  try {
    const { threadId, transcript, message } = await request.json();
    if (!threadId || !message) {
      return Response.json({ error: "Missing threadId or message" }, { status: 400 });
    }

    const input = { messages: [new HumanMessage(message)] };
    if (transcript) input.transcript = transcript;

    const state = await chatGraph.invoke(input, { configurable: { thread_id: threadId } });

    return Response.json({ reply: state.messages.at(-1).text.trim() });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
