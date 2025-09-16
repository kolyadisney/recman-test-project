import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/recman-test-project/',
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: { plugins: ['@emotion/babel-plugin'] },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
  },
});
