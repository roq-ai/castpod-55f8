import * as yup from 'yup';

export const savedEpisodeValidationSchema = yup.object().shape({
  episode_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
