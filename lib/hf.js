import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

const ASR_MODEL = process.env.ASR_MODEL || "openai/whisper-large-v3";
const SUMMARY_MODEL = process.env.SUMMARY_MODEL || "facebook/bart-large-cnn";
const IMAGE_MODEL = process.env.IMAGE_MODEL || "black-forest-labs/FLUX.1-schnell";

async function withRetry(fn) {
  try {
    return await fn();
  } catch (err) {
    const msg = String(err?.message || err);
    if (!/503|loading|timeout|ETIMEDOUT|ECONNRESET|502|504/i.test(msg)) throw err;
    await new Promise((r) => setTimeout(r, 2500));
    return fn();
  }
}
// The transcription service has a 24 MB limit.
const MAX_AUDIO_BYTES = 24 * 1024 * 1024;

function checkSizeLimit(bytes) {
  if (bytes <= MAX_AUDIO_BYTES) return;
  const mb = Math.round(bytes / (1024 * 1024));
  throw new Error(
    `This episode is ~${mb} MB, too large for the transcription service. ` +
      `Pick a shorter one (roughly under 20 minutes).`
  );
}

export async function transcribe(audioUrl) {
  // Some podcast hosts 403 requests without a browser-like User-Agent.
  const res = await fetch(audioUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`Could not fetch audio (${res.status})`);

  const inputs = await res.blob();
  checkSizeLimit(inputs.size);

  const out = await withRetry(() =>
    client.automaticSpeechRecognition({ model: ASR_MODEL, inputs })
  );
  return out.text;
}

export async function summarize(text) {
  const out = await withRetry(() =>
    client.summarization({ model: SUMMARY_MODEL, inputs: text.slice(0, 4000) })
  );
  return out.summary_text;
}

export async function generateImage(prompt) {
  return withRetry(() =>
    client.textToImage(
      { model: IMAGE_MODEL, inputs: prompt, parameters: { num_inference_steps: 4 } },
      { outputType: "dataUrl" }
    )
  );
}
