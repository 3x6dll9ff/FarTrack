import { AppLayout } from '@/components/layout/app-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { clientLog } from '@/lib/clientLogger'
import { getWarpcastUserProfile } from '@/lib/warpcast'
import { Achievement } from '@shared/schema'
import { useQuery } from '@tanstack/react-query'
import {
	Award,
	CalendarDays,
	Check,
	ExternalLink,
	Heart,
	Link2,
	Lock,
	MessageSquare,
	Repeat,
} from 'lucide-react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

interface ProfileProps {
	user?: FrameContext['user']
}

export default function Profile({ user }: ProfileProps) {
	const { id } = useParams()
	const userId = id === 'me' ? user?.fid : id ? parseInt(id) : undefined
	const { toast } = useToast()

	clientLog('Profile component mounted', { userId, user })

	// Fetch Warpcast user data
	const {
		data: warpcastUser,
		isLoading: warpcastLoading,
		isError: warpcastError,
	} = useQuery({
		queryKey: ['warpcast-user', userId],
		queryFn: async () => {
			if (!userId) {
				throw new Error('User ID missing')
			}
			return await getWarpcastUserProfile(userId)
		},
		enabled: !!userId,
	})

	// Fetch user data from our API
	const {
		data: profileUser,
		isLoading: userLoading,
		isError: userError,
		error: userErrorDetails,
	} = useQuery({
		queryKey: ['/api/users', userId],
		queryFn: async () => {
			if (!userId) {
				clientLog('User ID is missing for profile fetch')
				throw new Error('User ID missing')
			}
			try {
				const response = await fetch(`/api/users/${userId}`)
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const data = await response.json()
				clientLog('User data fetched successfully', { data })
				return data
			} catch (error) {
				clientLog('Error fetching user data', { error })
				throw error
			}
		},
		enabled: !!userId,
		retry: 1,
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
	const {
		data: achievements,
		isLoading: achievementsLoading,
		isError: achievementsError,
		error: achievementsErrorDetails,
	} = useQuery({
		queryKey: [`/api/users/${userId}/achievements`],
		queryFn: async () => {
			try {
				const response = await fetch(`/api/users/${userId}/achievements`)
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const data = await response.json()
				clientLog('Achievements fetched successfully', { data })
				return data
			} catch (error) {
				clientLog('Error fetching achievements', { error })
				throw error
			}
		},
		enabled: !!userId,
		retry: 1,
	})

	// Fetch stats
	const {
		data: stats,
		isLoading: statsLoading,
		isError: statsError,
		error: statsErrorDetails,
	} = useQuery({
		queryKey: [`/api/users/${userId}/stats`],
		queryFn: async () => {
			try {
				const response = await fetch(`/api/users/${userId}/stats`)
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const data = await response.json()
				clientLog('Stats fetched successfully', { data })
				return data
			} catch (error) {
				clientLog('Error fetching stats', { error })
				throw error
			}
		},
		enabled: !!userId,
		retry: 1,
	})

	// Determine if we should show the skeleton
	const isLoading = userLoading || achievementsLoading || statsLoading
	const hasError = userError || achievementsError || statsError
	const hasData = profileUser && achievements && stats

	// Log the state before rendering
	clientLog('Profile rendering state:', {
		userId,
		isLoading,
		hasError,
		hasData,
		userLoading,
		achievementsLoading,
		statsLoading,
		hasProfileUser: !!profileUser,
		hasAchievements: !!achievements,
		hasStats: !!stats,
		userError,
		achievementsError,
		statsError,
		userErrorDetails,
		achievementsErrorDetails,
		statsErrorDetails,
	})

	// Show error toast if any query fails
	useEffect(() => {
		if (hasError) {
			toast({
				title: 'Error loading profile',
				description: 'Please try refreshing the page',
				variant: 'destructive',
			})
		}
	}, [hasError, toast])

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

	// Render skeleton or content
	const renderContent = () => {
		// Show skeleton if loading or no data/error after loading
		if (isLoading || (!hasData && !isLoading && !hasError)) {
			clientLog('Rendering Profile Skeleton', { isLoading, hasData, hasError })
			return (
				<div className='p-4 space-y-6'>
					{/* Profile Header Skeleton */}
					<div className='flex items-center space-x-4'>
						<Skeleton className='w-24 h-24 rounded-full bg-gray-700' />
						<div className='flex-1 space-y-3'>
							<Skeleton className='h-6 w-48 bg-gray-700' />
							<Skeleton className='h-5 w-32 bg-gray-700' />
							<Skeleton className='h-4 w-60 bg-gray-700' />
						</div>
					</div>

					{/* Stats Skeleton */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						{[...Array(4)].map((_, i) => (
							<Card key={i} className='border border-[#333333] bg-[#252525]'>
								<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
									<Skeleton className='h-5 w-24 bg-gray-700' />
									<Skeleton className='h-5 w-5 bg-gray-700' />
								</CardHeader>
								<CardContent>
									<Skeleton className='h-8 w-1/2 bg-gray-700' />
								</CardContent>
							</Card>
						))}
					</div>

					{/* Tabs Skeleton */}
					<div className='space-y-4'>
						<Skeleton className='h-10 w-full bg-gray-700' />
						<Skeleton className='h-40 w-full bg-gray-700' />
					</div>
				</div>
			)
		} else if (hasError) {
			clientLog('Rendering Profile Error State', { hasError })
			return (
				<div className='flex flex-col items-center justify-center h-full text-red-400'>
					<p>Error loading profile data.</p>
					<Button onClick={() => window.location.reload()} className='mt-4'>
						Retry
					</Button>
				</div>
			)
		} else if (!profileUser) {
			clientLog('Rendering No Profile User State')
			return (
				<div className='flex flex-col items-center justify-center h-full text-gray-400'>
					<p>No profile found.</p>
				</div>
			)
		} else {
			clientLog('Rendering Profile Content', { profileUser })
			return (
				<div className='p-4 space-y-6'>
					{/* Profile Header */}
					<div className='flex items-center space-x-4'>
						<img
							src={
								warpcastUser?.pfp?.url ||
								profileUser.pfp_url ||
								'/default-avatar.png'
							}
							alt={
								warpcastUser?.displayName ||
								profileUser.display_name ||
								'User Avatar'
							}
							className='w-24 h-24 rounded-full object-cover'
						/>
						<div className='flex-1 space-y-2'>
							<h1 className='text-2xl font-bold'>
								{warpcastUser?.displayName || profileUser.display_name || 'N/A'}{' '}
								({warpcastUser?.username || profileUser.username || 'N/A'})
							</h1>
							<p className='text-gray-400 text-sm'>
								FID: {warpcastUser?.fid || profileUser.fid}
							</p>
							{(warpcastUser?.bio || profileUser.bio) && (
								<p className='text-gray-300 text-sm'>
									{warpcastUser?.bio || profileUser.bio}
								</p>
							)}
						</div>
					</div>

					{/* Follow Stats */}
					<div className='flex space-x-4 text-sm text-gray-400'>
						<span>
							<strong>
								{warpcastUser?.followerCount || profileUser.follower_count || 0}
							</strong>{' '}
							Followers
						</span>
						<span>
							<strong>
								{warpcastUser?.followingCount ||
									profileUser.following_count ||
									0}
							</strong>{' '}
							Following
						</span>
					</div>

					{/* Connection/Join Date */}
					<div className='flex items-center text-sm text-gray-400 space-x-4'>
						{profileUser.active_on_farcaster && (
							<div className='flex items-center'>
								<Check className='h-4 w-4 mr-1 text-green-500' /> Active on
								Farcaster
							</div>
						)}
						{profileUser.registered_at && (
							<div className='flex items-center'>
								<CalendarDays className='h-4 w-4 mr-1' /> Joined
								{formatDate(profileUser.registered_at)}
							</div>
						)}
					</div>

					{/* Verifications */}
					{profileUser.verifications &&
						profileUser.verifications.length > 0 && (
							<div>
								<h2 className='text-lg font-semibold mb-2'>Verifications</h2>
								<div className='flex flex-wrap gap-2'>
									{profileUser.verifications.map((v, i) => (
										<Badge
											key={i}
											variant='secondary'
											className='flex items-center'
										>
											<Check className='h-3 w-3 mr-1' />
											{v.replace('eid:eth:', 'eth:').slice(0, 6)}...
											{v.slice(-4)}
										</Badge>
									))}
								</div>
							</div>
						)}

					{/* Connected Addresses */}
					{profileUser.connected_addresses &&
						Object.entries(profileUser.connected_addresses).map(
							([network, addresses]: [string, any]) => (
								<div key={network}>
									<h2 className='text-lg font-semibold mb-2 capitalize'>
										{network} Addresses
									</h2>
									<div className='flex flex-wrap gap-2'>
										{Array.isArray(addresses) &&
											addresses.map((addr, i) => (
												<Badge
													key={i}
													variant='secondary'
													className='flex items-center'
												>
													<Lock className='h-3 w-3 mr-1' />
													{`${addr.wallet_address.slice(
														0,
														6
													)}...${addr.wallet_address.slice(-4)}`}
													{addr.public_key && ( // Optionally show public key if available
														<span className='ml-2 text-gray-500'>
															Public Key:
															{`${addr.public_key.slice(
																0,
																6
															)}...${addr.public_key.slice(-4)}`}
														</span>
													)}
												</Badge>
											))}
									</div>
								</div>
							)
						)}

					{/* Farcaster URL */}
					{profileUser.username && (
						<div>
							<h2 className='text-lg font-semibold mb-2'>Links</h2>
							<div className='flex flex-wrap gap-2'>
								<a
									href={`https://warpcast.com/${profileUser.username}`}
									target='_blank'
									rel='noopener noreferrer'
								>
									<Badge variant='secondary' className='flex items-center'>
										<ExternalLink className='h-3 w-3 mr-1' />
										Warpcast Profile
									</Badge>
								</a>
								{/* Display other social URLs if available */}
								{profileUser.profile_url && (
									<a
										href={profileUser.profile_url}
										target='_blank'
										rel='noopener noreferrer'
									>
										<Badge variant='secondary' className='flex items-center'>
											<Link2 className='h-3 w-3 mr-1' />
											Website
										</Badge>
									</a>
								)}
							</div>
						</div>
					)}

					{/* Total Engagements Card */}
					<Card className='border border-[#333333] bg-[#252525]'>
						<CardHeader>
							<CardTitle className='text-lg font-semibold'>
								Total Engagements
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-2xl font-bold text-purple-400'>
								{totalEngagements.toLocaleString()}
							</p>
						</CardContent>
					</Card>

					{/* Latest Stats Card */}
					{latestStat && (
						<Card className='border border-[#333333] bg-[#252525]'>
							<CardHeader>
								<CardTitle className='text-lg font-semibold'>
									Latest Stats
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2'>
								<p className='flex items-center text-gray-300 text-sm'>
									<CalendarDays className='h-4 w-4 mr-2' />
									Data from: {formatDate(latestStat.date)}(
									{calculateDaysSince(latestStat.date)} days ago)
								</p>
								<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
									<div className='flex items-center text-gray-300 text-sm'>
										<MessageSquare className='h-4 w-4 mr-2' /> Casts:
										<span className='ml-1 font-semibold'>
											{latestStat.casts || 0}
										</span>
									</div>
									<div className='flex items-center text-gray-300 text-sm'>
										<Heart className='h-4 w-4 mr-2' /> Reactions:
										<span className='ml-1 font-semibold'>
											{latestStat.reactions || 0}
										</span>
									</div>
									<div className='flex items-center text-gray-300 text-sm'>
										<Repeat className='h-4 w-4 mr-2' /> Recasts:
										<span className='ml-1 font-semibold'>
											{latestStat.recasts || 0}
										</span>
									</div>
									<div className='flex items-center text-gray-300 text-sm'>
										<MessageSquare className='h-4 w-4 mr-2' /> Replies:
										<span className='ml-1 font-semibold'>
											{latestStat.replies || 0}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Achievements Section */}
					{achievements && achievements.length > 0 && (
						<div>
							<h2 className='text-xl font-bold mb-4'>Achievements</h2>
							<Tabs defaultValue='achieved' className='w-full'>
								<TabsList className='grid w-full grid-cols-2'>
									<TabsTrigger value='achieved'>Achieved</TabsTrigger>
									<TabsTrigger value='all'>All</TabsTrigger>
								</TabsList>
								<TabsContent value='achieved' className='mt-4'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										{
											// Show message if no achievements achieved
											achievements
												.filter((a: Achievement) => a.achieved)
												.map((achievement: Achievement) => (
													<Card
														key={achievement.id}
														className='border border-[#333333] bg-[#252525]'
													>
														<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
															<CardTitle className='text-sm font-medium'>
																{achievement.name}
															</CardTitle>
															<Award className='h-4 w-4 text-purple-400' />
														</CardHeader>
														<CardContent>
															<p className='text-xs text-gray-400'>
																{achievement.description}
															</p>
															<div className='flex items-center text-xs text-gray-400 mt-2'>
																<CalendarDays className='h-3 w-3 mr-1' />
																Achieved on:
																{formatDate(achievement.achieved_at)}
															</div>
														</CardContent>
													</Card>
												)).length === 0 && (
												<div className='col-span-full text-center text-gray-400'>
													No achievements achieved yet.
												</div>
											)
										}
									</div>
								</TabsContent>
								<TabsContent value='all' className='mt-4'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										{achievements.map((achievement: Achievement) => (
											<Card
												key={achievement.id}
												className={`border ${
													achievement.achieved
														? 'border-purple-400'
														: 'border-[#333333]'
												}
															bg-[#252525]
															${!achievement.achieved && 'opacity-50'}`}
											>
												<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
													<CardTitle className='text-sm font-medium'>
														{achievement.name}
													</CardTitle>
													{achievement.achieved ? (
														<Award className='h-4 w-4 text-purple-400' />
													) : (
														<Lock className='h-4 w-4 text-gray-600' />
													)}
												</CardHeader>
												<CardContent>
													<p className='text-xs text-gray-400'>
														{achievement.description}
													</p>
													{achievement.target_value > 0 && (
														<div className='mt-2 space-y-1'>
															<div className='flex justify-between text-xs text-gray-400'>
																<span>Progress:</span>
																<span>
																	{(
																		achievement.current_value || 0
																	).toLocaleString()}{' '}
																	/
																	{(
																		achievement.target_value || 0
																	).toLocaleString()}
																</span>
															</div>
															<Progress
																value={Math.min(
																	((achievement.current_value || 0) /
																		(achievement.target_value || 1)) *
																		100,
																	100
																)}
																className='w-full h-1.5 bg-gray-700 [&>*]:bg-purple-500'
															/>
														</div>
													)}
												</CardContent>
											</Card>
										))}
									</div>
								</TabsContent>
							</Tabs>
						</div>
					)}

					{/* Placeholder for when no achievements or stats are available but not loading/error */}
					{!isLoading &&
						!hasError &&
						(!achievements || achievements.length === 0) &&
						!stats && (
							<div className='col-span-full text-center text-gray-400'>
								No data available for this profile.
							</div>
						)}
				</div>
			)
		}
	}

	return (
		<AppLayout title='Profile' user={user}>
			{renderContent()}
		</AppLayout>
	)
}
