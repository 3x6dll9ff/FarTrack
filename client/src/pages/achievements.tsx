import { AppLayout } from '@/components/layout/app-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { warpcastClient } from '@/lib/warpcast'
import { Achievement, User } from '@shared/schema'
import { useQuery } from '@tanstack/react-query'
import {
	Award,
	Calendar,
	CheckCircle,
	ExternalLink,
	Flame,
	Gift,
	Globe,
	Heart,
	Lock,
	MessageSquare,
	Repeat,
	Share2,
	Star,
	Trophy,
	Twitter,
	Users,
	X,
	Zap,
} from 'lucide-react'
import { useState } from 'react'

// Achievement components
interface AchievementCardProps {
	achievement: Achievement
	user?: User
}

function AchievementCard({ achievement }: AchievementCardProps) {
	const { toast } = useToast()

	const formatDate = (date: Date | string | null) => {
		if (!date) return ''
		const dateObj = typeof date === 'string' ? new Date(date) : date
		return dateObj.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		})
	}

	const iconMapping: Record<string, React.ReactNode> = {
		rocket: <Flame className='h-6 w-6' />,
		message: <MessageSquare className='h-6 w-6' />,
		users: <Users className='h-6 w-6' />,
		star: <Star className='h-6 w-6' />,
		heart: <Heart className='h-6 w-6' />,
		trophy: <Trophy className='h-6 w-6' />,
	}

	const handleShare = async () => {
		toast({
			title: 'Публикация...',
			description: 'Делимся достижением в Warpcast',
		})

		try {
			const result = await warpcastClient.shareAchievement(
				achievement.name,
				achievement.description ||
					'Я только что получил новое достижение в FarTrack!'
			)

			if (result) {
				toast({
					title: 'Успех!',
					description: 'Достижение опубликовано в Warpcast',
					variant: 'default',
				})
			} else {
				toast({
					title: 'Не удалось опубликовать',
					description: 'Проверьте подключение к Warpcast',
					variant: 'destructive',
				})
			}
		} catch (error) {
			toast({
				title: 'Ошибка',
				description: 'Не удалось поделиться достижением',
				variant: 'destructive',
			})
		}
	}

	return (
		<Card className='overflow-hidden border border-[#333333] bg-[#252525] hover:bg-[#2a2a2a] cursor-pointer transition-colors'>
			<div className='p-3 flex items-center gap-3'>
				<div className='w-10 h-10 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center flex-shrink-0'>
					{iconMapping[achievement.icon] || <Award className='h-5 w-5' />}
				</div>
				<div className='flex-1'>
					<h3 className='font-semibold text-white text-sm'>
						{achievement.name}
					</h3>
					<p className='text-xs text-gray-400'>{achievement.description}</p>
					<div className='flex items-center mt-1 text-xs text-gray-400'>
						<Calendar className='h-3 w-3 mr-1' />
						<span>{formatDate(achievement.unlockedAt)}</span>
					</div>
				</div>
				<Button
					variant='ghost'
					size='sm'
					className='h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#333333]'
					onClick={e => {
						e.stopPropagation()
						handleShare()
					}}
				>
					<Share2 className='h-4 w-4' />
				</Button>
			</div>
		</Card>
	)
}

interface LockedAchievementProps {
	title: string
	description: string
	icon: React.ReactNode
	progress?: number
}

function LockedAchievement({
	title,
	description,
	icon,
	progress = 0,
}: LockedAchievementProps) {
	return (
		<Card className='overflow-hidden opacity-80 hover:opacity-100 transition-opacity border border-[#333333] bg-[#252525] cursor-pointer'>
			<div className='p-3 flex items-center gap-3'>
				<div className='w-10 h-10 rounded-full bg-[#333333] text-gray-400 flex items-center justify-center flex-shrink-0'>
					{icon}
				</div>
				<div className='flex-1'>
					<div className='flex items-center gap-2'>
						<h3 className='font-semibold text-gray-300 text-sm'>{title}</h3>
						<Badge
							variant='outline'
							className='text-[10px] font-normal py-0 h-4 border-[#444444] text-gray-400'
						>
							<Lock className='h-2.5 w-2.5 mr-1' />
							<span>Locked</span>
						</Badge>
					</div>
					<p className='text-xs text-gray-400'>{description}</p>

					{progress > 0 && (
						<div className='mt-2'>
							<div className='flex items-center justify-between text-xs mb-1'>
								<span className='text-gray-400 text-[10px]'>Progress</span>
								<span className='text-gray-300 font-medium text-[10px]'>
									{progress}%
								</span>
							</div>
							<Progress value={progress} className='h-1.5 bg-[#333333]' />
						</div>
					)}
				</div>
			</div>
		</Card>
	)
}

interface SocialTaskProps {
	icon: React.ReactNode
	title: string
	description: string
	points: number
	completed?: boolean
}

function SocialTask({
	icon,
	title,
	description,
	points,
	completed = false,
}: SocialTaskProps) {
	const handleTaskClick = () => {
		if (!completed) {
			// Здесь был бы переход на сайт Warpcast для выполнения задания
			alert('Переход на сайт Warpcast для выполнения задания')
		}
	}

	return (
		<Card
			className={`overflow-hidden border border-[#333333] bg-[#252525] ${
				!completed && 'hover:bg-[#2a2a2a] cursor-pointer'
			}`}
			onClick={!completed ? handleTaskClick : undefined}
		>
			<div className='p-3 flex items-center'>
				<div
					className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
						completed
							? 'bg-green-900 text-green-300'
							: 'bg-purple-900 text-purple-300'
					}`}
				>
					{icon}
				</div>
				<div className='flex-1'>
					<h3 className='font-semibold text-sm flex items-center text-white'>
						{title}
						{completed && (
							<CheckCircle className='h-3.5 w-3.5 text-green-400 ml-1.5' />
						)}
					</h3>
					<p className='text-xs text-gray-400'>{description}</p>
				</div>
				<div className='ml-2 flex flex-col items-end'>
					<Badge
						className={`${
							completed
								? 'bg-[#333333] text-gray-400'
								: 'bg-purple-900 text-purple-300'
						}`}
					>
						+{points} pts
					</Badge>
					{!completed && (
						<Button
							size='sm'
							variant='ghost'
							className='text-xs mt-1 h-6 p-0 text-purple-400 hover:text-purple-300'
							onClick={e => {
								e.stopPropagation()
								handleTaskClick()
							}}
						>
							<ExternalLink className='h-3 w-3 mr-1' />
							<span>Open</span>
						</Button>
					)}
				</div>
			</div>
		</Card>
	)
}

export default function Achievements() {
	const [userId, setUserId] = useState(1) // Default to first user
	const [activeTab, setActiveTab] = useState('daily')

	// Fetch user data
	const { data: userData, isLoading: userLoading } = useQuery({
		queryKey: [`/api/users/${userId}`],
		queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
	})

	// Fetch achievements data
	const { data: achievements, isLoading: achievementsLoading } = useQuery({
		queryKey: [`/api/users/${userId}/achievements`],
		queryFn: () =>
			fetch(`/api/users/${userId}/achievements`).then(res => res.json()),
	})

	return (
		<AppLayout title='Earn Points'>
			<div className='p-4 space-y-5'>
				{/* Баннер */}
				<div className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-5 shadow-sm'>
					<div className='flex items-center mb-3'>
						<div className='p-2 bg-white/20 rounded-lg mr-3'>
							<Gift className='h-6 w-6' />
						</div>
						<h2 className='text-xl font-bold'>Earn & Collect</h2>
					</div>
					<p className='text-purple-100 mb-3'>
						Engage with Farcaster to earn points and rewards
					</p>
					<div className='flex justify-between'>
						<div>
							<div className='text-xs text-purple-200'>Total Points</div>
							<div className='text-2xl font-bold'>
								{userData?.totalPoints || 0}
							</div>
						</div>
						<div>
							<div className='text-xs text-purple-200'>Achievements</div>
							<div className='text-2xl font-bold'>
								{achievements?.length || 0}
							</div>
						</div>
					</div>
				</div>

				{/* Twitter Follow Banner */}
				<Card
					className='border border-[#333333] bg-[#252525] relative overflow-hidden'
					id='twitterBanner'
				>
					<div className='absolute top-2 right-2'>
						<Button
							variant='ghost'
							size='sm'
							className='h-6 w-6 p-0 rounded-full text-gray-400 hover:text-white'
							onClick={() => {
								const banner = document.getElementById('twitterBanner')
								if (banner) {
									banner.style.display = 'none'
								}
							}}
						>
							<X className='h-4 w-4' />
						</Button>
					</div>
					<CardContent className='p-4'>
						<div className='flex items-start gap-3'>
							<div className='w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0'>
								<Twitter className='h-6 w-6 text-white' />
							</div>
							<div>
								<h3 className='font-bold text-white mb-1'>Follow on Twitter</h3>
								<p className='text-sm text-gray-300 mb-3'>
									Follow our creator to get latest updates and earn 100 bonus
									points!
								</p>
								<Button
									size='sm'
									className='bg-blue-600 hover:bg-blue-700 text-white'
									onClick={() =>
										window.open('https://twitter.com/yourusername', '_blank')
									}
								>
									<Twitter className='h-4 w-4 mr-2' />
									Follow Now
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Task Tabs */}
				<Tabs defaultValue='daily' className='space-y-4'>
					<TabsList className='grid w-full grid-cols-3 bg-[#252525] text-gray-400'>
						<TabsTrigger
							value='daily'
							onClick={() => setActiveTab('daily')}
							className='data-[state=active]:bg-[#333333] data-[state=active]:text-white'
						>
							Daily
						</TabsTrigger>
						<TabsTrigger
							value='social'
							onClick={() => setActiveTab('social')}
							className='data-[state=active]:bg-[#333333] data-[state=active]:text-white'
						>
							Social
						</TabsTrigger>
						<TabsTrigger
							value='achievements'
							onClick={() => setActiveTab('achievements')}
							className='data-[state=active]:bg-[#333333] data-[state=active]:text-white'
						>
							Rewards
						</TabsTrigger>
					</TabsList>

					{/* Daily Tasks */}
					<TabsContent value='daily' className='space-y-4'>
						<div className='flex justify-between items-center'>
							<h2 className='text-base font-bold text-white'>
								Daily Challenges
							</h2>
							<Badge className='bg-green-900 text-green-300'>+50 points</Badge>
						</div>

						<div className='space-y-3'>
							<Card className='border border-[#333333] bg-[#252525] cursor-pointer hover:bg-[#2a2a2a]'>
								<div className='p-3 flex items-center'>
									<div className='w-10 h-10 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center mr-3'>
										<MessageSquare className='h-5 w-5' />
									</div>
									<div className='flex-1'>
										<h3 className='font-semibold text-sm text-white'>
											Create 3 casts
										</h3>
										<Progress value={66} className='h-1.5 mt-1 bg-[#333333]' />
									</div>
									<div className='text-xs ml-3 text-gray-300'>2/3</div>
								</div>
							</Card>

							<Card className='border border-[#333333] bg-[#252525] cursor-pointer hover:bg-[#2a2a2a]'>
								<div className='p-3 flex items-center'>
									<div className='w-10 h-10 rounded-full bg-green-900 text-green-300 flex items-center justify-center mr-3'>
										<Heart className='h-5 w-5' />
									</div>
									<div className='flex-1'>
										<h3 className='font-semibold text-sm text-white'>
											React to 5 casts
										</h3>
										<Progress value={100} className='h-1.5 mt-1 bg-[#333333]' />
									</div>
									<div className='text-xs ml-3 text-gray-300'>5/5</div>
								</div>
							</Card>

							<Card className='border border-[#333333] bg-[#252525] cursor-pointer hover:bg-[#2a2a2a]'>
								<div className='p-3 flex items-center'>
									<div className='w-10 h-10 rounded-full bg-purple-900 text-purple-300 flex items-center justify-center mr-3'>
										<Repeat className='h-5 w-5' />
									</div>
									<div className='flex-1'>
										<h3 className='font-semibold text-sm text-white'>
											Recast 2 posts
										</h3>
										<Progress value={50} className='h-1.5 mt-1 bg-[#333333]' />
									</div>
									<div className='text-xs ml-3 text-gray-300'>1/2</div>
								</div>
							</Card>
						</div>

						<Card className='border border-[#333333] bg-[#252525] p-3'>
							<div className='flex items-center mb-2'>
								<div className='p-1.5 bg-purple-900 rounded-lg mr-2 text-purple-300'>
									<Zap className='h-4 w-4' />
								</div>
								<h3 className='font-medium text-sm text-white'>
									Daily Reward Progress
								</h3>
							</div>
							<p className='text-xs text-gray-400 mb-2'>
								Complete all tasks to receive your daily 50 points bonus!
							</p>
							<Progress value={70} className='h-1.5 bg-[#333333]' />
							<div className='flex justify-between text-xs text-gray-400 mt-1'>
								<span>2/3 Completed</span>
								<span>70%</span>
							</div>
						</Card>
					</TabsContent>

					{/* Social Tasks */}
					<TabsContent value='social' className='space-y-4'>
						<div className='flex justify-between items-center'>
							<h2 className='text-base font-bold text-white'>Social Tasks</h2>
							<Badge className='bg-purple-900 text-purple-300'>
								Big Rewards
							</Badge>
						</div>

						<div className='space-y-3'>
							<SocialTask
								icon={<Twitter className='h-5 w-5' />}
								title='Follow on Twitter'
								description='Follow @farcaster to receive news and updates'
								points={50}
								completed={true}
							/>

							<SocialTask
								icon={<Share2 className='h-5 w-5' />}
								title='Share with friends'
								description='Invite 3 friends to Farcaster with your invite code'
								points={100}
							/>

							<SocialTask
								icon={<Globe className='h-5 w-5' />}
								title='Join Discord Community'
								description='Join the official Farcaster Discord server'
								points={75}
							/>
						</div>
					</TabsContent>

					{/* Achievements Tab */}
					<TabsContent value='achievements' className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Tabs defaultValue='earned' className='w-full'>
								<TabsList className='grid w-full grid-cols-2 bg-[#252525] text-gray-400'>
									<TabsTrigger
										value='earned'
										className='data-[state=active]:bg-[#333333] data-[state=active]:text-white'
									>
										Earned
									</TabsTrigger>
									<TabsTrigger
										value='progress'
										className='data-[state=active]:bg-[#333333] data-[state=active]:text-white'
									>
										In Progress
									</TabsTrigger>
								</TabsList>

								{/* Earned Achievements */}
								<TabsContent value='earned' className='space-y-4 mt-4'>
									{achievementsLoading ? (
										<div className='space-y-3'>
											{Array(3)
												.fill(0)
												.map((_, i) => (
													<Skeleton key={i} className='h-20' />
												))}
										</div>
									) : achievements?.length > 0 ? (
										<div className='space-y-3'>
											{achievements.map((achievement: Achievement) => (
												<AchievementCard
													key={achievement.id}
													achievement={achievement}
													user={userData}
												/>
											))}
										</div>
									) : (
										<Card className='p-6 text-center border border-[#333333] bg-[#252525]'>
											<div className='mx-auto w-14 h-14 rounded-full bg-[#333333] text-gray-400 flex items-center justify-center mb-3'>
												<Trophy className='h-6 w-6' />
											</div>
											<h3 className='text-base font-semibold mb-2 text-white'>
												No Achievements Yet
											</h3>
											<p className='text-sm text-gray-400 mb-4'>
												Start engaging to earn your first achievement in
												FarTrack.
											</p>
											<Button
												size='sm'
												className='bg-purple-600 hover:bg-purple-700'
											>
												View Opportunities
											</Button>
										</Card>
									)}
								</TabsContent>

								{/* In Progress Achievements */}
								<TabsContent value='progress' className='space-y-4 mt-4'>
									<div className='space-y-3'>
										<LockedAchievement
											title='Consistent Creator'
											description='Post at least one cast every day for a week'
											icon={<Flame className='h-5 w-5' />}
											progress={75}
										/>

										<LockedAchievement
											title='Engagement Master'
											description='Receive 100+ reactions on a single cast'
											icon={<Heart className='h-5 w-5' />}
											progress={65}
										/>

										<LockedAchievement
											title='Community Builder'
											description='Reach 2000 followers on your profile'
											icon={<Users className='h-5 w-5' />}
											progress={83}
										/>

										<LockedAchievement
											title='Content Curator'
											description='Recast 50 quality posts from other users'
											icon={<Repeat className='h-5 w-5' />}
											progress={42}
										/>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</TabsContent>
				</Tabs>

				{/* Achievement Levels */}
				{activeTab !== 'achievements' && (
					<Card className='border border-[#333333] bg-[#252525]'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-base font-bold text-white'>
								Achievement Levels
							</CardTitle>
						</CardHeader>
						<CardContent className='pt-0'>
							<div className='space-y-4'>
								<div>
									<div className='flex items-center justify-between mb-1'>
										<div className='flex items-center gap-2'>
											<div className='bg-[#333333] text-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-xs'>
												1
											</div>
											<span className='font-medium text-sm text-white'>
												Newcomer
											</span>
										</div>
										<span className='text-xs text-gray-400'>0-500 pts</span>
									</div>
									<Progress value={100} className='h-1.5 bg-[#333333]' />
								</div>

								<div>
									<div className='flex items-center justify-between mb-1'>
										<div className='flex items-center gap-2'>
											<div className='bg-purple-900 text-purple-300 w-6 h-6 rounded-full flex items-center justify-center text-xs'>
												2
											</div>
											<span className='font-medium text-sm text-white'>
												Regular
											</span>
										</div>
										<span className='text-xs text-gray-400'>500-1000 pts</span>
									</div>
									<Progress
										value={
											userData?.totalPoints
												? (userData.totalPoints - 500) / 5
												: 0
										}
										className='h-1.5 bg-[#333333]'
									/>
								</div>

								<div>
									<div className='flex items-center justify-between mb-1'>
										<div className='flex items-center gap-2'>
											<div className='bg-[#333333] text-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-xs'>
												3
											</div>
											<span className='font-medium text-sm text-white'>
												Elite
											</span>
										</div>
										<span className='text-xs text-gray-400'>1000+ pts</span>
									</div>
									<Progress value={0} className='h-1.5 bg-[#333333]' />
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</AppLayout>
	)
}
