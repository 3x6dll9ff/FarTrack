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
			document.title = `${title} - FarTrack`
		} else {
			document.title = 'FarTrack'
		}
	}, [title])

	useEffect(() => {
		clientLog('info', 'AppLayout rendered', {
			hasUser: !!user,
			userId: user?.fid,
			title,
		})
	}, [user, title])

	return (
		<div className='min-h-screen w-full bg-[#1a1a1a] text-white flex flex-col'>
			<main className='flex-1 w-full'>
				<div className='h-full w-full overflow-y-auto'>{children}</div>
			</main>
			<BottomNav user={user} />
		</div>
	)
}
