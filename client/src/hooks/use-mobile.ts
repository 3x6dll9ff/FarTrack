import { useCallback, useEffect, useState } from 'react'

/**
 * Хук для определения мобильного устройства по медиа-запросу
 * @param query - CSS медиа-запрос
 * @returns boolean - true если устройство соответствует запросу
 */
export const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState<boolean>(false)

	const handleChange = useCallback((event: MediaQueryListEvent) => {
		setMatches(event.matches)
	}, [])

	useEffect(() => {
		const media = window.matchMedia(query)

		// Устанавливаем начальное значение
		setMatches(media.matches)

		// Добавляем слушатель изменений
		media.addEventListener('change', handleChange)

		// Очищаем слушатель при размонтировании
		return () => media.removeEventListener('change', handleChange)
	}, [query, handleChange])

	return matches
}
