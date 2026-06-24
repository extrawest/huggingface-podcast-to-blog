import { useEffect } from "react";
import { App } from "antd";
import * as api from "@/lib/api";
import { useAsyncFn } from "@/hooks/useAsyncFn";

export function useEpisodePipeline(episode) {
  const { message } = App.useApp();

  const [transcript, transcribe] = useAsyncFn((url) => api.transcribe(url));
  const [summary, summarize] = useAsyncFn((text) => api.summarize(text));
  const [title, makeTitle] = useAsyncFn((text) => api.generateTitle(text));
  const [image, makeImage] = useAsyncFn((text) => api.generateCover(text));
  const [audio, makeAudio] = useAsyncFn((text) => api.synthesizeSpeech(text));

  useEffect(() => {
    async function runStep(label, action, input) {
      const result = await action(input);
      if (result instanceof Error) {
        message.error(`${label} failed: ${result.message}`);
        return null;
      }
      return result;
    }

    async function runPipeline() {
      const text = await runStep("Transcription", transcribe, episode.audioUrl);
      if (!text) return;

      const summaryText = await runStep("Summary", summarize, text);
      if (!summaryText) return;

      await Promise.all([
        runStep("Title", makeTitle, summaryText),
        runStep("Image", makeImage, summaryText),
        runStep("Audio", makeAudio, summaryText),
      ]);
    }

    runPipeline();
  }, []);

  return {
    transcript: transcript.value,
    transcribing: transcript.loading,
    summary: summary.value,
    summarizing: summary.loading,
    title: title.value,
    titleLoading: title.loading,
    image: image.value,
    imageLoading: image.loading,
    audio: audio.value,
    ttsLoading: audio.loading,
  };
}
