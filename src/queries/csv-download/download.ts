export const downloadCsvMutation = /* GraphQL */ `
  mutation DownloadCSV($taskId: Int!) {
    DownloadCSV(input: { id: $taskId }) {
      url
    }
  }
`;
