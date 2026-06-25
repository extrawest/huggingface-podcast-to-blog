import { useState } from "react";
import { App } from "antd";
import * as api from "@/lib/api";

export function useEpisodeChat(transcript) {
  const { message } = App.useApp();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function send(text) {
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const reply = await api.chat(transcript, next);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      message.error(`Chat failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return { messages, send, loading };
}
