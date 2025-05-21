import { ReactNode } from 'react'
import { BottomNav } from './bottom-nav'

interface AppLayoutProps {
	children: ReactNode
	showHeader?: boolean
	title?: string
}

export function AppLayout({
	children,
	showHeader = true,
	title,
}: AppLayoutProps) {
	return (
		<div className='flex flex-col min-h-screen bg-[#191919] text-white'>
			{showHeader && (
				<div className='sticky top-0 z-10 bg-[#191919] border-b border-[#333333]'>
					<div className='flex items-center justify-between px-4 py-3'>
						<div className='flex items-center'>
							<div className='bg-purple-600 text-white p-1.5 rounded mr-2'>
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
							<h1 className='text-lg font-bold text-white'>FarTrack</h1>
						</div>
					</div>
				</div>
			)}

			<main className='flex-grow pb-16'>{children}</main>

			<BottomNav />
		</div>
	)
}
