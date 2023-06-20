import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPlaylistEpisode } from 'apiSdk/playlist-episodes';
import { Error } from 'components/error';
import { playlistEpisodeValidationSchema } from 'validationSchema/playlist-episodes';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlaylistInterface } from 'interfaces/playlist';
import { EpisodeInterface } from 'interfaces/episode';
import { getPlaylists } from 'apiSdk/playlists';
import { getEpisodes } from 'apiSdk/episodes';
import { PlaylistEpisodeInterface } from 'interfaces/playlist-episode';

function PlaylistEpisodeCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PlaylistEpisodeInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPlaylistEpisode(values);
      resetForm();
      router.push('/playlist-episodes');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PlaylistEpisodeInterface>({
    initialValues: {
      playlist_id: (router.query.playlist_id as string) ?? null,
      episode_id: (router.query.episode_id as string) ?? null,
    },
    validationSchema: playlistEpisodeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Playlist Episode
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<PlaylistInterface>
            formik={formik}
            name={'playlist_id'}
            label={'Select Playlist'}
            placeholder={'Select Playlist'}
            fetcher={getPlaylists}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<EpisodeInterface>
            formik={formik}
            name={'episode_id'}
            label={'Select Episode'}
            placeholder={'Select Episode'}
            fetcher={getEpisodes}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.title}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'playlist_episode',
  operation: AccessOperationEnum.CREATE,
})(PlaylistEpisodeCreatePage);
