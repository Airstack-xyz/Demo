import type { CodegenConfig } from '@graphql-codegen/cli';

// codegen-config: https://the-guild.dev/graphql/codegen/docs/config-reference/codegen-config
const config: CodegenConfig = {
  overwrite: true,
  schema: [
    'https://backend.uat.airstack.xyz/graphql',
    'http://localhost:8080/graphql'
  ],
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    '__generated__/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
      // config options: https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations
      config: {
        avoidOptionals: true // see: https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations#avoidoptionals
      }
    }
  }
};

export default config;
