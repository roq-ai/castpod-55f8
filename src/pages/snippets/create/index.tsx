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
import { createSnippet } from 'apiSdk/snippets';
import { Error } from 'components/error';
import { snippetValidationSchema } from 'validationSchema/snippets';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { EpisodeInterface } from 'interfaces/episode';
import { UserInterface } from 'interfaces/user';
import { getEpisodes } from 'apiSdk/episodes';
import { getUsers } from 'apiSdk/users';
import { SnippetInterface } from 'interfaces/snippet';

function SnippetCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SnippetInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSnippet(values);
      resetForm();
      router.push('/snippets');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SnippetInterface>({
    initialValues: {
      start_time: 0,
      end_time: 0,
      episode_id: (router.query.episode_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: snippetValidationSchema,
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
            Create Snippet
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="start_time" mb="4" isInvalid={!!formik.errors?.start_time}>
            <FormLabel>Start Time</FormLabel>
            <NumberInput
              name="start_time"
              value={formik.values?.start_time}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('start_time', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.start_time && <FormErrorMessage>{formik.errors?.start_time}</FormErrorMessage>}
          </FormControl>
          <FormControl id="end_time" mb="4" isInvalid={!!formik.errors?.end_time}>
            <FormLabel>End Time</FormLabel>
            <NumberInput
              name="end_time"
              value={formik.values?.end_time}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('end_time', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.end_time && <FormErrorMessage>{formik.errors?.end_time}</FormErrorMessage>}
          </FormControl>
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
  entity: 'snippet',
  operation: AccessOperationEnum.CREATE,
})(SnippetCreatePage);
