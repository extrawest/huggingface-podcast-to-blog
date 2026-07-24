import {
  StateGraph,
  Annotation,
  MessagesAnnotation,
  MemorySaver,
  START,
  END,
} from "@langchain/langgraph";
import { SystemMessage } from "@langchain/core/messages";
import { model } from "@/lib/llm";
import { RETRY_OPTIONS } from "@/lib/graph/retry";

const ChatState = Annotation.Root({
  ...MessagesAnnotation.spec,
  transcript: Annotation,
});

async function respond(state) {
  const system = new SystemMessage(
    "You answer questions about a podcast episode using only the transcript below. " +
      "If the transcript doesn't cover the question, say so plainly.\n\n" +
      `Transcript:\n${state.transcript || ""}`
  );
  const reply = await model.invoke([system, ...state.messages]);
  return { messages: [reply] };
}

const graph = new StateGraph(ChatState)
  .addNode("respond", respond, { retryPolicy: RETRY_OPTIONS })
  .addEdge(START, "respond")
  .addEdge("respond", END);

export const chatGraph = graph.compile({ checkpointer: new MemorySaver() });
