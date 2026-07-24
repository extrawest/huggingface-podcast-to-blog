import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const CHAT_MODEL = process.env.CHAT_MODEL || "meta-llama/Llama-3.1-8B-Instruct";

export const model = new ChatOpenAI({
  model: CHAT_MODEL,
  apiKey: process.env.HF_TOKEN,
  configuration: { baseURL: "https://router.huggingface.co/v1" },
});

export async function generateTitle(summary) {
  const res = await model.invoke([
    new SystemMessage(
      "You write short, catchy blog post titles. Reply with the title only, no quotes, no label, eight words max."
    ),
    new HumanMessage(`Write a blog title for this summary:\n\n${summary}`),
  ]);
  return res.text.trim().replace(/^["']|["']$/g, "");
}

export async function imagePrompt(summary) {
  const res = await model.invoke([
    new SystemMessage(
      "Turn the blog summary into one vivid sentence describing a cover image: a concrete scene and an art style, no text or words in the image. Reply with the prompt only."
    ),
    new HumanMessage(summary),
  ]);
  return res.text.trim();
}

export async function translateToFrench(text) {
  const res = await model.invoke([
    new SystemMessage(
      "Translate the user's text from English to French. Reply with the translation only, keeping the paragraph breaks."
    ),
    new HumanMessage(text),
  ]);
  return res.text.trim();
}
