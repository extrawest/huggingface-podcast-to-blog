import { useState } from "react";
import { App } from "antd";
import * as api from "@/lib/api";
import { useAsyncFn } from "@/hooks/useAsyncFn";

export function useTranslation(text) {
  const { message } = App.useApp();
  const [state, translate] = useAsyncFn((t) => api.translate(t));
  const [showing, setShowing] = useState(false);

  async function toggle() {
    if (state.value) {
      setShowing((v) => !v);
      return;
    }
    const result = await translate(text);
    if (result instanceof Error) {
      message.error(`Translation failed: ${result.message}`);
      return;
    }
    setShowing(true);
  }

  return { french: state.value, showing, translating: state.loading, toggle };
}
