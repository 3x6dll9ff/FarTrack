import { QueryClient } from '@tanstack/react-query'
import { clientLog } from './clientLogger'

// API request helper
export async function apiRequest<T>(
	url: string,
	options: RequestInit = {}
): Promise<T> {
	try {
		const response = await fetch(url, {
			...options,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
		})

		if (!response.ok) {
			const errorText = await response.text()
			clientLog('error', `API request failed: ${url}`, {
				status: response.status,
				statusText: response.statusText,
				error: errorText,
			})
			throw new Error(`HTTP error ${response.status}: ${errorText}`)
		}

		const data = await response.json()
		clientLog('info', `API request successful: ${url}`, data)
		return data
	} catch (error) {
		clientLog('error', `API request failed: ${url}`, error)
		throw error
	}
}

// Create query client with default options
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: async ({ queryKey }) => {
				const url = queryKey[0] as string
				return apiRequest(url)
			},
			staleTime: 1000 * 60, // 1 minute
			cacheTime: 1000 * 60 * 5, // 5 minutes
			retry: 2,
			retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			refetchOnReconnect: true,
			onError: (error: Error) => {
				clientLog('error', 'Query error:', error)
			},
		},
		mutations: {
			retry: 1,
			onError: (error: Error) => {
				clientLog('error', 'Mutation error:', error)
			},
		},
	},
})
