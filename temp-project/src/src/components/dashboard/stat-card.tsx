import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface StatCardProps {
	title: string
	value: string | number
	icon?: ReactNode
	className?: string
}

export function StatCard({ title, value, icon, className }: StatCardProps) {
	return (
		<div
			className={cn(
				'bg-[#252525] rounded-xl shadow-sm border border-[#333333] p-5',
				className
			)}
		>
			<div className='flex items-center justify-between'>
				<h3 className='text-gray-400 text-sm font-medium'>{title}</h3>
				{icon && <div className='text-purple-500'>{icon}</div>}
			</div>

			<div className='mt-2'>
				<h2 className='text-3xl font-bold text-white'>{value}</h2>
			</div>
		</div>
	)
}
