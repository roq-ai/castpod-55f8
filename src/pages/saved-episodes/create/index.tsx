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
import { createSavedEpisode } from 'apiSdk/saved-episodes';
import { Error } from 'components/error';
import { savedEpisodeValidationSchema } from 'validationSchema/saved-episodes';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EpisodeInterface } from 'interfaces/episode';
import { UserInterface } from 'interfaces/user';
import { getEpisodes } from 'apiSdk/episodes';
import { getUsers } from 'apiSdk/users';
import { SavedEpisodeInterface } from 'interfaces/saved-episode';

function SavedEpisodeCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SavedEpisodeInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSavedEpisode(values);
      resetForm();
      router.push('/saved-episodes');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SavedEpisodeInterface>({
    initialValues: {
      episode_id: (router.query.episode_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: savedEpisodeValidationSchema,
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
            Create Saved Episode
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
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
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
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
  entity: 'saved_episode',
  operation: AccessOperationEnum.CREATE,
})(SavedEpisodeCreatePage);
