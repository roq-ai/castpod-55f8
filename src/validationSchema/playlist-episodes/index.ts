import * as yup from 'yup';

export const playlistEpisodeValidationSchema = yup.object().shape({
  playlist_id: yup.string().nullable(),
  episode_id: yup.string().nullable(),
});
