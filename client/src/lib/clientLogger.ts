export const clientLog = (
	level: string,
	message: string,
	metadata?: Record<string, any>
) => {
	if (process.env.NODE_ENV === 'production') {
		// Only send logs in production/Mini App environment
		fetch('/api/log', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ level, message, ...metadata }),
		}).catch(error => {
			console.error('Failed to send client log:', error) // Fallback to console.error if sending fails
		})
	} else {
		// In development, just use console.log
		const logMessage = `[CLIENT DEV LOG] [${level}] ${message}`
		if (metadata) {
			console.log(logMessage, metadata)
		} else {
			console.log(logMessage)
		}
	}
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
