import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://adventofcode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Set the session cookie for AOC authentication
              proxyReq.setHeader('Cookie', `session=${env.VITE_APP_AOC_SESSION_ID}`);
            });
          },
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // Keep React, react-dom, and react-router together
              // This prevents multiple React instances
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler')) {
                return 'react-vendor';
              }
              // Heavy chart library in its own chunk
              if (id.includes('recharts') || id.includes('d3-')) {
                return 'charts';
              }
              // UI libraries that depend on React
              if (id.includes('@radix-ui') || id.includes('lucide-react') || id.includes('framer-motion')) {
                return 'ui-vendor';
              }
              // Everything else
              return 'vendor';
            }
          },
        },
      },
    },
  }
})
