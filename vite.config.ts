import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteEjsPlugin } from 'vite-plugin-ejs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const publicVariables = {
    GOOGLE_TAG_MANAGER_ID: env.GOOGLE_TAG_MANAGER_ID,
    API_KEY: env.API_KEY,
    MENTION_ENDPOINT: env.MENTION_ENDPOINT
  };

  return {
    plugins: [
      ViteEjsPlugin(() => {
        return {
          // viteConfig is the current Vite resolved config
          env: {
            isProduction: mode === 'production'
          }
        };
      }),
      react()
    ],
    define: {
      'process.env': publicVariables
    },
    resolve: {
      alias: {
        '@airstack/airstack-react': '/airstack-react-sdk'
      }
    }
  };
});
