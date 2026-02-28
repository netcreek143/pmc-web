import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    Object.assign(process.env, env);

    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:3001',
                    changeOrigin: true,
                },
            },
        },
    };
})
