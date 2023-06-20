import axios from 'axios';
import queryString from 'query-string';
import { PlaylistEpisodeInterface, PlaylistEpisodeGetQueryInterface } from 'interfaces/playlist-episode';
import { GetQueryInterface } from '../../interfaces';

export const getPlaylistEpisodes = async (query?: PlaylistEpisodeGetQueryInterface) => {
  const response = await axios.get(`/api/playlist-episodes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPlaylistEpisode = async (playlistEpisode: PlaylistEpisodeInterface) => {
  const response = await axios.post('/api/playlist-episodes', playlistEpisode);
  return response.data;
};

export const updatePlaylistEpisodeById = async (id: string, playlistEpisode: PlaylistEpisodeInterface) => {
  const response = await axios.put(`/api/playlist-episodes/${id}`, playlistEpisode);
  return response.data;
};

export const getPlaylistEpisodeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/playlist-episodes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePlaylistEpisodeById = async (id: string) => {
  const response = await axios.delete(`/api/playlist-episodes/${id}`);
  return response.data;
};
