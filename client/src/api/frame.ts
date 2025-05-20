import { apiRequest } from '@/lib/queryClient'
import { NextResponse } from 'next/server'

interface FrameResponse {
	success: boolean
	data?: any
	error?: string
}

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const { untrustedData, trustedData } = body

		// Verify the request is from Warpcast
		if (!trustedData?.messageBytes) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		// Process the frame interaction
		const buttonIndex = untrustedData.buttonIndex
		const fid = trustedData.fid

		// Handle different button actions
		switch (buttonIndex) {
			case 1: // Open FarTrack
				return NextResponse.json({
					type: 'redirect',
					url: `https://your-domain.com?fid=${fid}`,
				})
			default:
				return NextResponse.json({
					type: 'message',
					message: 'Welcome to FarTrack!',
				})
		}
	} catch (error) {
		console.error('Frame processing error:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

/**
 * API клиент для работы с фреймами
 */
export const frameApi = {
	/**
	 * Получить список фреймов
	 */
	async getFrames(): Promise<FrameResponse> {
		try {
			const response = await apiRequest('GET', '/api/frames')
			return { success: true, data: response }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},

	/**
	 * Создать новый фрейм
	 */
	async createFrame(data: any): Promise<FrameResponse> {
		try {
			const response = await apiRequest('POST', '/api/frames', data)
			return { success: true, data: response }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},

	/**
	 * Обновить существующий фрейм
	 */
	async updateFrame(id: string, data: any): Promise<FrameResponse> {
		try {
			const response = await apiRequest('PUT', `/api/frames/${id}`, data)
			return { success: true, data: response }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},

	/**
	 * Удалить фрейм
	 */
	async deleteFrame(id: string): Promise<FrameResponse> {
		try {
			const response = await apiRequest('DELETE', `/api/frames/${id}`)
			return { success: true, data: response }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	},
}
