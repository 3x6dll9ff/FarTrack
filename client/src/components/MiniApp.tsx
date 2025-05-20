import { getUserInfo, isInFarcaster, sendNotification } from '@/lib/farcaster'
import { useEffect, useState } from 'react'

export default function MiniApp() {
	const [isFarcaster, setIsFarcaster] = useState(false)
	const [user, setUser] = useState<any>(null)

	useEffect(() => {
		// Проверяем, запущено ли приложение в Farcaster
		setIsFarcaster(isInFarcaster())

		// Получаем информацию о пользователе
		const loadUser = async () => {
			const userInfo = await getUserInfo()
			setUser(userInfo)
		}

		if (isFarcaster) {
			loadUser()
		}
	}, [])

	const handleAchievement = async () => {
		if (user) {
			await sendNotification('New achievement unlocked! 🎉')
		}
	}

	if (!isFarcaster) {
		return (
			<div className='p-4 text-center'>
				<h1 className='text-2xl font-bold mb-4'>Executive Onboard</h1>
				<p>Please open this app in Farcaster to use all features.</p>
			</div>
		)
	}

	return (
		<div className='p-4'>
			<h1 className='text-2xl font-bold mb-4'>Welcome, {user?.displayName}!</h1>
			<div className='space-y-4'>
				<button
					onClick={handleAchievement}
					className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
				>
					Unlock Achievement
				</button>
				{/* Добавьте другие компоненты и функциональность здесь */}
			</div>
		</div>
	)
}
