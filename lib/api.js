import axios from "axios";

export async function searchPodcasts(q) {
  const { data } = await axios.get("/api/search", { params: { q } });
  return data.podcasts;
}

export async function fetchEpisodes(feedId) {
  const { data } = await axios.get("/api/search", { params: { feedId } });
  return data.episodes;
}

export async function transcribe(audioUrl) {
  const { data } = await axios.post("/api/transcribe", { audioUrl });
  return data.transcript;
}

export async function summarize(transcript) {
  const { data } = await axios.post("/api/summarize", { transcript });
  return data.summary;
}

export async function generateTitle(summary) {
  const { data } = await axios.post("/api/title", { summary });
  return data.title;
}

export async function generateCover(summary) {
  const { data } = await axios.post("/api/image", { summary });
  return data.image;
}

export async function synthesizeSpeech(summary) {
  const { data } = await axios.post("/api/tts", { text: summary });
  return data.audio;
}

export async function translate(text) {
  const { data } = await axios.post("/api/translate", { text });
  return data.translated;
}

export async function chat(transcript, messages) {
  const { data } = await axios.post("/api/chat", { transcript, messages });
  return data.reply;
}
