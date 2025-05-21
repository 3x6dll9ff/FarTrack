import { BottomNav } from '@/components/layout/bottom-nav'
import { clientLog } from '@/lib/clientLogger'
import { useEffect } from 'react'

interface AppLayoutProps {
	children: React.ReactNode
	title?: string
}

export function AppLayout({ children, title }: AppLayoutProps) {
	useEffect(() => {
		if (title) {
			document.title = title
		}
	}, [title])

	clientLog('info', 'Rendering AppLayout')

	return (
		<div className='h-screen w-screen bg-[#1a1a1a] text-white flex flex-col'>
			<main className='flex-1 h-full w-full pb-20 safe-bottom'>{children}</main>
			<BottomNav />
		</div>
	)
}
