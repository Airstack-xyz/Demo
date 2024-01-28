export const estimateTaskMutation = /* GraphQL */ `
  mutation EstimateTask($estimateTaskInput: EstimateTaskInput!) {
    EstimateTask(input: $estimateTaskInput) {
      id
      status
    }
  }
`;
