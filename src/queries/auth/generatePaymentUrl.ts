export const GeneratePaymentUrlQuery = /* GraphQL */ `
  query GenerateUrl($input: GenerateUrlInput!) {
    GenerateUrl(input: $input) {
      url
      id
    }
  }
`;
