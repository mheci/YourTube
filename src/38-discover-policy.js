// Novelty is a local heuristic, not a claim about YouTube's account history.
const DiscoverPolicy = (() => {
  const normalize = s => String(s || '').trim().toLocaleLowerCase();
  function filter(videos, options) {
    const { watched, channels, shown, session, batch, now, days, excludeWatched, excludeShown, excludeChannels } = options;
    const keep = [];
    for (const video of videos || []) {
      if (!video || !/^[A-Za-z0-9_-]{11}$/.test(String(video.videoId || ''))) continue;
      const id = video.videoId;
      if (batch.has(id)) continue;
      batch.add(id);
      if (excludeWatched && watched.has(id)) continue;
      if (excludeChannels && video.channel && channels.has(normalize(video.channel))) continue;
      const at = Number(shown[id]) || 0;
      if (excludeShown && (session.has(id) || (days > 0 && at > 0 && now - at < days * 86400000))) continue;
      keep.push(video);
    }
    return keep;
  }
  return { filter, normalize };
})();
