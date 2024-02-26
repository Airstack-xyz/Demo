import { useCallback } from 'react';
import {
  EstimateTaskInput,
  EstimateTaskMutation,
  EstimateTaskMutationVariables
} from '../../__generated__/types';
import { triggerNewTaskAddedEvent } from '../Components/CSVDownload/utils';
import { estimateTaskMutation } from '../queries/csv-download/estimate';
import { CSVDownloadOption } from '../types';
import { useCSVQuery } from './useCSVQuery';
import { useAuth } from './useAuth';
import { showToast } from '../utils/showToast';
const maxAllowedRows = 1000000; // 1 million

const fileType = '.zip';

function formatFileName(name: string) {
  // Remove non-ascii letter from filename, s3 throws this error due this https://stackoverflow.com/questions/18389560/how-to-use-unicode-characters-in-s3s-response-content-disposition-header
  // See: https://www.geeksforgeeks.org/how-to-remove-all-non-ascii-characters-from-the-string-using-javascript/
  // eslint-disable-next-line no-control-regex
  return name.replace(/[^\x00-\x7F]/g, '');
}

export function useEstimateTask() {
  const { user, login } = useAuth();
  const [estimateTask, data] = useCSVQuery<
    EstimateTaskMutation,
    EstimateTaskMutationVariables
  >(estimateTaskMutation);

  const downloadCSV = useCallback(
    async (
      key: CSVDownloadOption['key'],
      fileName: CSVDownloadOption['fileName'],
      variables: CSVDownloadOption['variables'],
      filters?: CSVDownloadOption['filters'],
      totalSupply?: number
    ) => {
      if (!user) {
        login(true);
        return;
      }

      if (
        !key.toLocaleLowerCase().includes('erc20') &&
        totalSupply &&
        totalSupply > maxAllowedRows
      ) {
        showToast(
          ' This file is rather large. Please contact csv@airstack.xyz for more help. ',
          'warning',
          7000
        );
        return;
      }

      const formattedFilename = formatFileName(fileName);

      const name = formattedFilename.endsWith(fileType)
        ? formattedFilename
        : `${formattedFilename}${fileType}`;

      const payload: Pick<CSVDownloadOption, 'variables' | 'filters'> & {
        query: string;
        name: string;
      } = {
        query: key,
        name,
        variables
      };

      if (filters) {
        payload['filters'] = filters;
      }

      const { data } = await estimateTask({
        estimateTaskInput: payload as EstimateTaskInput
      });
      if (data?.EstimateTask?.id) {
        triggerNewTaskAddedEvent(data.EstimateTask.id);
      }
    },
    [user, estimateTask, login]
  );
  return [downloadCSV, data] as const;
}
