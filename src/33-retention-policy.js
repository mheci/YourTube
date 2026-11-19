// Pure retention decisions. This does not remove data: persistence must move
// expired groups atomically to trash and resolve restore/import conflicts first.
const RetentionPolicy = (() => {
  const trashWindow = 7 * 86400000;
  // UTC calendar months: Jan 31 + 3 months is Apr 30, not May 1.
  function plusMonths(timestamp, months = 3) {
    const d = new Date(timestamp);
    if (!Number.isFinite(d.getTime()) || !Number.isInteger(months)) return NaN;
    const day = d.getUTCDate();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + months);
    const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(day,last));
    return d.getTime();
  }
  function groups(sessions, gapMinutes = 60) {
    const gap = Math.max(0, Math.min(1440, Number.isFinite(Number(gapMinutes)) ? Number(gapMinutes) : 60)) * 60000;
    const valid = [], undated = [];
    for (const session of Array.isArray(sessions) ? sessions : []) {
      const start = Number(session?.start), end = Number(session?.end);
      if (!session || !Number.isFinite(start) || start <= 0 || !Number.isFinite(new Date(start).getTime())) { undated.push(session); continue; }
      valid.push({session, start, end:Number.isFinite(end) && end >= start && Number.isFinite(new Date(end).getTime()) ? end : start});
    }
    valid.sort((a,b)=>a.start-b.start);
    const output=[];
    for (const item of valid) {
      let group=output[output.length-1];
      // Determine the visit boundary from time alone. Exempt sessions still
      // bridge nearby visits, but exemption is applied per session below.
      if (!group || item.start-group.end>gap) {
        group={start:item.start,end:item.end,sessions:[]}; output.push(group);
      }
      group.end=Math.max(group.end,item.end); group.sessions.push(item.session);
    }
    return {groups:output,undated};
  }
  function classify(sessions, now, gapMinutes = 60) {
    const grouped=groups(sessions,gapMinutes), active=[], trash=[], discard=[];
    for (const group of grouped.groups) {
      const expiresAt=plusMonths(group.end), trashExpiresAt=expiresAt+trashWindow;
      const result={...group,expiresAt,trashExpiresAt};
      if (!Number.isFinite(expiresAt) || !Number.isFinite(now) || expiresAt>now) {
        active.push(result);
        continue;
      }
      const exempt = group.sessions.filter(session => session.retentionExempt === true);
      const expiring = group.sessions.filter(session => session.retentionExempt !== true);
      if (exempt.length) active.push({...result,sessions:exempt});
      if (expiring.length) (trashExpiresAt>now ? trash : discard).push({...result,sessions:expiring});
    }
    return {active,trash,discard,undated:grouped.undated};
  }
  // Notes/bookmarks use `at`; entire collections use `createdAt`. Preserve
  // legacy items without a trustworthy creation date instead of guessing.
  function classifyCreated(item, createdField, now) {
    if (item?.retentionExempt === true) return {state:'active', reason:'exempt'};
    const raw = item && item[createdField];
    const createdAt = typeof raw === 'number' ? raw : NaN;
    if (!Number.isFinite(createdAt) || createdAt <= 0 || !Number.isFinite(new Date(createdAt).getTime()) || !Number.isFinite(now) || createdAt > now)
      return {state:'active', reason:'unknown-creation'};
    const expiresAt = plusMonths(createdAt), trashExpiresAt = expiresAt + trashWindow;
    if (!Number.isFinite(expiresAt) || expiresAt > now) return {state:'active', expiresAt};
    return {state:trashExpiresAt > now ? 'trash' : 'discard', expiresAt, trashExpiresAt};
  }
  return {plusMonths,groups,classify,classifyCreated,trashWindow};
})();
