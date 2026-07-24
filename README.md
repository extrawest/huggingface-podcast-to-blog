# Podcast → Blog

Search a podcast, pick an episode, and turn it into a blog post: a transcript, a
summary, a generated title, a cover image, a spoken version of the summary, an
English↔French toggle, and a Q&A chat grounded in the original transcript.

A **LangGraph** pipeline runs the whole episode server-side — transcribe → summarize →
fan out to title, cover image and spoken summary — and **streams** each result back as
its node finishes, so the summary shows before the image and audio. Retries with
backoff, node caching, conditional skips, and chat history are handled by the graph
rather than hand-rolled.

## What it does

1. **Search** a podcast by term (Podcast Index) and pick an episode.
2. **Transcribe** the episode audio (Whisper).
3. **Summarize** the transcript (BART) — streamed to the UI immediately.
4. In parallel from the summary: generate a **title** (LLM), a **cover image**
   (FLUX), and a **spoken summary** (ElevenLabs). If the summary comes back empty, a
   conditional edge skips this fan-out entirely.
5. **Translate** the summary to French on demand (server-cached, then toggles EN/FR).
6. **Chat** about the episode — grounded only in the transcript, with history kept
   server-side by the graph's checkpointer.

## Stack

- **Next.js 16** (App Router), JavaScript + JSX. The API routes are the backend.
- **Ant Design v6** for the UI, themed through `ConfigProvider` tokens.
- **LangGraph** (`@langchain/langgraph`) orchestrates the pipeline, chat, and translate
  graphs — retries, caching, conditional edges, streaming, and a checkpointer.
- **Hugging Face Inference Providers** (`@huggingface/inference`) for transcription,
  summarization, and image generation.
- **LangChain** (`@langchain/openai` pointed at the HF OpenAI-compatible router) for the
  title, translation, and chat model calls the graph nodes wrap.
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

  ## Demo:

https://github.com/user-attachments/assets/c6fb7729-a262-4162-a4f5-94836b0ed4e2



