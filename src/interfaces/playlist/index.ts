import { PlaylistEpisodeInterface } from 'interfaces/playlist-episode';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PlaylistInterface {
  id?: string;
  name: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  playlist_episode?: PlaylistEpisodeInterface[];
  user?: UserInterface;
  _count?: {
    playlist_episode?: number;
  };
}

export interface PlaylistGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
}
