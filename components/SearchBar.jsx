"use client";

import { Input } from "antd";

export default function SearchBar({ onSearch, loading }) {
  return (
    <Input.Search
      placeholder="Search podcasts"
      size="large"
      loading={loading}
      allowClear
      onSearch={(value) => {
        const term = value.trim();
        if (term) onSearch(term);
      }}
    />
  );
}
