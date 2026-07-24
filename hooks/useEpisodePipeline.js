import { useEffect, useState } from "react";
import { App } from "antd";
import * as api from "@/lib/api";

export function useEpisodePipeline(episode) {
  const { message } = App.useApp();
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        await api.runPipeline(episode.audioUrl, (delta) =>
          setResult((prev) => ({ ...prev, ...delta }))
        );
      } catch (err) {
        message.error(`Pipeline failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [episode.audioUrl, message]);

  return { ...result, loading };
}
