import axios from 'axios';
import queryString from 'query-string';
import { SavedEpisodeInterface, SavedEpisodeGetQueryInterface } from 'interfaces/saved-episode';
import { GetQueryInterface } from '../../interfaces';

export const getSavedEpisodes = async (query?: SavedEpisodeGetQueryInterface) => {
  const response = await axios.get(`/api/saved-episodes${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSavedEpisode = async (savedEpisode: SavedEpisodeInterface) => {
  const response = await axios.post('/api/saved-episodes', savedEpisode);
  return response.data;
};

export const updateSavedEpisodeById = async (id: string, savedEpisode: SavedEpisodeInterface) => {
  const response = await axios.put(`/api/saved-episodes/${id}`, savedEpisode);
  return response.data;
};

export const getSavedEpisodeById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/saved-episodes/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSavedEpisodeById = async (id: string) => {
  const response = await axios.delete(`/api/saved-episodes/${id}`);
  return response.data;
};
