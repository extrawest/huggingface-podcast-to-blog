import { useState } from "react";
import { App } from "antd";
import * as api from "@/lib/api";

export function useEpisodeChat(transcript, threadId) {
  const { message } = App.useApp();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function send(text) {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const reply = await api.chat(threadId, transcript, text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      message.error(`Chat failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return { messages, send, loading };
}
