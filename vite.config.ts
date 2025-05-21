import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	root: resolve(__dirname, 'client'),
	build: {
		outDir: resolve(__dirname, 'dist/public'),
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'client/index.html'),
			},
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom', 'wouter'],
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
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './client/src'),
			'@shared': resolve(__dirname, './shared'),
		},
	},
	server: {
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
			},
			'/ws': {
				target: 'ws://localhost:3000',
				ws: true,
			},
		},
	},
})
