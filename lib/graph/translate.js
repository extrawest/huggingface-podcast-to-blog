import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { InMemoryCache } from "@langchain/langgraph-checkpoint";
import { translateToFrench } from "@/lib/llm";
import { RETRY_OPTIONS } from "@/lib/graph/retry";

const Translate = Annotation.Root({
  text: Annotation,
  french: Annotation,
});

async function translateNode(state) {
  return { french: await translateToFrench(state.text) };
}

const graph = new StateGraph(Translate)
  .addNode("translate", translateNode, {
    retryPolicy: RETRY_OPTIONS,
    cachePolicy: { keyFunc: ([state]) => state.text, ttl: 3600 },
  })
  .addEdge(START, "translate")
  .addEdge("translate", END);

export const translateGraph = graph.compile({ cache: new InMemoryCache() });
