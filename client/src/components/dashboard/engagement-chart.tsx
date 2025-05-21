import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

interface ChartData {
	name: string
	casts: number
	replies: number
	reactions: number
	recasts: number
}

export function EngagementChart() {
	const [timeframe, setTimeframe] = useState<
		'monthly' | 'quarterly' | 'yearly'
	>('monthly')

	const { data, isLoading, error } = useQuery({
		queryKey: ['/api/users/1/stats', timeframe],
		queryFn: () =>
			fetch(`/api/users/1/stats?period=monthly`).then(res => res.json()),
	})

	const chartData: ChartData[] = data
		? data.map((item: any) => ({
				name: new Date(item.startDate).toLocaleDateString('en-US', {
					month: 'short',
				}),
				casts: item.casts,
				replies: item.replies,
				reactions: item.reactions,
				recasts: item.recasts,
		  }))
		: []

	return (
		<Card className='col-span-1 lg:col-span-2'>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-lg font-semibold'>
					Engagement Activity
				</CardTitle>
				<div className='flex space-x-2'>
					<Button
						variant={timeframe === 'monthly' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setTimeframe('monthly')}
						className='text-xs h-8'
					>
						Monthly
					</Button>
					<Button
						variant={timeframe === 'quarterly' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setTimeframe('quarterly')}
						className='text-xs h-8'
					>
						Quarterly
					</Button>
					<Button
						variant={timeframe === 'yearly' ? 'default' : 'outline'}
						size='sm'
						onClick={() => setTimeframe('yearly')}
						className='text-xs h-8'
					>
						Yearly
					</Button>
				</div>
			</CardHeader>
			<CardContent className='pt-2'>
				{isLoading ? (
					<div className='h-[350px] flex flex-col justify-center items-center'>
						<Skeleton className='h-[300px] w-full' />
					</div>
				) : error ? (
					<div className='h-[350px] flex flex-col justify-center items-center text-center'>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Failed to load engagement data. Please try again later.
						</p>
					</div>
				) : (
					<div className='h-[350px]'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart
								data={chartData}
								margin={{
									top: 10,
									right: 10,
									left: 0,
									bottom: 10,
								}}
							>
								<CartesianGrid strokeDasharray='3 3' vertical={false} />
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar
									dataKey='casts'
									name='Casts'
									fill='#6366f1'
									radius={[4, 4, 0, 0]}
								/>
								<Bar
									dataKey='replies'
									name='Replies'
									fill='#22c55e'
									radius={[4, 4, 0, 0]}
								/>
								<Bar
									dataKey='reactions'
									name='Reactions'
									fill='#f59e0b'
									radius={[4, 4, 0, 0]}
								/>
								<Bar
									dataKey='recasts'
									name='Recasts'
									fill='#0ea5e9'
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
