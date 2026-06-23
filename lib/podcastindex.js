import podcastIndexApi from "podcast-index-api";

const api = podcastIndexApi(
  process.env.PODCASTINDEX_KEY,
  process.env.PODCASTINDEX_SECRET,
  "PodcastToBlog/1.0"
);

export async function searchPodcasts(term) {
  const { feeds } = await api.custom("search/byterm", { q: term, max: 20 });
  return (feeds || []).map((f) => ({
    id: f.id,
    title: f.title,
    author: f.author,
    image: f.image || f.artwork,
    description: f.description,
    episodeCount: f.episodeCount,
  }));
}

export async function getEpisodes(feedId, max = 12) {
  const { items } = await api.episodesByFeedId(feedId, null, max);
  return (items || [])
    .filter((e) => e.enclosureUrl)
    .map((e) => ({
      id: e.id,
      title: e.title,
      audioUrl: e.enclosureUrl,
      duration: e.duration,
      datePublished: e.datePublished,
      image: e.image || e.feedImage,
    }));
}
