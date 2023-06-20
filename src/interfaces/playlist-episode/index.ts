import { PlaylistInterface } from 'interfaces/playlist';
import { EpisodeInterface } from 'interfaces/episode';
import { GetQueryInterface } from 'interfaces';

export interface PlaylistEpisodeInterface {
  id?: string;
  playlist_id?: string;
  episode_id?: string;
  created_at?: any;
  updated_at?: any;

  playlist?: PlaylistInterface;
  episode?: EpisodeInterface;
  _count?: {};
}

export interface PlaylistEpisodeGetQueryInterface extends GetQueryInterface {
  id?: string;
  playlist_id?: string;
  episode_id?: string;
}
