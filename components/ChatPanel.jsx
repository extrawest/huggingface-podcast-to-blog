"use client";

import { useState } from "react";
import { Card, Input, Button, Typography, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useEpisodeChat } from "@/hooks/useEpisodeChat";

const { Text } = Typography;

function Message({ role, content }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 8 }}>
      <span
        style={{
          maxWidth: "80%",
          padding: "8px 12px",
          borderRadius: 8,
          whiteSpace: "pre-wrap",
          background: isUser ? "#1677ff" : "#f0f0f0",
          color: isUser ? "#fff" : "#333",
        }}
      >
        {content}
      </span>
    </div>
  );
}

export default function ChatPanel({ transcript }) {
  const { messages, send, loading } = useEpisodeChat(transcript);
  const [value, setValue] = useState("");
  const ready = Boolean(transcript);

  function submit() {
    const text = value.trim();
    if (!text || loading || !ready) return;
    send(text);
    setValue("");
  }

  return (
    <Card
      title="Ask about this episode"
      variant="borderless"
      style={{ position: "sticky", top: 88 }}
    >
      <div className="chat-scroll">
        {messages.length === 0 && (
          <Text type="secondary">
            {ready ? "Ask anything about this episode." : "Preparing the transcript..."}
          </Text>
        )}
        {messages.map((m, i) => (
          <Message key={i} role={m.role} content={m.content} />
        ))}
        {loading && (
          <Text type="secondary">
            <Spin size="small" /> Thinking...
          </Text>
        )}
      </div>

      <Input.TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What is this episode about?"
        autoSize={{ minRows: 1, maxRows: 4 }}
        disabled={!ready}
        onPressEnter={(e) => {
          if (!e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={submit}
        loading={loading}
        disabled={!ready || !value.trim()}
        block
        style={{ marginTop: 8 }}
      >
        Send
      </Button>
    </Card>
  );
}
