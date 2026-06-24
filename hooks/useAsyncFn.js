import { useCallback, useRef, useState } from "react";

// https://github.com/streamich/react-use/blob/master/src/useAsyncFn.ts
export function useAsyncFn(fn, deps = [], initialState = { loading: false }) {
  const lastCallId = useRef(0);
  const [state, setState] = useState(initialState);

  const callback = useCallback((...args) => {
    const callId = ++lastCallId.current;

    if (!state.loading) {
      setState((prev) => ({ ...prev, loading: true }));
    }

    return fn(...args).then(
      (value) => {
        if (callId === lastCallId.current) setState({ value, loading: false });
        return value;
      },
      (error) => {
        if (callId === lastCallId.current) setState({ error, loading: false });
        return error;
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, deps);

  return [state, callback];
}
