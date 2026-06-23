import { useState } from "react";
import { App } from "antd";
import * as api from "@/lib/api";

export function usePodcastSearch() {
  const { message } = App.useApp();

  const [searching, setSearching] = useState(false);
  const [podcasts, setPodcasts] = useState(null);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  async function search(term) {
    setSearching(true);
    setSelectedPodcast(null);
    setEpisodes([]);
    try {
      setPodcasts(await api.searchPodcasts(term));
    } catch (err) {
      message.error(err.message);
    } finally {
      setSearching(false);
    }
  }

  async function selectPodcast(podcast) {
    setSelectedPodcast(podcast);
    setLoadingEpisodes(true);
    try {
      setEpisodes(await api.fetchEpisodes(podcast.id));
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoadingEpisodes(false);
    }
  }

  return {
    searching,
    podcasts,
    selectedPodcast,
    episodes,
    loadingEpisodes,
    search,
    selectPodcast,
    clearPodcast: () => setSelectedPodcast(null),
  };
}
