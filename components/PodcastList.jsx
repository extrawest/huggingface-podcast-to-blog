"use client";

import { Avatar, Empty, List, Typography } from "antd";

const { Text } = Typography;

export default function PodcastList({ podcasts, onSelect }) {
  if (!podcasts?.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No podcasts found" />;
  }
  return (
    <List
      dataSource={podcasts}
      split={false}
      renderItem={(p) => (
        <List.Item key={p.id} className="podcast-list-item" onClick={() => onSelect(p)}>
          <List.Item.Meta
            avatar={
              <Avatar shape="square" size={56} src={p.image}>
                {p.title?.[0] || "?"}
              </Avatar>
            }
            title={<Text strong>{p.title}</Text>}
            description={
              <Text type="secondary" ellipsis>
                {p.author}
                {p.episodeCount ? ` · ${p.episodeCount} episodes` : ""}
              </Text>
            }
          />
        </List.Item>
      )}
    />
  );
}
