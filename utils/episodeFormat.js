export function formatDuration(seconds) {
  if (!seconds) return null;

  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

export function formatDate(unixSeconds) {
  if (!unixSeconds) return null;

  return new Date(unixSeconds * 1000).toLocaleDateString();
}
