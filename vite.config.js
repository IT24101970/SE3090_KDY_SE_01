import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import expressApp from './server.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    {
      name: 'express-backend-plugin',
      configureServer(server) {
        server.middlewares.use(expressApp);
      }
    }
  ]
})
