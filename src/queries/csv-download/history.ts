export const historyQuery = /* GraphQL */ `
  query GetTasksHistory($status: [Status] = []) {
    GetCSVDownloadTasks(input: { status: $status }) {
      variables
      userId
      id
      filters
      name
      totalRows
      status
      retryCount
      query
      downloadedAt
      creditPrice
      creditsUsed
      completedAt
      createdAt
      updatedAt
      fileSize
    }
  }
`;
