declare global {
	interface Window {
		farcaster: any
	}
}

// Инициализация SDK
export const farcaster = window.farcaster

// Проверка, запущено ли приложение в Farcaster
export const isInFarcaster = () => {
	return farcaster.isInFarcaster()
}

// Получение информации о пользователе
export const getUserInfo = async () => {
	try {
		const user = await farcaster.getUser()
		return user
	} catch (error) {
		console.error('Error getting user info:', error)
		return null
	}
}

// Отправка уведомления
export const sendNotification = async (message: string) => {
	try {
		await farcaster.sendNotification({
			message,
		})
	} catch (error) {
		console.error('Error sending notification:', error)
	}
}

// Взаимодействие с Ethereum кошельком
export const connectWallet = async () => {
	try {
		const wallet = await farcaster.connectWallet()
		return wallet
	} catch (error) {
		console.error('Error connecting wallet:', error)
		return null
	}
}
