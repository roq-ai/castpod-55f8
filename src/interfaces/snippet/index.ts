import { EpisodeInterface } from 'interfaces/episode';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SnippetInterface {
  id?: string;
  start_time: number;
  end_time: number;
  episode_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  episode?: EpisodeInterface;
  user?: UserInterface;
  _count?: {};
}

export interface SnippetGetQueryInterface extends GetQueryInterface {
  id?: string;
  episode_id?: string;
  user_id?: string;
}
