"use client";

import { Row, Col, Button, Space, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ResultView from "@/components/ResultView";
import ChatPanel from "@/components/ChatPanel";
import { useEpisodePipeline } from "@/hooks/useEpisodePipeline";

const { Text } = Typography;

export default function EpisodeDetails({ episode, onBack }) {
  const pipeline = useEpisodePipeline(episode);

  return (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Choose another episode
        </Button>
        <Text type="secondary">{episode.title}</Text>
      </Space>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <ResultView {...pipeline} />
        </Col>
        <Col xs={24} lg={9}>
          <ChatPanel transcript={pipeline.transcript} threadId={String(episode.id)} />
        </Col>
      </Row>
    </>
  );
}
