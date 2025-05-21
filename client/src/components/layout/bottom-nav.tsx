import { cn } from '@/lib/utils'
import { Home, Trophy, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const navItems = [
	{
		label: 'Home',
		icon: Home,
		path: '/',
	},
	{
		label: 'Achievements',
		icon: Trophy,
		path: '/achievements',
	},
	{
		label: 'Profile',
		icon: User,
		path: '/profile',
	},
]

export function BottomNav() {
	const location = useLocation()
	const navigate = useNavigate()

	return (
		<nav className='fixed bottom-0 left-0 right-0 bg-[#252525] border-t border-[#333333] safe-bottom'>
			<div className='flex justify-around items-center h-16 px-4'>
				{navItems.map(item => {
					const isActive = location.pathname === item.path
					return (
						<button
							key={item.path}
							onClick={() => navigate(item.path)}
							className={cn(
								'flex flex-col items-center justify-center w-full h-full',
								isActive ? 'text-purple-500' : 'text-gray-400'
							)}
						>
							<item.icon className='h-6 w-6' />
							<span className='text-xs mt-1'>{item.label}</span>
						</button>
					)
				})}
			</div>
		</nav>
	)
}
