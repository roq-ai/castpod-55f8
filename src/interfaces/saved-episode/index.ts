import { EpisodeInterface } from 'interfaces/episode';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SavedEpisodeInterface {
  id?: string;
  episode_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  episode?: EpisodeInterface;
  user?: UserInterface;
  _count?: {};
}

export interface SavedEpisodeGetQueryInterface extends GetQueryInterface {
  id?: string;
  episode_id?: string;
  user_id?: string;
}
