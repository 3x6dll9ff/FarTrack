import { clientLog } from '@/lib/clientLogger'
import { type FrameContext } from '@farcaster/frame-sdk'
import { Home, Trophy, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const navItems = [
	{ path: '/', icon: Home, label: 'Home' },
	{ path: '/achievements', icon: Trophy, label: 'Achievements' },
	{ path: '/profile/1', icon: User, label: 'Profile' },
]

interface BottomNavProps {
	user?: FrameContext['user']
}

export function BottomNav({ user }: BottomNavProps) {
	const location = useLocation()
	const navigate = useNavigate()

	const handleNavigation = (path: string) => {
		clientLog('info', 'Navigating to:', {
			path,
			currentPath: location.pathname,
		})
		navigate(path)
	}

	return (
		<div className='w-full bg-[#252525] border-t border-[#333333] fixed bottom-0 left-0 right-0 safe-bottom'>
			<div className='max-w-screen-xl mx-auto px-4'>
				<div className='flex items-center justify-between'>
					{navItems.map(({ path, icon: Icon, label }) => {
						const isActive =
							location.pathname === path ||
							(path === '/profile/me' &&
								location.pathname.startsWith('/profile/'))

						return (
							<button
								key={path}
								onClick={() => handleNavigation(path)}
								className={`flex flex-col items-center justify-center flex-1 h-full py-2
									${
										isActive
											? 'text-purple-400'
											: 'text-gray-400 hover:text-gray-300'
									} transition-colors`}
							>
								<Icon className='h-6 w-6' />
								<span className='text-xs mt-1'>{label}</span>
							</button>
						)
					})}
				</div>
			</div>
		</div>
	)
}
