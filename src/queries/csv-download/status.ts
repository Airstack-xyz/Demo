export const getTaskStatusQuery = /* GraphQL */ `
  query GetTaskStatus($taskId: Int!) {
    GetTaskStatus(input: { id: $taskId }) {
      status
      retryCount
    }
  }
`;
