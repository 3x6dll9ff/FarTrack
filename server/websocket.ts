import { WebSocketServer } from 'ws'
import { log } from './vite'

export function setupWebSocket(wss: WebSocketServer) {
	wss.on('connection', ws => {
		log('New WebSocket connection established')

		ws.on('message', message => {
			try {
				const data = JSON.parse(message.toString())
				log(`Received message: ${JSON.stringify(data)}`)

				// Здесь можно добавить обработку сообщений
				ws.send(JSON.stringify({ type: 'ack', data: 'Message received' }))
			} catch (error) {
				log(`Error processing message: ${error}`)
				ws.send(
					JSON.stringify({ type: 'error', message: 'Invalid message format' })
				)
			}
		})

		ws.on('close', () => {
			log('WebSocket connection closed')
		})

		ws.on('error', error => {
			log(`WebSocket error: ${error}`)
		})

		// Отправляем приветственное сообщение
		ws.send(
			JSON.stringify({
				type: 'welcome',
				message: 'Connected to WebSocket server',
			})
		)
	})

	wss.on('error', error => {
		log(`WebSocket server error: ${error}`)
	})

	log('WebSocket server initialized')
}
