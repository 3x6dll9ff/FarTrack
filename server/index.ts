import express, { NextFunction, type Request, Response } from 'express'
import session from 'express-session'
import { createServer } from 'http'
import MemoryStore from 'memorystore'
import passport from 'passport'
import { WebSocketServer } from 'ws'
import { registerRoutes } from './routes'
import { log, serveStatic, setupVite } from './vite'
import { setupWebSocket } from './websocket'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

// Настройка сессий
const MemoryStoreSession = MemoryStore(session)
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'your-secret-key',
		resave: false,
		saveUninitialized: false,
		store: new MemoryStoreSession({
			checkPeriod: 86400000, // 24 часа
		}),
		cookie: {
			secure: process.env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000, // 24 часа
		},
	})
)

// Настройка Passport
app.use(passport.initialize())
app.use(passport.session())

// Health check endpoint
app.get('/health', (req, res) => {
	const healthData = {
		status: 'ok',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		memory: process.memoryUsage(),
		env: process.env.NODE_ENV,
	}
	res.status(200).json(healthData)
})

// Настройка WebSocket
setupWebSocket(wss)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
	const start = Date.now()
	const path = req.path
	let capturedJsonResponse: Record<string, any> | undefined = undefined

	const originalResJson = res.json
	res.json = function (bodyJson, ...args) {
		capturedJsonResponse = bodyJson
		return originalResJson.apply(res, [bodyJson, ...args])
	}

	res.on('finish', () => {
		const duration = Date.now() - start
		if (path.startsWith('/api')) {
			let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`
			if (capturedJsonResponse) {
				logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`
			}

			if (logLine.length > 80) {
				logLine = logLine.slice(0, 79) + '…'
			}

			log(logLine)
		}
	})

	next()
})
;(async () => {
	try {
		const server = await registerRoutes(app)

		app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
			const status = err.status || err.statusCode || 500
			const message = err.message || 'Internal Server Error'

			res.status(status).json({ message })
			log(`Error: ${message}`, 'error')
		})

		// Настройка Vite в режиме разработки
		if (process.env.NODE_ENV === 'development') {
			await setupVite(app, server)
		} else {
			serveStatic(app)
		}

		const port = process.env.PORT || 3000
		server.listen(port, '0.0.0.0', () => {
			log(`Server is running on port ${port}`)
		})
	} catch (error) {
		log(`Failed to start server: ${error}`, 'error')
		process.exit(1)
	}
})()
