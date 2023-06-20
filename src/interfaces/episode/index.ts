import { PlaylistEpisodeInterface } from 'interfaces/playlist-episode';
import { SavedEpisodeInterface } from 'interfaces/saved-episode';
import { SnippetInterface } from 'interfaces/snippet';
import { PodcastInterface } from 'interfaces/podcast';
import { GetQueryInterface } from 'interfaces';

export interface EpisodeInterface {
  id?: string;
  title: string;
  url: string;
  podcast_id?: string;
  created_at?: any;
  updated_at?: any;
  playlist_episode?: PlaylistEpisodeInterface[];
  saved_episode?: SavedEpisodeInterface[];
  snippet?: SnippetInterface[];
  podcast?: PodcastInterface;
  _count?: {
    playlist_episode?: number;
    saved_episode?: number;
    snippet?: number;
  };
}

export interface EpisodeGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  url?: string;
  podcast_id?: string;
}
