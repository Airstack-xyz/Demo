import type { CodegenConfig } from "@graphql-codegen/cli";

const bffQueryFolders = ["auth", "csv-download"];
const prodQueryFolders = ["channels"];

const getDocumentPaths = (fathNames: string[]) => {
  return fathNames.reduce(
    (x: string[], name) => [
      ...x,
      `src/queries/${name}/**/*.tsx`,
      `src/queries/${name}/**/*.ts`,
    ],
    []
  );
};

// codegen-config: https://the-guild.dev/graphql/codegen/docs/config-reference/codegen-config
const config: CodegenConfig = {
  overwrite: true,
  documents: ["src/queries/**/*.tsx", "src//queries**/*.ts"],
  generates: {
    "__generated__/types.ts": {
      documents: getDocumentPaths(bffQueryFolders),
      schema: "https://backend.uat.airstack.xyz/graphql",
      plugins: ["typescript", "typescript-operations"],
      // config options: https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations
      config: {
        avoidOptionals: true, // see: https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations#avoidoptionals
      },
    },
    "__generated__/airstack-types.ts": {
      documents: getDocumentPaths(prodQueryFolders),
      schema: "https://api.airstack.xyz/gql",
      plugins: ["typescript", "typescript-operations"],
      // config options: https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations
      config: {
        avoidOptionals: true, // see: https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations#avoidoptionals
      },
    },
  },
};

export default config;
