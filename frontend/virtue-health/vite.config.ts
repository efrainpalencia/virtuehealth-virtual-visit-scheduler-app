import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import';

export default defineConfig({
  plugins: [
    react(),
    createStyleImportPlugin({
      resolves: [AndDesignVueResolve()],
    }),
  ],
  server: {
    proxy: {
        '/api': 'http://localhost:8000',
    },
},
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
                '@primary-color': '#0D54B1', // Custom primary color
              '@link-color': '#003eb3', // Custom link color
              // '@border-radius-base': '4px', // Custom border radius
        },
      },
    },
  },
});
