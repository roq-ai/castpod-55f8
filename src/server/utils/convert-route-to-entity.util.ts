const mapping: Record<string, string> = {
  episodes: 'episode',
  individuals: 'individual',
  playlists: 'playlist',
  'playlist-episodes': 'playlist_episode',
  podcasts: 'podcast',
  'saved-episodes': 'saved_episode',
  snippets: 'snippet',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
