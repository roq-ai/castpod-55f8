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
import { getSavedEpisodeById, updateSavedEpisodeById } from 'apiSdk/saved-episodes';
import { Error } from 'components/error';
import { savedEpisodeValidationSchema } from 'validationSchema/saved-episodes';
import { SavedEpisodeInterface } from 'interfaces/saved-episode';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EpisodeInterface } from 'interfaces/episode';
import { UserInterface } from 'interfaces/user';
import { getEpisodes } from 'apiSdk/episodes';
import { getUsers } from 'apiSdk/users';

function SavedEpisodeEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SavedEpisodeInterface>(
    () => (id ? `/saved-episodes/${id}` : null),
    () => getSavedEpisodeById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SavedEpisodeInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSavedEpisodeById(id, values);
      mutate(updated);
      resetForm();
      router.push('/saved-episodes');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SavedEpisodeInterface>({
    initialValues: data,
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
            Edit Saved Episode
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'saved_episode',
  operation: AccessOperationEnum.UPDATE,
})(SavedEpisodeEditPage);
