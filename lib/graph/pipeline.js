import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { InMemoryCache } from "@langchain/langgraph-checkpoint";
import { transcribe, summarize, generateImage } from "@/lib/hf";
import { generateTitle, imagePrompt } from "@/lib/llm";
import { textToSpeech } from "@/lib/elevenlabs";
import { RETRY_OPTIONS } from "@/lib/graph/retry";

const Pipeline = Annotation.Root({
  audioUrl: Annotation,
  transcript: Annotation,
  summary: Annotation,
  title: Annotation,
  image: Annotation,
  audio: Annotation,
});

async function transcribeNode(state) {
  return { transcript: await transcribe(state.audioUrl) };
}

async function summarizeNode(state) {
  return { summary: await summarize(state.transcript) };
}

async function titleNode(state) {
  return { title: await generateTitle(state.summary) };
}

async function imageNode(state) {
  const prompt = await imagePrompt(state.summary);
  return { image: await generateImage(prompt) };
}

async function audioNode(state) {
  return { audio: await textToSpeech(state.summary) };
}

function afterSummary(state) {
  if (!state.summary?.trim()) return END;
  return ["makeTitle", "makeImage", "makeAudio"];
}

const graph = new StateGraph(Pipeline)
  .addNode("transcribe", transcribeNode, { retryPolicy: RETRY_OPTIONS })
  .addNode("summarize", summarizeNode, { retryPolicy: RETRY_OPTIONS })
  .addNode("makeTitle", titleNode, { retryPolicy: RETRY_OPTIONS })
  .addNode("makeImage", imageNode, {
    retryPolicy: RETRY_OPTIONS,
    cachePolicy: { keyFunc: ([state]) => state.summary, ttl: 3600 },
  })
  .addNode("makeAudio", audioNode, { retryPolicy: RETRY_OPTIONS })
  .addEdge(START, "transcribe")
  .addEdge("transcribe", "summarize")
  .addConditionalEdges("summarize", afterSummary, ["makeTitle", "makeImage", "makeAudio", END])
  .addEdge("makeTitle", END)
  .addEdge("makeImage", END)
  .addEdge("makeAudio", END);

export const pipeline = graph.compile({ cache: new InMemoryCache() });
