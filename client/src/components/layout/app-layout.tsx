import { BottomNav } from '@/components/layout/bottom-nav'
import { clientLog } from '@/lib/clientLogger'
import { type FrameContext } from '@farcaster/frame-sdk'
import { useEffect } from 'react'

interface AppLayoutProps {
	children: React.ReactNode
	title?: string
	user?: FrameContext['user']
}

export function AppLayout({ children, title, user }: AppLayoutProps) {
	useEffect(() => {
		if (title) {
			document.title = title
		}
	}, [title])

	clientLog('info', 'Rendering AppLayout', { user })

	return (
		<div className='h-screen w-screen bg-[#1a1a1a] text-white flex flex-col'>
			<main className='flex-1 h-full w-full pb-24 safe-bottom'>{children}</main>
			<BottomNav user={user} />
		</div>
	)
}
