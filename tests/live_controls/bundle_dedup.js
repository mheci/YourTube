async () => {
  for (const [id,keys] of [
    ['aio-player-tools',['videoNotesOn','channelNotesOn','chapterButtonsOn','chapterHotkeysOn']],
    ['aio-feed-cleanup',['hideRecs','hideLiveContentOn','hidePremieresOn','hideTopLiveGamesOn','hideAutoDubbedOn']],
    ['aio-compact-dense',['compactUI','denseVideoGridOn','compactPlaylistOn','playlistAutoscrollOn']],
    ['aio-privacy-shield',['removeRedirectUrlsOn','shortenShareUrlOn','blockYTAIOn']],
  ]) await trial(id,'member-controls','Bundle master does not duplicate settings owned by individual feature cards',async r=>{
    pick(id);r.duplicates=keys.filter(key=>!!pane(id).querySelector(`[data-key="${key}"]`));
    if(r.duplicates.length)throw Error('Duplicated settings: '+r.duplicates.join(','));r.pass=true;
  });
  return rows;
};
