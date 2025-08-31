import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/coding-agent-omikuji-demo-v2/',
  build: {
    outDir: 'dist'
  }
});