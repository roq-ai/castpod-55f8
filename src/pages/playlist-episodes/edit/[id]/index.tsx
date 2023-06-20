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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPlaylistEpisodeById, updatePlaylistEpisodeById } from 'apiSdk/playlist-episodes';
import { Error } from 'components/error';
import { playlistEpisodeValidationSchema } from 'validationSchema/playlist-episodes';
import { PlaylistEpisodeInterface } from 'interfaces/playlist-episode';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlaylistInterface } from 'interfaces/playlist';
import { EpisodeInterface } from 'interfaces/episode';
import { getPlaylists } from 'apiSdk/playlists';
import { getEpisodes } from 'apiSdk/episodes';

function PlaylistEpisodeEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlaylistEpisodeInterface>(
    () => (id ? `/playlist-episodes/${id}` : null),
    () => getPlaylistEpisodeById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PlaylistEpisodeInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePlaylistEpisodeById(id, values);
      mutate(updated);
      resetForm();
      router.push('/playlist-episodes');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PlaylistEpisodeInterface>({
    initialValues: data,
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
            Edit Playlist Episode
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'playlist_episode',
  operation: AccessOperationEnum.UPDATE,
})(PlaylistEpisodeEditPage);
