import { sdk } from './sdk'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const formatMessage = (message: string, data?: any): string => {
	if (!data) return message
	try {
		const serializedData =
			typeof data === 'object' ? JSON.stringify(data, null, 2) : data
		return `${message}\n${serializedData}`
	} catch (error) {
		return `${message}\n[Error serializing data: ${error}]`
	}
}

export const clientLog = (
	message: string,
	data?: any,
	level: LogLevel = 'info'
) => {
	const formattedMessage = formatMessage(message, data)
	console.log(`[CLIENT LOG] [${level}] ${formattedMessage}`)

	// Send log to server
	fetch('/api/log', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			message: formattedMessage,
			level,
			timestamp: new Date().toISOString(),
			context: {
				path: window.location.pathname,
				user: sdk.context.user,
				client: sdk.context.client,
			},
		}),
	}).catch(error => {
		console.error('Failed to send log to server:', error)
	})
}

// Optional: Override console.log, console.error, etc. to use clientLog
/*
const originalConsoleLog = console.log;
console.log = (...args) => {
  originalConsoleLog(...args);
  try {
    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    clientLog('info', message);
  } catch (e) {
    originalConsoleLog('Failed to send log:', e);
  }
};

const originalConsoleError = console.error;
console.error = (...args) => {
  originalConsoleError(...args);
  try {
     const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
    clientLog('error', message);
  } catch (e) {
     originalConsoleError('Failed to send log:', e);
  }
};
// Add similar overrides for warn, info, debug if needed
*/
