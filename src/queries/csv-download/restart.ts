// TODO: generate types from this query, once BFF is ready
export const restartTaskMutation = /* GraphQL */ `
  mutation RestartTask($taskId: Int!) {
    RestartTask(input: { id: $taskId }) {
      id
    }
  }
`;
