import { Leaderboard } from '@/components/dashboard/leaderboard'
import { StatCard } from '@/components/dashboard/stat-card'
import { AppLayout } from '@/components/layout/app-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { type FrameContext } from '@farcaster/frame-sdk'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowUp, Award, Heart, Repeat } from 'lucide-react'
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

interface DashboardProps {
	user?: FrameContext['user']
}

export default function Dashboard({ user }: DashboardProps) {
	console.log('Dashboard rendered. User prop:', user)

	// Получение данных пользователя
	const {
		data: userData,
		isLoading: isLoadingUser,
		error: userError,
	} = useQuery({
		queryKey: ['/api/users/1'],
		queryFn: () => fetch('/api/users/1').then(res => res.json()),
	})

	// Получение статистики
	const {
		data: statsData,
		isLoading: isLoadingStats,
		error: statsError,
	} = useQuery({
		queryKey: ['/api/users/1/stats', 'summary'],
		queryFn: () => fetch('/api/users/1/stats').then(res => res.json()),
	})

	// Получение достижений
	const {
		data: achievements,
		isLoading: isLoadingAchievements,
		error: achievementsError,
	} = useQuery({
		queryKey: ['/api/users/1/achievements'],
		queryFn: () => fetch('/api/users/1/achievements').then(res => res.json()),
	})

	console.log('useQuery data:', { userData, statsData, achievements })
	console.log('useQuery loading status:', {
		isLoadingUser,
		isLoadingStats,
		isLoadingAchievements,
	})
	console.log('useQuery errors:', { userError, statsError, achievementsError })

	// Handle loading state
	if (isLoadingUser || isLoadingStats || isLoadingAchievements) {
		return (
			<AppLayout title='Loading...'>
				<div>Loading Dashboard data...</div>
			</AppLayout>
		)
	}

	// Handle errors
	if (userError || statsError || achievementsError) {
		console.error(
			'Dashboard loading error:',
			userError || statsError || achievementsError
		)
		return (
			<AppLayout title='Error'>
				<div>Error loading dashboard data.</div>
			</AppLayout>
		)
	}

	// Подготовка данных для графика
	const chartData = statsData
		? statsData.slice(0, 7).map((stat: any) => ({
				name: new Date(stat.startDate).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
				}),
				points:
					stat.casts * 10 +
					stat.replies * 5 +
					stat.reactions * 2 +
					stat.recasts * 8,
		  }))
		: []

	// Получение статистики за последние сутки
	const latestStat = statsData && statsData.length > 0 ? statsData[0] : null
	const dailyReactions = latestStat?.reactions || 0
	const dailyRecasts = latestStat?.recasts || 0

	return (
		<AppLayout title='FarTrack'>
			<div className='p-4 space-y-5'>
				{/* Приветствие и профиль */}
				<div className='flex items-center'>
					<Avatar className='h-12 w-12 border-2 border-purple-100'>
						<AvatarImage
							src={user?.pfpUrl || userData?.profileImage}
							alt={
								user?.displayName ||
								user?.username ||
								userData?.displayName ||
								'User'
							}
						/>
						<AvatarFallback>
							{user?.username?.substring(0, 2).toUpperCase() ||
								userData?.username?.substring(0, 2).toUpperCase() ||
								'RU'}
						</AvatarFallback>
					</Avatar>
					<div className='ml-3'>
						<h2 className='text-lg font-bold text-white'>
							Hey,{' '}
							{user?.displayName ||
								user?.username ||
								userData?.displayName ||
								'User'}
							!
						</h2>
						<p className='text-sm text-gray-400'>
							Track your Farcaster engagement
						</p>
					</div>
				</div>

				{/* Счетчики */}
				<div className='grid grid-cols-3 gap-3'>
					<StatCard
						title='Points'
						value={userData?.totalPoints || 0}
						icon={<ArrowUp className='h-4 w-4' />}
					/>

					<StatCard
						title='Reactions'
						value={dailyReactions}
						icon={<Heart className='h-4 w-4' />}
					/>

					<StatCard
						title='Recasts'
						value={dailyRecasts}
						icon={<Repeat className='h-4 w-4' />}
					/>
				</div>

				{/* Баннер */}
				<div className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-4 shadow-sm'>
					<div className='flex items-center mb-2'>
						<div className='p-1.5 bg-white/20 rounded-lg mr-2'>
							<Award className='h-5 w-5' />
						</div>
						<h2 className='text-base font-bold'>Daily Progress</h2>
					</div>
					<div className='bg-white/10 rounded-lg p-2.5 mb-1'>
						<div className='flex justify-between items-center mb-1'>
							<span className='text-xs font-medium'>Points Progress</span>
							<span className='text-xs font-medium'>72/100</span>
						</div>
						<Progress value={72} className='h-1.5 bg-white/20' />
					</div>
					<p className='text-xs text-white/80'>
						Complete activities to earn more points!
					</p>
				</div>

				{/* Активность */}
				<Card className='border border-[#333333] bg-[#252525]'>
					<CardHeader className='pb-2'>
						<CardTitle className='text-base font-bold text-white'>
							Points Activity
						</CardTitle>
					</CardHeader>
					<CardContent className='pt-2 px-2'>
						<div className='h-48'>
							<ResponsiveContainer width='100%' height='100%'>
								<BarChart
									data={chartData}
									margin={{ top: 10, right: 5, left: 5, bottom: 10 }}
								>
									<Bar dataKey='points' fill='#7c3aed' radius={[4, 4, 0, 0]} />
									<XAxis
										dataKey='name'
										tick={{ fontSize: 10, fill: '#9ca3af' }}
										axisLine={false}
										tickLine={false}
										padding={{ left: 5, right: 5 }}
									/>
									<YAxis
										tick={{ fontSize: 10, fill: '#9ca3af' }}
										axisLine={false}
										tickLine={false}
										orientation='right'
										width={30}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: '#252525',
											borderColor: '#333333',
											color: '#9ca3af',
											borderRadius: '8px',
											boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
											padding: '8px 12px',
										}}
										labelStyle={{
											color: '#9ca3af',
											fontSize: '12px',
											marginBottom: '4px',
										}}
										itemStyle={{
											color: '#7c3aed',
											fontSize: '12px',
											padding: '2px 0',
										}}
										cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Достижения */}
				<div>
					<div className='flex justify-between items-center mb-3'>
						<h2 className='text-base font-bold text-white'>
							Your Achievements
						</h2>
						<span className='text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded-full'>
							{achievements?.length || 0} Total
						</span>
					</div>

					{achievements && achievements.length > 0 ? (
						<div className='space-y-3'>
							{achievements.slice(0, 2).map((achievement: any) => (
								<motion.div
									key={achievement.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className='bg-[#252525] p-3 rounded-lg border border-[#333333] flex items-center hover:bg-[#2a2a2a] cursor-pointer'
									onClick={() => (window.location.href = '/achievements')}
								>
									<div className='bg-purple-900 p-2 rounded-full mr-3'>
										<Award className='h-4 w-4 text-purple-300' />
									</div>
									<div>
										<h3 className='font-medium text-white text-sm'>
											{achievement.name}
										</h3>
										<p className='text-xs text-gray-400'>
											{achievement.description}
										</p>
									</div>
								</motion.div>
							))}
						</div>
					) : (
						<Card className='text-center p-6 border border-[#333333] bg-[#252525]'>
							<Award className='h-10 w-10 text-gray-400 mx-auto mb-3' />
							<h3 className='font-medium mb-1 text-white'>
								No achievements yet
							</h3>
							<p className='text-sm text-gray-400'>
								Start engaging to earn rewards
							</p>
						</Card>
					)}
				</div>

				{/* Топ пользователей */}
				<Leaderboard />
			</div>
		</AppLayout>
	)
}
