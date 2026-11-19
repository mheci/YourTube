// Analytics use recorded sessions, not a video's lifetime total attributed to
// its most recent day. Legacy totals without dated sessions remain unallocated.
const WatchAnalytics = (() => {
  function summarize(rows, cutoff, gapMinutes = 60) {
    const gap = Math.max(0, Math.min(1440, Number.isFinite(Number(gapMinutes)) ? Number(gapMinutes) : 60)) * 60000;
    const channels = new Map(), days = new Map();
    let seconds = 0, videos = 0, groups = 0, unallocatedSeconds = 0;
    for (const row of rows || []) {
      if (!row || !row.videoId) continue;
      const all = (Array.isArray(row.sessions) ? row.sessions : []).filter(s => s && Number.isFinite(Number(s.start)) && Number(s.start) > 0 && Number(s.start) <= 8640000000000000);
      let datedSeconds = 0;
      for (const session of all) {
        const duration = Number(session.played);
        if (Number.isFinite(duration) && duration >= 0) datedSeconds += duration;
      }
      const lifetime = Number(row.totalWatchTime);
      if (Number.isFinite(lifetime) && lifetime > datedSeconds) unallocatedSeconds += lifetime - datedSeconds;
      const current = all.filter(s => Number(s.start) >= cutoff).sort((a,b) => Number(a.start)-Number(b.start));
      if (!current.length) continue;
      videos++;
      let previousEnd = -Infinity, channelSeconds = 0;
      for (const session of current) {
        const start = Number(session.start), rawEnd = Number(session.end);
        const end = Number.isFinite(rawEnd) && rawEnd >= start && rawEnd <= 8640000000000000 ? rawEnd : start;
        if (start - previousEnd > gap) groups++;
        previousEnd = Math.max(previousEnd, end);
        const duration = Number(session.played);
        if (!Number.isFinite(duration) || duration < 0) continue;
        seconds += duration;
        channelSeconds += duration;
        const day = new Date(start).toISOString().slice(0,10);
        days.set(day, (days.get(day) || 0) + duration);
      }
      const channel = row.channel || 'Unknown';
      channels.set(channel, (channels.get(channel) || 0) + channelSeconds);
    }
    return { seconds, videos, groups, unallocatedSeconds, channels, days };
  }
  return { summarize };
})();
