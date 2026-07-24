function retryOn(err) {
  const msg = String(err?.message || err);
  return /\b(429|500|502|503|504)\b|loading|timeout|ETIMEDOUT|ECONNRESET|ECONNREFUSED|EAI_AGAIN|fetch failed|network/i.test(
    msg
  );
}

export const RETRY_OPTIONS = {
  retryOn,
};
