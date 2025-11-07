import { defineConfig } from 'vite';
//import react from '@vitejs/plugin-react';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig({
  plugins: [
    // react(),
    reactRouter(),
    /* routesDirectory: 'app',

      routeConfig: 'app/routes.js',
      ssr: false,*/
    //}),
  ],
  /*build: {
    outDir: 'build',
  },
  envPrefix: 'VITE_',*/
});
