import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
<<<<<<< HEAD
        port: 5173,
=======
        port: 5174,
>>>>>>> dda345f (Initial commit (Slagie Platform v2))
        strictPort: true,
    },
})
