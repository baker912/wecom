import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 使用相对路径，确保在任何部署路径下都能正常访问
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // 指定静态资源目录
    emptyOutDir: true, // 构建前清空输出目录
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    host: true,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
