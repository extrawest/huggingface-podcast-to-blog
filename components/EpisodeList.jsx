"use client";

import { Button, Empty, Flex, List, Space, Spin, Typography } from "antd";
import { ArrowLeftOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { formatDate, formatDuration } from "@/utils/episodeFormat";

const { Text } = Typography;

export default function EpisodeList({ podcast, episodes, loading, onBack, onSelect }) {
  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Podcasts
        </Button>
        <Text strong>{podcast?.title}</Text>
      </Space>

      {loading ? (
        <Flex justify="center" style={{ padding: 40 }}>
          <Spin />
        </Flex>
      ) : !episodes?.length ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No episodes found" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={episodes}
          split={false}
          renderItem={(e) => {
            const meta = [formatDate(e.datePublished), formatDuration(e.duration)]
              .filter(Boolean)
              .join(" · ");

            return (
              <List.Item
                key={e.id}
                className="episode-list-item"
                onClick={() => onSelect(e)}
                actions={[
                  <PlayCircleOutlined
                    key="play"
                    style={{ fontSize: 20, color: "#5b54e6" }}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={<Text strong>{e.title}</Text>}
                  description={meta ? <Text type="secondary">{meta}</Text> : null}
                />
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
}
