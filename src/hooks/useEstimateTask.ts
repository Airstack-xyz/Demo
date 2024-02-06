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
      filters?: CSVDownloadOption['filters']
    ) => {
      if (!user) {
        login(true);
        return;
      }

      const payload: Pick<CSVDownloadOption, 'variables' | 'filters'> & {
        query: string;
        name: string;
      } = {
        query: key,
        name: fileName,
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
