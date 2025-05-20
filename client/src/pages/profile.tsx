import { AppLayout } from '@/components/layout/app-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { warpcastClient } from '@/lib/warpcast'
import { Achievement } from '@shared/schema'
import { useQuery } from '@tanstack/react-query'
import {
	Award,
	BarChart2,
	CalendarDays,
	Check,
	ExternalLink,
	Flame,
	Heart,
	Link2,
	Lock,
	MessageSquare,
	Repeat,
	Sparkles,
	Star,
	Trophy,
	Zap,
} from 'lucide-react'
import { useParams } from 'wouter'

export default function Profile() {
	const { id } = useParams()
	const userId = id ? parseInt(id) : 1
	const { toast } = useToast()

	// Fetch user data
	const { data: user, isLoading: userLoading } = useQuery({
		queryKey: [`/api/users/${userId}`],
		queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
	})

	// Функция для синхронизации с Warpcast
	const syncWithWarpcast = async (username: string) => {
		if (!username) {
			toast({
				title: 'Ошибка',
				description: 'Имя пользователя не указано',
				variant: 'destructive',
			})
			return
		}

		toast({
			title: 'Синхронизация...',
			description: 'Получение данных из Warpcast',
		})

		try {
			const result = await warpcastClient.syncUserData(username, userId)

			if (result) {
				toast({
					title: 'Успех!',
					description: 'Профиль синхронизирован с Warpcast',
					variant: 'default',
				})
			} else {
				toast({
					title: 'Ошибка',
					description: 'Не удалось синхронизировать профиль',
					variant: 'destructive',
				})
			}
		} catch (error) {
			toast({
				title: 'Ошибка',
				description: 'Произошла ошибка при синхронизации',
				variant: 'destructive',
			})
		}
	}

	// Fetch achievements
	const { data: achievements, isLoading: achievementsLoading } = useQuery({
		queryKey: [`/api/users/${userId}/achievements`],
		queryFn: () =>
			fetch(`/api/users/${userId}/achievements`).then(res => res.json()),
	})

	// Fetch stats
	const { data: stats, isLoading: statsLoading } = useQuery({
		queryKey: [`/api/users/${userId}/stats`],
		queryFn: () => fetch(`/api/users/${userId}/stats`).then(res => res.json()),
	})

	const formatDate = (dateString: string) => {
		if (!dateString) return ''
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	}

	const calculateDaysSince = (dateString: string) => {
		if (!dateString) return 0
		const date = new Date(dateString)
		const now = new Date()
		const diffTime = Math.abs(now.getTime() - date.getTime())
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	}

	// Get latest stats
	const latestStat = stats && stats.length > 0 ? stats[0] : null

	// Calculate total engagements
	const totalEngagements =
		stats?.reduce((sum, stat: any) => {
			return (
				sum +
				(stat.casts || 0) +
				(stat.reactions || 0) +
				(stat.replies || 0) +
				(stat.recasts || 0)
			)
		}, 0) || 0

	const AchievementBadge = ({
		icon: Icon,
		count,
		label,
	}: {
		icon: any
		count: number
		label: string
	}) => (
		<div className='flex flex-col items-center'>
			<div className='relative'>
				<div className='w-11 h-11 rounded-full bg-[#333333] text-purple-400 flex items-center justify-center'>
					<Icon className='h-6 w-6' />
				</div>
				<div className='absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center'>
					{count}
				</div>
			</div>
			<span className='text-xs mt-1 text-gray-400'>{label}</span>
		</div>
	)

	return (
		<AppLayout title='Profile'>
			<div className='p-4 space-y-6'>
				{/* Profile Header */}
				<div className='bg-[#252525] rounded-2xl overflow-hidden border border-[#333333]'>
					<div className='p-4'>
						<div className='flex items-center gap-3'>
							<div className='relative'>
								{userLoading ? (
									<Skeleton className='h-14 w-14 rounded-xl' />
								) : (
									<img
										src={user?.profileImage || 'https://github.com/shadcn.png'}
										alt={user?.displayName || user?.username}
										className='h-14 w-14 rounded-xl object-cover'
									/>
								)}
							</div>

							<div className='flex-1 min-w-0'>
								<div className='flex items-center justify-between gap-2'>
									<div className='min-w-0'>
										<h1 className='text-base font-medium text-white truncate'>
											{userLoading ? (
												<Skeleton className='h-5 w-32' />
											) : (
												user?.displayName
											)}
										</h1>
										<p className='text-xs text-gray-400 truncate'>
											{userLoading ? (
												<Skeleton className='h-3 w-24 mt-1' />
											) : (
												`@${user?.username}`
											)}
										</p>
									</div>
									<a
										href={`https://warpcast.com/${user?.username}`}
										target='_blank'
										rel='noopener noreferrer'
										className='text-gray-400 hover:text-white transition-colors shrink-0'
									>
										<ExternalLink className='h-4 w-4' />
									</a>
								</div>

								<div className='flex items-center gap-3 mt-2'>
									<div className='flex items-center gap-1.5 text-xs text-gray-400'>
										<CalendarDays className='h-3.5 w-3.5' />
										<span>
											{userLoading ? (
												<Skeleton className='h-3 w-20 inline-block' />
											) : (
												formatDate(user?.registrationDate)
											)}
										</span>
									</div>

									{!userLoading && (
										<div className='flex items-center gap-1.5 text-xs text-purple-400'>
											<Award className='h-3.5 w-3.5' />
											<span>{user?.totalPoints || 0} points</span>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Stats Overview */}
				<div className='flex flex-wrap gap-2'>
					<div className='flex-1 min-w-[140px] bg-[#252525] rounded-2xl p-3 border border-[#333333]'>
						<div className='flex items-center gap-2.5'>
							<div className='w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center shrink-0'>
								<Sparkles className='h-4 w-4' />
							</div>
							<div className='min-w-0'>
								<div className='text-base font-medium text-white truncate'>
									{user?.totalPoints ? Math.floor(user.totalPoints / 100) : 0}
								</div>
								<div className='text-xs text-gray-400 truncate'>Level</div>
							</div>
						</div>
					</div>

					<div className='flex-1 min-w-[140px] bg-[#252525] rounded-2xl p-3 border border-[#333333]'>
						<div className='flex items-center gap-2.5'>
							<div className='w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center shrink-0'>
								<Trophy className='h-4 w-4' />
							</div>
							<div className='min-w-0'>
								<div className='text-base font-medium text-white truncate'>
									{achievements?.length || 0}
								</div>
								<div className='text-xs text-gray-400 truncate'>Badges</div>
							</div>
						</div>
					</div>

					<div className='flex-1 min-w-[140px] bg-[#252525] rounded-2xl p-3 border border-[#333333]'>
						<div className='flex items-center gap-2.5'>
							<div className='w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center shrink-0'>
								<Flame className='h-4 w-4' />
							</div>
							<div className='min-w-0'>
								<div className='text-base font-medium text-white truncate'>
									{user?.followerCount || 0}
								</div>
								<div className='text-xs text-gray-400 truncate'>Followers</div>
							</div>
						</div>
					</div>

					<div className='flex-1 min-w-[140px] bg-[#252525] rounded-2xl p-3 border border-[#333333]'>
						<div className='flex items-center gap-2.5'>
							<div className='w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center shrink-0'>
								<Star className='h-4 w-4' />
							</div>
							<div className='min-w-0'>
								<div className='text-base font-medium text-white truncate'>
									{totalEngagements > 999
										? Math.floor(totalEngagements / 1000) + 'k'
										: totalEngagements}
								</div>
								<div className='text-xs text-gray-400 truncate'>
									Interactions
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Points Progress */}
				<Card className='border border-[#333333] bg-[#252525]'>
					<CardHeader className='pb-2'>
						<CardTitle className='text-base font-medium flex items-center text-white'>
							<Sparkles className='h-4 w-4 mr-1.5 text-purple-400' />
							Points Level Progress
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							<div className='flex justify-between text-sm'>
								<span className='font-medium text-white'>
									Level{' '}
									{user?.totalPoints ? Math.floor(user.totalPoints / 100) : 0}
								</span>
								<span className='text-gray-400'>
									{user?.totalPoints ? user.totalPoints % 100 : 0}/100 to Level{' '}
									{user?.totalPoints
										? Math.floor(user.totalPoints / 100) + 1
										: 1}
								</span>
							</div>
							<Progress
								value={user?.totalPoints ? user.totalPoints % 100 : 0}
								className='h-2 bg-[#333333]'
							/>
							<p className='text-xs text-gray-400 mt-1'>
								Earn more points by completing daily challenges and social
								tasks!
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Tabs Section */}
				<Tabs defaultValue='stats' className='mt-2'>
					<TabsList className='grid w-full grid-cols-3 bg-[#252525] text-gray-400'>
						<TabsTrigger
							value='stats'
							className='data-[state=active]:bg-[#333333] data-[state=active]:text-white'
						>
							Stats
						</TabsTrigger>
						<TabsTrigger
							value='achievements'
							className='data-[state=active]:bg-[#333333] data-[state=active]:text-white'
						>
							Badges
						</TabsTrigger>
						<TabsTrigger
							value='activity'
							className='data-[state=active]:bg-[#333333] data-[state=active]:text-white'
						>
							Activity
						</TabsTrigger>
					</TabsList>

					{/* Stats Tab */}
					<TabsContent value='stats' className='space-y-4 mt-4'>
						{statsLoading ? (
							<div className='space-y-4'>
								{Array(4)
									.fill(0)
									.map((_, i) => (
										<Skeleton key={i} className='h-12 w-full' />
									))}
							</div>
						) : stats && stats.length > 0 ? (
							<div className='space-y-3'>
								<Card className='overflow-hidden border border-[#333333] bg-[#252525]'>
									<div className='p-3 flex items-center'>
										<div className='w-10 h-10 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center mr-3'>
											<MessageSquare className='h-5 w-5' />
										</div>
										<div className='flex-1'>
											<div className='flex justify-between'>
												<h3 className='font-semibold text-sm text-white'>
													Casts
												</h3>
												<div className='text-sm font-medium text-white'>
													{stats.reduce(
														(sum, stat: any) => sum + (stat.casts || 0),
														0
													)}
													<span className='text-xs text-gray-400 ml-1'>
														total
													</span>
												</div>
											</div>
											<Progress
												value={75}
												className='h-1.5 mt-1 bg-[#333333]'
											/>
											<div className='mt-1 flex justify-between text-xs text-gray-400'>
												<span>+{latestStat?.casts || 0} today</span>
												<span>75% of goal</span>
											</div>
										</div>
									</div>
								</Card>

								<Card className='overflow-hidden border border-[#333333] bg-[#252525]'>
									<div className='p-3 flex items-center'>
										<div className='w-10 h-10 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center mr-3'>
											<Heart className='h-5 w-5' />
										</div>
										<div className='flex-1'>
											<div className='flex justify-between'>
												<h3 className='font-semibold text-sm text-white'>
													Reactions
												</h3>
												<div className='text-sm font-medium text-white'>
													{stats.reduce(
														(sum, stat: any) => sum + (stat.reactions || 0),
														0
													)}
													<span className='text-xs text-gray-400 ml-1'>
														total
													</span>
												</div>
											</div>
											<Progress
												value={92}
												className='h-1.5 mt-1 bg-[#333333]'
											/>
											<div className='mt-1 flex justify-between text-xs text-gray-400'>
												<span>+{latestStat?.reactions || 0} today</span>
												<span>92% of goal</span>
											</div>
										</div>
									</div>
								</Card>

								<Card className='overflow-hidden border border-[#333333] bg-[#252525]'>
									<div className='p-3 flex items-center'>
										<div className='w-10 h-10 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center mr-3'>
											<Repeat className='h-5 w-5' />
										</div>
										<div className='flex-1'>
											<div className='flex justify-between'>
												<h3 className='font-semibold text-sm text-white'>
													Recasts
												</h3>
												<div className='text-sm font-medium text-white'>
													{stats.reduce(
														(sum, stat: any) => sum + (stat.recasts || 0),
														0
													)}
													<span className='text-xs text-gray-400 ml-1'>
														total
													</span>
												</div>
											</div>
											<Progress
												value={45}
												className='h-1.5 mt-1 bg-[#333333]'
											/>
											<div className='mt-1 flex justify-between text-xs text-gray-400'>
												<span>+{latestStat?.recasts || 0} today</span>
												<span>45% of goal</span>
											</div>
										</div>
									</div>
								</Card>

								<Card className='overflow-hidden border border-[#333333] bg-[#252525]'>
									<div className='p-3 flex items-center'>
										<div className='w-10 h-10 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center mr-3'>
											<MessageSquare className='h-5 w-5' />
										</div>
										<div className='flex-1'>
											<div className='flex justify-between'>
												<h3 className='font-semibold text-sm text-white'>
													Replies
												</h3>
												<div className='text-sm font-medium text-white'>
													{stats.reduce(
														(sum, stat: any) => sum + (stat.replies || 0),
														0
													)}
													<span className='text-xs text-gray-400 ml-1'>
														total
													</span>
												</div>
											</div>
											<Progress
												value={62}
												className='h-1.5 mt-1 bg-[#333333]'
											/>
											<div className='mt-1 flex justify-between text-xs text-gray-400'>
												<span>+{latestStat?.replies || 0} today</span>
												<span>62% of goal</span>
											</div>
										</div>
									</div>
								</Card>
							</div>
						) : (
							<Card className='p-6 text-center border border-[#333333] bg-[#252525]'>
								<BarChart2 className='h-12 w-12 text-gray-400 mx-auto mb-3' />
								<h3 className='text-lg font-medium mb-2 text-white'>
									No Stats Available
								</h3>
								<p className='text-sm text-gray-400 mb-4'>
									Stats will appear as you engage with Farcaster.
								</p>
							</Card>
						)}
					</TabsContent>

					{/* Achievements Tab */}
					<TabsContent value='achievements' className='space-y-4 mt-4'>
						<div className='flex justify-between items-center'>
							<h3 className='text-base font-medium flex items-center text-white'>
								<Trophy className='h-4 w-4 mr-1.5 text-purple-400' />
								Your Badges
								<Badge className='ml-2 text-xs px-2 bg-purple-900 text-purple-300'>
									{achievements?.length || 0}/15
								</Badge>
							</h3>
						</div>

						{achievementsLoading ? (
							<div className='space-y-3'>
								{Array(3)
									.fill(0)
									.map((_, i) => (
										<Skeleton key={i} className='h-16 w-full' />
									))}
							</div>
						) : achievements?.length > 0 ? (
							<div className='grid grid-cols-2 gap-3'>
								{achievements.map((achievement: Achievement) => (
									<Card
										key={achievement.id}
										className='overflow-hidden border border-[#333333] bg-[#252525]'
									>
										<div className='p-3 flex flex-col items-center text-center'>
											<div className='w-12 h-12 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center mb-2'>
												<Award className='h-6 w-6' />
											</div>
											<h3 className='font-semibold text-white text-sm'>
												{achievement.name}
											</h3>
											<p className='text-xs text-gray-400 mt-1'>
												{achievement.description}
											</p>
											<div className='flex items-center mt-2 text-xs text-purple-300 font-medium'>
												<Check className='h-3 w-3 mr-1' />
												<span>
													Unlocked {formatDate(achievement.unlockedAt)}
												</span>
											</div>
										</div>
									</Card>
								))}

								{/* Display placeholder badges */}
								{[...Array(4 - (achievements.length % 4 || 4))].map((_, i) => (
									<Card
										key={`placeholder-${i}`}
										className='overflow-hidden border border-[#333333] bg-[#252525] opacity-50'
									>
										<div className='p-3 flex flex-col items-center text-center'>
											<div className='w-12 h-12 rounded-full bg-[#333333] text-gray-400 flex items-center justify-center mb-2'>
												<Lock className='h-6 w-6' />
											</div>
											<h3 className='font-semibold text-white text-sm'>
												Locked Badge
											</h3>
											<p className='text-xs text-gray-400 mt-1'>
												Keep engaging to unlock more badges
											</p>
										</div>
									</Card>
								))}
							</div>
						) : (
							<Card className='p-6 text-center border border-[#333333] bg-[#252525]'>
								<Trophy className='h-12 w-12 text-gray-400 mx-auto mb-3' />
								<h3 className='text-lg font-medium mb-2 text-white'>
									No Badges Yet
								</h3>
								<p className='text-sm text-gray-400 mb-4'>
									Earn badges by completing challenges and engaging with
									Farcaster.
								</p>
								<Button size='sm' className='bg-purple-600 hover:bg-purple-700'>
									View Challenges
								</Button>
							</Card>
						)}
					</TabsContent>

					{/* Activity Tab */}
					<TabsContent value='activity' className='space-y-4 mt-4'>
						<div className='flex justify-between items-center'>
							<h3 className='text-base font-medium flex items-center text-white'>
								<Zap className='h-4 w-4 mr-1.5 text-purple-400' />
								Recent Activity
							</h3>
						</div>

						<div className='space-y-3'>
							<Card className='overflow-hidden border border-[#333333] bg-[#252525]'>
								<div className='p-3 flex items-start'>
									<div className='w-8 h-8 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center mr-3 mt-0.5'>
										<MessageSquare className='h-4 w-4' />
									</div>
									<div className='flex-1'>
										<p className='text-sm text-white'>
											<span className='font-medium'>You created a cast</span>
											<span className='text-gray-400'>
												{' '}
												about NFT collections
											</span>
										</p>
										<p className='text-xs text-gray-400 mt-1'>2 hours ago</p>
									</div>
									<Badge className='bg-purple-900 text-purple-300'>
										+10 pts
									</Badge>
								</div>
							</Card>

							<Card className='overflow-hidden border border-[#333333] bg-[#252525]'>
								<div className='p-3 flex items-start'>
									<div className='w-8 h-8 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center mr-3 mt-0.5'>
										<Trophy className='h-4 w-4' />
									</div>
									<div className='flex-1'>
										<p className='text-sm text-white'>
											<span className='font-medium'>You earned a badge</span>
											<span className='text-gray-400'>
												{' '}
												- Consistent Creator
											</span>
										</p>
										<p className='text-xs text-gray-400 mt-1'>Yesterday</p>
									</div>
									<Badge className='bg-purple-900 text-purple-300'>
										+50 pts
									</Badge>
								</div>
							</Card>

							<Card className='overflow-hidden border border-[#333333] bg-[#252525]'>
								<div className='p-3 flex items-start'>
									<div className='w-8 h-8 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center mr-3 mt-0.5'>
										<Link2 className='h-4 w-4' />
									</div>
									<div className='flex-1'>
										<p className='text-sm text-white'>
											<span className='font-medium'>@janesmith</span>
											<span className='text-gray-400'>
												{' '}
												mentioned you in a cast
											</span>
										</p>
										<p className='text-xs text-gray-400 mt-1'>2 days ago</p>
									</div>
									<Badge className='bg-purple-900 text-purple-300'>
										+5 pts
									</Badge>
								</div>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</AppLayout>
	)
}
