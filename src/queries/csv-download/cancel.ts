export const cancelTaskMutation = /* GraphQL */ `
  mutation CancelTask($taskId: Int!) {
    CancelTask(input: { id: $taskId }) {
      id
    }
  }
`;
