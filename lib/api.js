import { axiosClient } from "@/lib/axiosClient";

export async function searchPodcasts(q) {
  const { data } = await axiosClient.get("/api/search", { params: { q } });
  return data.podcasts;
}

export async function fetchEpisodes(feedId) {
  const { data } = await axiosClient.get("/api/search", { params: { feedId } });
  return data.episodes;
}

export async function runPipeline(audioUrl, onDelta) {
  const { data: stream } = await axiosClient.post(
    "/api/pipeline",
    { audioUrl },
    { adapter: "fetch", responseType: "stream" }
  );

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;
      const delta = JSON.parse(line);
      if (delta.error) throw new Error(delta.error);
      onDelta(delta);
    }
  }
}

export async function translate(text) {
  const { data } = await axiosClient.post("/api/translate", { text });
  return data.translated;
}

export async function chat(threadId, transcript, message) {
  const { data } = await axiosClient.post("/api/chat", { threadId, transcript, message });
  return data.reply;
}
