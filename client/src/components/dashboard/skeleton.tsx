import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
	return (
		<div className='p-4 space-y-5'>
			{/* Profile Skeleton */}
			<div className='flex items-center'>
				<Skeleton className='h-12 w-12 rounded-full' />
				<div className='ml-3 space-y-2'>
					<Skeleton className='h-5 w-32' />
					<Skeleton className='h-4 w-48' />
				</div>
			</div>

			{/* Stats Cards Skeleton */}
			<div className='grid grid-cols-3 gap-3'>
				{[...Array(3)].map((_, i) => (
					<Card key={i} className='border border-[#333333] bg-[#252525]'>
						<CardContent className='p-4'>
							<Skeleton className='h-4 w-16 mb-2' />
							<Skeleton className='h-8 w-12' />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Banner Skeleton */}
			<Skeleton className='h-32 rounded-xl' />

			{/* Activity Chart Skeleton */}
			<Card className='border border-[#333333] bg-[#252525]'>
				<CardHeader className='pb-2'>
					<Skeleton className='h-5 w-32' />
				</CardHeader>
				<CardContent className='pt-2 px-2'>
					<Skeleton className='h-48' />
				</CardContent>
			</Card>

			{/* Achievements Skeleton */}
			<div>
				<div className='flex justify-between items-center mb-3'>
					<Skeleton className='h-5 w-32' />
					<Skeleton className='h-5 w-16' />
				</div>
				<div className='space-y-3'>
					{[...Array(2)].map((_, i) => (
						<Card key={i} className='border border-[#333333] bg-[#252525]'>
							<CardContent className='p-4 flex items-center'>
								<Skeleton className='h-10 w-10 rounded-full mr-3' />
								<div className='space-y-2 flex-1'>
									<Skeleton className='h-4 w-3/4' />
									<Skeleton className='h-3 w-1/2' />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Leaderboard Skeleton */}
			<Card className='border border-[#333333] bg-[#252525]'>
				<CardHeader>
					<Skeleton className='h-5 w-32' />
				</CardHeader>
				<CardContent className='space-y-3'>
					{[...Array(5)].map((_, i) => (
						<div key={i} className='flex items-center justify-between'>
							<div className='flex items-center space-x-3'>
								<Skeleton className='h-8 w-8 rounded-full' />
								<Skeleton className='h-4 w-24' />
							</div>
							<Skeleton className='h-4 w-16' />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	)
}
