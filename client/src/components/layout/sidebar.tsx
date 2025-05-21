import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useMediaQuery } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Home, LogOut, Menu, Settings, Trophy, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'

interface SidebarProps {
	className?: string
}

export function Sidebar({ className }: SidebarProps) {
	const [location] = useLocation()
	const isMobile = useMediaQuery('(max-width: 768px)')
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		// Close sidebar on route change on mobile
		if (isMobile) {
			setIsOpen(false)
		}
	}, [location, isMobile])

	useEffect(() => {
		// Make sure sidebar is open on desktop
		if (!isMobile) {
			setIsOpen(true)
		}
	}, [isMobile])

	const NavLink = ({
		href,
		label,
		icon: Icon,
	}: {
		href: string
		label: string
		icon: React.ElementType
	}) => {
		const isActive = location === href
		return (
			<Link href={href}>
				<a
					className={cn(
						'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
						isActive
							? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
							: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
					)}
				>
					<Icon className='h-5 w-5' />
					<span>{label}</span>
				</a>
			</Link>
		)
	}

	const navItems = [
		{ path: '/', icon: Home, label: 'Home' },
		{ path: '/achievements', icon: Trophy, label: 'Achievements' },
		{ path: '/profile/1', icon: User, label: 'Profile' },
	]

	return (
		<>
			{/* Mobile menu toggle button */}
			{isMobile && (
				<Button
					variant='ghost'
					size='icon'
					className='md:hidden fixed top-3 left-3 z-50'
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? <X /> : <Menu />}
				</Button>
			)}

			{/* Sidebar */}
			<div
				className={cn(
					'bg-white border-r border-gray-200 fixed md:sticky top-0 h-screen z-30 transition-all duration-300 transform dark:bg-gray-900 dark:border-gray-800',
					isMobile
						? isOpen
							? 'translate-x-0'
							: '-translate-x-full'
						: 'translate-x-0',
					'w-64',
					className
				)}
			>
				{/* Logo area */}
				<div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800'>
					<div className='flex items-center space-x-2'>
						<div className='bg-primary-500 text-white p-1.5 rounded'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='h-5 w-5'
							>
								<path d='M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z'></path>
								<path d='M8 14v.5'></path>
								<path d='M16 14v.5'></path>
							</svg>
						</div>
						<h1 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
							FarTrack
						</h1>
					</div>
					{isMobile && (
						<Button
							variant='ghost'
							size='icon'
							className='md:hidden'
							onClick={() => setIsOpen(false)}
						>
							<X className='h-5 w-5' />
						</Button>
					)}
				</div>

				{/* Nav links */}
				<nav className='p-4 space-y-1'>
					<div className='mb-6'>
						<p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 dark:text-gray-400'>
							Main
						</p>
						{navItems.map(item => (
							<NavLink
								key={item.path}
								href={item.path}
								label={item.label}
								icon={item.icon}
							/>
						))}
					</div>

					<div className='mb-6'>
						<p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 dark:text-gray-400'>
							Settings
						</p>
						<NavLink href='/settings' label='Settings' icon={Settings} />
						<a
							className='flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
							href='#'
						>
							<LogOut className='h-5 w-5' />
							<span>Log Out</span>
						</a>
					</div>
				</nav>

				{/* User profile area */}
				<div className='absolute bottom-0 w-full border-t border-gray-200 p-4 dark:border-gray-800'>
					<div className='flex items-center space-x-3'>
						<img
							src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=48&h=48&q=80'
							alt='User profile'
							className='h-10 w-10 rounded-full border-2 border-primary-200 dark:border-primary-900'
						/>
						<div>
							<h3 className='text-sm font-medium text-gray-800 dark:text-gray-200'>
								Alice Wilson
							</h3>
							<p className='text-xs text-gray-500 dark:text-gray-400'>@alice</p>
						</div>
						<div className='ml-auto'>
							<ThemeToggle />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
