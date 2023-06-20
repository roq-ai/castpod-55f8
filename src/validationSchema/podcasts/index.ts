import * as yup from 'yup';

export const podcastValidationSchema = yup.object().shape({
  title: yup.string().required(),
  url: yup.string().required(),
  thumbnail: yup.string(),
});
