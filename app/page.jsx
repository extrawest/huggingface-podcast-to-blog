"use client";

import { useState } from "react";
import { Layout, Typography } from "antd";
import SearchBar from "@/components/SearchBar";
import PodcastList from "@/components/PodcastList";
import EpisodeList from "@/components/EpisodeList";
import EpisodeDetails from "@/components/EpisodeDetails";
import { usePodcastSearch } from "@/hooks/usePodcastSearch";

const { Content } = Layout;
const { Title } = Typography;

export default function Home() {
  const browse = usePodcastSearch();
  const [episode, setEpisode] = useState(null);

  return (
    <Layout>
      <Content style={{ padding: "20px", width: "100%" }}>
        {episode ? (
          <EpisodeDetails key={episode.id} episode={episode} onBack={() => setEpisode(null)} />
        ) : (
          <>
            <Title level={2}>Search a podcast, pick an episode, get transcript</Title>

            <SearchBar onSearch={browse.search} loading={browse.searching} />

            <div style={{ marginTop: 24 }}>
              {browse.selectedPodcast ? (
                <EpisodeList
                  podcast={browse.selectedPodcast}
                  episodes={browse.episodes}
                  loading={browse.loadingEpisodes}
                  onBack={browse.clearPodcast}
                  onSelect={setEpisode}
                />
              ) : browse.podcasts ? (
                <PodcastList podcasts={browse.podcasts} onSelect={browse.selectPodcast} />
              ) : null}
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
}
