import { WebSocket, WebSocketServer } from 'ws'

function log(message: string, source = 'websocket') {
	const formattedTime = new Date().toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	})
	console.log(`${formattedTime} [${source}] ${message}`)
}

export function setupWebSocket(wss: WebSocketServer) {
	wss.on('connection', (ws: WebSocket) => {
		log('New WebSocket connection')

		ws.on('message', (message: Buffer) => {
			try {
				const data = JSON.parse(message.toString())
				log(`Received message: ${JSON.stringify(data)}`)

				// Здесь можно добавить обработку сообщений
				ws.send(JSON.stringify({ type: 'ack', data: 'Message received' }))
			} catch (error) {
				log(`Error parsing message: ${error}`, 'error')
				ws.send(
					JSON.stringify({ type: 'error', message: 'Invalid message format' })
				)
			}
		})

		ws.on('close', () => {
			log('Client disconnected')
		})

		ws.on('error', (error: Error) => {
			log(`WebSocket error: ${error}`, 'error')
		})

		// Отправляем приветственное сообщение
		ws.send(
			JSON.stringify({
				type: 'welcome',
				message: 'Connected to WebSocket server',
			})
		)
	})

	wss.on('error', (error: Error) => {
		log(`WebSocket server error: ${error}`)
	})

	log('WebSocket server initialized')
}
