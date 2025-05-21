import { Router } from 'express'

const router = Router()
const APP_URL = process.env.VITE_APP_URL || 'http://localhost:3000'

router.post('/frame', async (req, res) => {
	try {
		const { untrustedData, trustedData } = req.body

		// Basic validation
		if (!untrustedData || !trustedData) {
			return res.status(400).json({ error: 'Invalid request data' })
		}

		// Process the frame interaction
		const buttonIndex = untrustedData.buttonIndex
		const fid = trustedData.fid

		// Handle different button actions
		switch (buttonIndex) {
			case 1: // Open App
				return res.json({
					type: 'redirect',
					url: `${APP_URL}/app?fid=${fid}`,
				})
			default:
				return res.json({
					type: 'message',
					message: 'Welcome to FarTrack!',
				})
		}
	} catch (error) {
		console.error('Frame processing error:', error)
		return res.status(500).json({ error: 'Internal Server Error' })
	}
})

export default router
