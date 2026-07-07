# Podcast → Blog

Search a podcast, pick an episode, and turn it into a blog post: a transcript, a
summary, a generated title, a cover image, a spoken version of the summary, an
English↔French toggle, and a Q&A chat grounded in the original transcript.

The client orchestrates the pipeline and renders each section as its result lands —
the summary shows before the audio and image finish. Each API route makes exactly one
model call.

## What it does

1. **Search** a podcast by term (Podcast Index) and pick an episode.
2. **Transcribe** the episode audio (Whisper).
3. **Summarize** the transcript (BART) — rendered immediately.
4. In parallel from the summary: generate a **title** (LLM), a **cover image**
   (FLUX), and a **spoken summary** (ElevenLabs).
5. **Translate** the summary to French on demand (cached, then toggles EN/FR).
6. **Chat** about the episode — answers are grounded only in the transcript.

## Stack

- **Next.js 16** (App Router), JavaScript + JSX. The API routes are the backend.
- **Ant Design v6** for the UI, themed through `ConfigProvider` tokens.
- **Hugging Face Inference Providers** (`@huggingface/inference`) for transcription,
  summarization, and image generation.
- **LangChain** (`@langchain/openai` pointed at the HF OpenAI-compatible router) for the
  title, translation, and chat steps.
- **ElevenLabs** for text-to-speech.
- **Podcast Index** REST API for search.
- Stateless: no database, no storage bucket. Audio and image come back as base64 data URLs.

## Models

Verified against the live Inference Providers catalog. All are overridable via env vars.

| Step | Model | Provider (auto-selected) |
|---|---|---|
| Transcribe | `openai/whisper-large-v3` | fal-ai |
| Summarize | `facebook/bart-large-cnn` | hf-inference |
| Title / image prompt / translate / chat | `meta-llama/Llama-3.1-8B-Instruct` | HF router |
| Cover image | `black-forest-labs/FLUX.1-schnell` (4 steps) | nscale |
| Text-to-speech | ElevenLabs `eleven_multilingual_v2`, voice "George" | — |

HF's free tier routes through partner providers and the catalog shifts over time. If a
model stops resolving, set the matching env var (below) to a current equivalent.

## Run it locally

```bash
npm install
cp .env.example .env        # then fill in your keys
npm run dev                 # http://localhost:3000
```

Required keys:

| Var | Where to get it |
|---|---|
| `HF_TOKEN` | https://huggingface.co/settings/tokens |
| `ELEVENLABS_API_KEY` | https://elevenlabs.io |
| `PODCASTINDEX_KEY` / `PODCASTINDEX_SECRET` | https://api.podcastindex.org |

Optional: `ELEVENLABS_VOICE_ID` (defaults to a free-tier premade voice), and the model
overrides `CHAT_MODEL`, `ASR_MODEL`, `SUMMARY_MODEL`, `IMAGE_MODEL`.

## Known limits

- **Short podcasts only** — no long-audio chunking. Tested on the ~1-minute 60-Second Sermon.
- **Free-tier budgets** — HF credits and ElevenLabs characters are limited; don't loop the
  pipeline. ElevenLabs free tier can only use premade voices via the API, not library voices.
- **Translation** is done by the chat LLM (high quality, one call) rather than a dedicated
  MT model, so the French is generated, not deterministic.