import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'@shared': resolve(__dirname, 'shared'),
			'@assets': resolve(__dirname, 'attached_assets'),
		},
	},
	root: resolve(__dirname, 'client'),
	build: {
		outDir: 'dist/public',
		emptyOutDir: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					ui: [
						'@radix-ui/react-avatar',
						'@radix-ui/react-dialog',
						'@radix-ui/react-dropdown-menu',
						'@radix-ui/react-label',
						'@radix-ui/react-progress',
						'@radix-ui/react-select',
						'@radix-ui/react-slot',
						'@radix-ui/react-tabs',
						'@radix-ui/react-toast',
						'@radix-ui/react-tooltip',
					],
					charts: ['recharts'],
					forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
					utils: [
						'date-fns',
						'clsx',
						'tailwind-merge',
						'class-variance-authority',
					],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
	optimizeDeps: {
		include: ['@babel/preset-typescript', 'lightningcss'],
	},
})
