"use client";

import { Card, Typography, Button, Skeleton, Image, Collapse } from "antd";
import { TranslationOutlined, SoundOutlined } from "@ant-design/icons";
import { useTranslation } from "@/hooks/useTranslation";

const { Title, Paragraph, Text } = Typography;

export default function ResultView({
  transcript,
  transcribing,
  summary,
  summarizing,
  title,
  titleLoading,
  image,
  imageLoading,
  audio,
  ttsLoading,
}) {
  const { french, showing, translating, toggle } = useTranslation(summary);
  const body = showing ? french : summary;

  return (
    <Card variant="borderless">
      <div style={{ marginBottom: 20 }}>
        {imageLoading ? (
          <Skeleton.Image active style={{ width: "100%", height: 240 }} />
        ) : image ? (
          <Image src={image} alt={title || "Episode cover"} width="100%" style={{ borderRadius: 12 }} />
        ) : null}
      </div>

      {title ? (
        <Title level={2}>
          {title}
        </Title>
      ) : titleLoading ? (
        <Skeleton.Input active size="large" />
      ) : null}

      <Button
        icon={<TranslationOutlined />}
        onClick={toggle}
        loading={translating}
        disabled={!summary || summarizing}
        style={{ marginBottom: 16 }}
      >
        {showing ? "Read in English" : "Translate to French"}
      </Button>

      {summarizing ? (
        <Skeleton active paragraph={{ rows: 4 }} title={false} />
      ) : body ? (
        <Paragraph style={{ whiteSpace: "pre-wrap" }}>{body}</Paragraph>
      ) : transcribing ? (
        <Text type="secondary">Transcribing...</Text>
      ) : null}

      {(audio || ttsLoading) && (
        <div>
          <Text type="secondary">
            <SoundOutlined /> Summary audio
          </Text>
          {audio ? (
            <audio controls src={audio} />
          ) : (
            <Skeleton.Button active block />
          )}
        </div>
      )}

      {transcript && (
        <Collapse
          ghost
          items={[
            {
              key: "t",
              label: "Full transcript",
              children: (
                <Paragraph type="secondary" style={{ whiteSpace: "pre-wrap", overflow: "auto" }}>
                  {transcript}
                </Paragraph>
              ),
            },
          ]}
        />
      )}
    </Card>
  );
}
