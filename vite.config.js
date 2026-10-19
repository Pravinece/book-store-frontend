import { defineConfig , loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const configuredAppPath = process.env.VITE_APP_URL ?? env.VITE_APP_URL;
  const appPath = configuredAppPath?.trim().replace(/^\/+|\/+$/g, '');
  const base = appPath ? `/${appPath}/` : '/';

  return {
    plugins: [react(), tailwindcss()],
    base,
    build: {
      outDir: appPath || 'dist',
    },
    server: {
      headers: {
        'X-Frame-Options': 'DENY',
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'https://book-store-backend-czfy.onrender.com',
          changeOrigin: true,
        },
      },
    },
  }
})