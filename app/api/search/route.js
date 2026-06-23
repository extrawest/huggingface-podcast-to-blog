import { searchPodcasts, getEpisodes } from "@/lib/podcastindex";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const feedId = searchParams.get("feedId");
  const q = searchParams.get("q");
  try {
    if (feedId) {
      return Response.json({ episodes: await getEpisodes(feedId) });
    }
    if (q) {
      return Response.json({ podcasts: await searchPodcasts(q) });
    }
    return Response.json({ error: "Provide a q or feedId parameter" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
