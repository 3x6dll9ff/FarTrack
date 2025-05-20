import { Header } from '@/components/layout/header'
import { PageTitle } from '@/components/layout/page-title'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMediaQuery } from '@/hooks/use-mobile'
import { apiRequest } from '@/lib/queryClient'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
	BarChart2,
	Calendar,
	Download,
	FileDown,
	Heart,
	MessageSquare,
	PieChart,
	Repeat,
	Star,
	TrendingUp,
	Users,
} from 'lucide-react'
import { useState } from 'react'
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart as RechartsPC,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

interface TimeSeriesData {
	name: string
	casts: number
	replies: number
	reactions: number
	recasts: number
	engagementRate: number
}

interface EngagementTypeData {
	name: string
	value: number
	color: string
}

interface UserData {
	id: number
	username: string
	displayName: string
	bio: string
	profileImage: string
	followerCount: number
	followingCount: number
	totalPoints: number
}

interface StatData {
	id: number
	userId: number
	period: string
	casts: number
	replies: number
	reactions: number
	recasts: number
	engagementRate: number
	startDate: string
	endDate: string
}

export default function Analytics() {
	const isMobile = useMediaQuery('(max-width: 768px)')
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [period, setPeriod] = useState('monthly')
	const [userId, setUserId] = useState(1) // Default to first user

	// Fetch user data
	const { data: userData, isLoading: userLoading } = useQuery<UserData>({
		queryKey: [`/api/users/${userId}`],
		queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
	})

	// Fetch stats data
	const { data: statsData, isLoading: statsLoading } = useQuery<StatData[]>({
		queryKey: [`/api/users/${userId}/stats`, period],
		queryFn: () =>
			fetch(`/api/users/${userId}/stats?period=${period}`).then(res =>
				res.json()
			),
	})

	const handleExport = async (format: string) => {
		try {
			await apiRequest(
				'GET',
				`/api/users/${userId}/stats/export?format=${format}`,
				undefined
			)
			// Would normally download a file, but for this demo we'll just show success
			alert(`Data exported in ${format} format successfully!`)
		} catch (err) {
			console.error('Export failed:', err)
		}
	}

	// Prepare chart data
	const prepareTimeSeriesData = (): TimeSeriesData[] => {
		if (!statsData || statsData.length === 0) return []

		return statsData.map((stat: any) => ({
			name: new Date(stat.startDate).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			}),
			casts: stat.casts,
			replies: stat.replies,
			reactions: stat.reactions,
			recasts: stat.recasts,
			engagementRate: stat.engagementRate,
		}))
	}

	const prepareEngagementTypeData = () => {
		if (!statsData || statsData.length === 0) return []

		// Sum up all engagement types
		const totals = statsData.reduce(
			(acc: any, stat: any) => {
				acc.casts += stat.casts
				acc.replies += stat.replies
				acc.reactions += stat.reactions
				acc.recasts += stat.recasts
				return acc
			},
			{ casts: 0, replies: 0, reactions: 0, recasts: 0 }
		)

		return [
			{ name: 'Casts', value: totals.casts, color: '#6366f1' },
			{ name: 'Replies', value: totals.replies, color: '#22c55e' },
			{ name: 'Reactions', value: totals.reactions, color: '#f59e0b' },
			{ name: 'Recasts', value: totals.recasts, color: '#0ea5e9' },
		]
	}

	const timeSeriesData = prepareTimeSeriesData()
	const engagementTypeData = prepareEngagementTypeData()

	return (
		<div className='min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900'>
			<Sidebar
				className={
					sidebarOpen
						? 'translate-x-0'
						: isMobile
						? '-translate-x-full'
						: 'translate-x-0'
				}
			/>

			<main className='flex-1 overflow-x-hidden'>
				<Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

				<div className='px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
					<PageTitle
						title='Engagement Analytics'
						description='Detailed metrics and insights about your Farcaster activity'
					>
						<div className='mt-4 md:mt-0 flex flex-col sm:flex-row gap-3'>
							<Select value={period} onValueChange={setPeriod}>
								<SelectTrigger className='w-full sm:w-[180px]'>
									<SelectValue placeholder='Select timeframe' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='daily'>Daily</SelectItem>
									<SelectItem value='weekly'>Weekly</SelectItem>
									<SelectItem value='monthly'>Monthly</SelectItem>
								</SelectContent>
							</Select>

							<Button
								variant='outline'
								className='flex items-center gap-2'
								onClick={() => handleExport('csv')}
							>
								<FileDown className='h-4 w-4' />
								<span>Export CSV</span>
							</Button>

							<Button
								variant='outline'
								className='flex items-center gap-2'
								onClick={() => handleExport('pdf')}
							>
								<Download className='h-4 w-4' />
								<span>Export PDF</span>
							</Button>
						</div>
					</PageTitle>

					{/* Profile Overview */}
					<Card className='overflow-hidden'>
						<CardHeader className='bg-primary-50 dark:bg-primary-900/30 pb-4'>
							<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
								<div className='flex items-center gap-4'>
									{userLoading ? (
										<>
											<Skeleton className='h-16 w-16 rounded-full' />
											<div>
												<Skeleton className='h-5 w-32 mb-1' />
												<Skeleton className='h-4 w-24' />
											</div>
										</>
									) : (
										<>
											<div className='h-16 w-16 rounded-full overflow-hidden border-2 border-primary-200 dark:border-primary-800'>
												<img
													src={userData?.profileImage}
													alt={userData?.displayName || userData?.username}
													className='h-full w-full object-cover'
												/>
											</div>
											<div>
												<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
													{userData?.displayName || userData?.username}
												</h2>
												<p className='text-sm text-gray-500 dark:text-gray-400'>
													@{userData?.username}
												</p>
											</div>
										</>
									)}
								</div>

								<div className='flex gap-3 mt-4 sm:mt-0'>
									<div className='text-center px-2'>
										<div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
											Total Points
										</div>
										<div className='text-xl font-bold text-primary-600 dark:text-primary-400'>
											{userLoading ? (
												<Skeleton className='h-6 w-16 mx-auto' />
											) : (
												userData?.totalPoints
											)}
										</div>
									</div>

									<div className='text-center px-2 border-l border-gray-200 dark:border-gray-700'>
										<div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
											Followers
										</div>
										<div className='text-xl font-bold text-gray-900 dark:text-gray-100'>
											{userLoading ? (
												<Skeleton className='h-6 w-16 mx-auto' />
											) : (
												userData?.followerCount
											)}
										</div>
									</div>

									<div className='text-center px-2 border-l border-gray-200 dark:border-gray-700'>
										<div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
											Following
										</div>
										<div className='text-xl font-bold text-gray-900 dark:text-gray-100'>
											{userLoading ? (
												<Skeleton className='h-6 w-16 mx-auto' />
											) : (
												userData?.followingCount
											)}
										</div>
									</div>
								</div>
							</div>
						</CardHeader>
					</Card>

					{/* Analytics Tabs */}
					<Tabs defaultValue='overview' className='space-y-4'>
						<TabsList className='grid w-full grid-cols-4'>
							<TabsTrigger value='overview'>Overview</TabsTrigger>
							<TabsTrigger value='engagement'>Engagement</TabsTrigger>
							<TabsTrigger value='trend'>Trends</TabsTrigger>
							<TabsTrigger value='comparison'>Comparison</TabsTrigger>
						</TabsList>

						{/* Overview Tab */}
						<TabsContent value='overview' className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
								{statsLoading ? (
									Array(4)
										.fill(0)
										.map((_, i) => <Skeleton key={i} className='h-32' />)
								) : (
									<>
										<Card>
											<CardContent className='p-6'>
												<div className='flex justify-between items-start'>
													<div>
														<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
															Total Casts
														</p>
														<h3 className='text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100'>
															{timeSeriesData.reduce(
																(sum: number, item: any) => sum + item.casts,
																0
															)}
														</h3>
													</div>
													<div className='bg-primary-100 text-primary-600 p-2 rounded-lg dark:bg-primary-900 dark:text-primary-300'>
														<MessageSquare className='h-5 w-5' />
													</div>
												</div>
												<div className='mt-3 h-1 bg-gray-100 rounded dark:bg-gray-700'>
													<motion.div
														className='h-full bg-primary-500 rounded'
														initial={{ width: 0 }}
														animate={{ width: '75%' }}
														transition={{ duration: 0.8, delay: 0.2 }}
													/>
												</div>
											</CardContent>
										</Card>

										<Card>
											<CardContent className='p-6'>
												<div className='flex justify-between items-start'>
													<div>
														<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
															Reactions
														</p>
														<h3 className='text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100'>
															{timeSeriesData.reduce(
																(sum: number, item: any) =>
																	sum + item.reactions,
																0
															)}
														</h3>
													</div>
													<div className='bg-red-100 text-red-600 p-2 rounded-lg dark:bg-red-900 dark:text-red-300'>
														<Heart className='h-5 w-5' />
													</div>
												</div>
												<div className='mt-3 h-1 bg-gray-100 rounded dark:bg-gray-700'>
													<motion.div
														className='h-full bg-red-500 rounded'
														initial={{ width: 0 }}
														animate={{ width: '65%' }}
														transition={{ duration: 0.8, delay: 0.4 }}
													/>
												</div>
											</CardContent>
										</Card>

										<Card>
											<CardContent className='p-6'>
												<div className='flex justify-between items-start'>
													<div>
														<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
															Replies
														</p>
														<h3 className='text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100'>
															{timeSeriesData.reduce(
																(sum: number, item: any) => sum + item.replies,
																0
															)}
														</h3>
													</div>
													<div className='bg-green-100 text-green-600 p-2 rounded-lg dark:bg-green-900 dark:text-green-300'>
														<MessageSquare className='h-5 w-5' />
													</div>
												</div>
												<div className='mt-3 h-1 bg-gray-100 rounded dark:bg-gray-700'>
													<motion.div
														className='h-full bg-green-500 rounded'
														initial={{ width: 0 }}
														animate={{ width: '50%' }}
														transition={{ duration: 0.8, delay: 0.6 }}
													/>
												</div>
											</CardContent>
										</Card>

										<Card>
											<CardContent className='p-6'>
												<div className='flex justify-between items-start'>
													<div>
														<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
															Recasts
														</p>
														<h3 className='text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100'>
															{timeSeriesData.reduce(
																(sum: number, item: any) => sum + item.recasts,
																0
															)}
														</h3>
													</div>
													<div className='bg-blue-100 text-blue-600 p-2 rounded-lg dark:bg-blue-900 dark:text-blue-300'>
														<Repeat className='h-5 w-5' />
													</div>
												</div>
												<div className='mt-3 h-1 bg-gray-100 rounded dark:bg-gray-700'>
													<motion.div
														className='h-full bg-blue-500 rounded'
														initial={{ width: 0 }}
														animate={{ width: '85%' }}
														transition={{ duration: 0.8, delay: 0.8 }}
													/>
												</div>
											</CardContent>
										</Card>
									</>
								)}
							</div>

							{/* Charts Grid */}
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
								<Card>
									<CardHeader>
										<CardTitle className='text-lg font-semibold flex items-center gap-2'>
											<TrendingUp className='h-5 w-5 text-primary-500' />
											Engagement Over Time
										</CardTitle>
									</CardHeader>
									<CardContent>
										{statsLoading ? (
											<Skeleton className='h-72 w-full' />
										) : (
											<div className='h-72'>
												<ResponsiveContainer width='100%' height='100%'>
													<AreaChart
														data={timeSeriesData}
														margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
													>
														<defs>
															<linearGradient
																id='colorCasts'
																x1='0'
																y1='0'
																x2='0'
																y2='1'
															>
																<stop
																	offset='5%'
																	stopColor='#6366f1'
																	stopOpacity={0.8}
																/>
																<stop
																	offset='95%'
																	stopColor='#6366f1'
																	stopOpacity={0.1}
																/>
															</linearGradient>
															<linearGradient
																id='colorReplies'
																x1='0'
																y1='0'
																x2='0'
																y2='1'
															>
																<stop
																	offset='5%'
																	stopColor='#22c55e'
																	stopOpacity={0.8}
																/>
																<stop
																	offset='95%'
																	stopColor='#22c55e'
																	stopOpacity={0.1}
																/>
															</linearGradient>
														</defs>
														<CartesianGrid
															strokeDasharray='3 3'
															vertical={false}
														/>
														<XAxis dataKey='name' />
														<YAxis />
														<Tooltip />
														<Area
															type='monotone'
															dataKey='casts'
															name='Casts'
															stroke='#6366f1'
															fillOpacity={1}
															fill='url(#colorCasts)'
														/>
														<Area
															type='monotone'
															dataKey='replies'
															name='Replies'
															stroke='#22c55e'
															fillOpacity={1}
															fill='url(#colorReplies)'
														/>
													</AreaChart>
												</ResponsiveContainer>
											</div>
										)}
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className='text-lg font-semibold flex items-center gap-2'>
											<PieChart className='h-5 w-5 text-primary-500' />
											Engagement Breakdown
										</CardTitle>
									</CardHeader>
									<CardContent>
										{statsLoading ? (
											<Skeleton className='h-72 w-full' />
										) : (
											<div className='h-72'>
												<ResponsiveContainer width='100%' height='100%'>
													<RechartsPC>
														<Pie
															data={engagementTypeData}
															cx='50%'
															cy='50%'
															outerRadius={80}
															innerRadius={40}
															dataKey='value'
															nameKey='name'
															label={entry => entry.name}
															paddingAngle={5}
														>
															{engagementTypeData.map((entry, index) => (
																<Cell
																	key={`cell-${index}`}
																	fill={entry.color}
																/>
															))}
														</Pie>
														<Tooltip />
														<Legend />
													</RechartsPC>
												</ResponsiveContainer>
											</div>
										)}
									</CardContent>
								</Card>
							</div>

							{/* Weekly Performance Card */}
							<Card>
								<CardHeader>
									<CardTitle className='text-lg font-semibold flex items-center gap-2'>
										<Calendar className='h-5 w-5 text-primary-500' />
										Weekly Performance
									</CardTitle>
								</CardHeader>
								<CardContent>
									{statsLoading ? (
										<Skeleton className='h-72 w-full' />
									) : (
										<div className='h-72'>
											<ResponsiveContainer width='100%' height='100%'>
												<BarChart
													data={timeSeriesData}
													margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
												>
													<CartesianGrid
														strokeDasharray='3 3'
														vertical={false}
													/>
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
						</TabsContent>

						{/* Engagement Tab */}
						<TabsContent value='engagement' className='space-y-4'>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
								<Card>
									<CardHeader>
										<CardTitle className='text-lg font-semibold flex items-center gap-2'>
											<Users className='h-5 w-5 text-primary-500' />
											Audience Engagement
										</CardTitle>
									</CardHeader>
									<CardContent>
										{statsLoading ? (
											<Skeleton className='h-72 w-full' />
										) : (
											<div className='h-72'>
												<ResponsiveContainer width='100%' height='100%'>
													<LineChart
														data={timeSeriesData}
														margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
													>
														<CartesianGrid
															strokeDasharray='3 3'
															vertical={false}
														/>
														<XAxis dataKey='name' />
														<YAxis />
														<Tooltip />
														<Legend />
														<Line
															type='monotone'
															dataKey='engagementRate'
															name='Engagement Rate'
															stroke='#6366f1'
															strokeWidth={2}
															dot={false}
														/>
													</LineChart>
												</ResponsiveContainer>
											</div>
										)}
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className='text-lg font-semibold flex items-center gap-2'>
											<Star className='h-5 w-5 text-primary-500' />
											Top Performing Content
										</CardTitle>
									</CardHeader>
									<CardContent className='p-0'>
										{statsLoading ? (
											<div className='p-6 space-y-4'>
												{Array(5)
													.fill(0)
													.map((_, i) => (
														<Skeleton key={i} className='h-12 w-full' />
													))}
											</div>
										) : (
											<div className='divide-y divide-gray-200 dark:divide-gray-700'>
												<div className='p-4 flex items-center'>
													<div className='bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 w-10 h-10 rounded-full flex items-center justify-center mr-3'>
														<MessageSquare className='h-5 w-5' />
													</div>
													<div className='flex-1'>
														<div className='flex items-center justify-between'>
															<h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
																Web3 Analytics Tools
															</h4>
															<span className='text-sm text-primary-600 dark:text-primary-400'>
																+124 pts
															</span>
														</div>
														<div className='flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1'>
															<span>45 replies</span>
															<span className='mx-2'>•</span>
															<span>78 reactions</span>
														</div>
													</div>
												</div>

												<div className='p-4 flex items-center'>
													<div className='bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 w-10 h-10 rounded-full flex items-center justify-center mr-3'>
														<MessageSquare className='h-5 w-5' />
													</div>
													<div className='flex-1'>
														<div className='flex items-center justify-between'>
															<h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
																Farcaster Development Updates
															</h4>
															<span className='text-sm text-primary-600 dark:text-primary-400'>
																+98 pts
															</span>
														</div>
														<div className='flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1'>
															<span>32 replies</span>
															<span className='mx-2'>•</span>
															<span>65 reactions</span>
														</div>
													</div>
												</div>

												<div className='p-4 flex items-center'>
													<div className='bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 w-10 h-10 rounded-full flex items-center justify-center mr-3'>
														<MessageSquare className='h-5 w-5' />
													</div>
													<div className='flex-1'>
														<div className='flex items-center justify-between'>
															<h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
																Community Building Strategies
															</h4>
															<span className='text-sm text-primary-600 dark:text-primary-400'>
																+87 pts
															</span>
														</div>
														<div className='flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1'>
															<span>29 replies</span>
															<span className='mx-2'>•</span>
															<span>58 reactions</span>
														</div>
													</div>
												</div>

												<div className='p-4 flex items-center'>
													<div className='bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300 w-10 h-10 rounded-full flex items-center justify-center mr-3'>
														<MessageSquare className='h-5 w-5' />
													</div>
													<div className='flex-1'>
														<div className='flex items-center justify-between'>
															<h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
																NFT Market Trends
															</h4>
															<span className='text-sm text-primary-600 dark:text-primary-400'>
																+72 pts
															</span>
														</div>
														<div className='flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1'>
															<span>18 replies</span>
															<span className='mx-2'>•</span>
															<span>46 reactions</span>
														</div>
													</div>
												</div>

												<div className='p-4 flex items-center'>
													<div className='bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 w-10 h-10 rounded-full flex items-center justify-center mr-3'>
														<MessageSquare className='h-5 w-5' />
													</div>
													<div className='flex-1'>
														<div className='flex items-center justify-between'>
															<h4 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
																DeFi Innovations
															</h4>
															<span className='text-sm text-primary-600 dark:text-primary-400'>
																+65 pts
															</span>
														</div>
														<div className='flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1'>
															<span>15 replies</span>
															<span className='mx-2'>•</span>
															<span>42 reactions</span>
														</div>
													</div>
												</div>
											</div>
										)}
									</CardContent>
								</Card>
							</div>

							<Card>
								<CardHeader>
									<CardTitle className='text-lg font-semibold flex items-center gap-2'>
										<BarChart2 className='h-5 w-5 text-primary-500' />
										Engagement Metrics
									</CardTitle>
								</CardHeader>
								<CardContent>
									{statsLoading ? (
										<div className='space-y-6'>
											{Array(4)
												.fill(0)
												.map((_, i) => (
													<Skeleton key={i} className='h-10 w-full' />
												))}
										</div>
									) : (
										<div className='space-y-6'>
											<div>
												<div className='flex items-center justify-between mb-2'>
													<div className='flex items-center'>
														<MessageSquare className='h-5 w-5 text-primary-500 mr-2' />
														<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
															Cast Engagement
														</span>
													</div>
													<span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
														{Math.round(
															timeSeriesData.reduce(
																(sum, item) => sum + item.casts,
																0
															) / timeSeriesData.length
														)}{' '}
														per period
													</span>
												</div>
												<div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700'>
													<motion.div
														className='h-full bg-primary-500 rounded-full'
														initial={{ width: 0 }}
														animate={{ width: '85%' }}
														transition={{ duration: 1 }}
													/>
												</div>
											</div>

											<div>
												<div className='flex items-center justify-between mb-2'>
													<div className='flex items-center'>
														<Heart className='h-5 w-5 text-red-500 mr-2' />
														<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
															Reaction Rate
														</span>
													</div>
													<span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
														{Math.round(
															timeSeriesData.reduce(
																(sum, item) => sum + item.reactions,
																0
															) / timeSeriesData.length
														)}{' '}
														per period
													</span>
												</div>
												<div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700'>
													<motion.div
														className='h-full bg-red-500 rounded-full'
														initial={{ width: 0 }}
														animate={{ width: '72%' }}
														transition={{ duration: 1, delay: 0.2 }}
													/>
												</div>
											</div>

											<div>
												<div className='flex items-center justify-between mb-2'>
													<div className='flex items-center'>
														<MessageSquare className='h-5 w-5 text-green-500 mr-2' />
														<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
															Reply Activity
														</span>
													</div>
													<span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
														{Math.round(
															timeSeriesData.reduce(
																(sum, item) => sum + item.replies,
																0
															) / timeSeriesData.length
														)}{' '}
														per period
													</span>
												</div>
												<div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700'>
													<motion.div
														className='h-full bg-green-500 rounded-full'
														initial={{ width: 0 }}
														animate={{ width: '65%' }}
														transition={{ duration: 1, delay: 0.4 }}
													/>
												</div>
											</div>

											<div>
												<div className='flex items-center justify-between mb-2'>
													<div className='flex items-center'>
														<Repeat className='h-5 w-5 text-blue-500 mr-2' />
														<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
															Recast Frequency
														</span>
													</div>
													<span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
														{Math.round(
															timeSeriesData.reduce(
																(sum, item) => sum + item.recasts,
																0
															) / timeSeriesData.length
														)}{' '}
														per period
													</span>
												</div>
												<div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700'>
													<motion.div
														className='h-full bg-blue-500 rounded-full'
														initial={{ width: 0 }}
														animate={{ width: '58%' }}
														transition={{ duration: 1, delay: 0.6 }}
													/>
												</div>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Trend Tab */}
						<TabsContent value='trend' className='space-y-4'>
							<Card>
								<CardHeader>
									<CardTitle className='text-lg font-semibold'>
										Growth Trends
									</CardTitle>
								</CardHeader>
								<CardContent className='p-0'>
									<div className='grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700'>
										<div className='p-6 text-center'>
											<div className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
												{statsLoading ? (
													<Skeleton className='h-10 w-20 mx-auto' />
												) : (
													'+15%'
												)}
											</div>
											<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
												Follower Growth
											</p>
											<div className='flex justify-center mt-3'>
												<span className='text-xs px-2 py-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-full'>
													Increasing
												</span>
											</div>
										</div>

										<div className='p-6 text-center'>
											<div className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
												{statsLoading ? (
													<Skeleton className='h-10 w-20 mx-auto' />
												) : (
													'+24%'
												)}
											</div>
											<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
												Engagement Rate
											</p>
											<div className='flex justify-center mt-3'>
												<span className='text-xs px-2 py-1 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-full'>
													Above Average
												</span>
											</div>
										</div>

										<div className='p-6 text-center'>
											<div className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
												{statsLoading ? (
													<Skeleton className='h-10 w-20 mx-auto' />
												) : (
													'+8%'
												)}
											</div>
											<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
												Points Growth
											</p>
											<div className='flex justify-center mt-3'>
												<span className='text-xs px-2 py-1 bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300 rounded-full'>
													Steady Growth
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className='text-lg font-semibold'>
										Historical Comparison
									</CardTitle>
								</CardHeader>
								<CardContent>
									{statsLoading ? (
										<Skeleton className='h-80 w-full' />
									) : (
										<div className='h-80'>
											<ResponsiveContainer width='100%' height='100%'>
												<LineChart
													data={timeSeriesData}
													margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
												>
													<CartesianGrid
														strokeDasharray='3 3'
														vertical={false}
													/>
													<XAxis dataKey='name' />
													<YAxis />
													<Tooltip />
													<Legend />
													<Line
														type='monotone'
														dataKey='casts'
														name='Casts'
														stroke='#6366f1'
														strokeWidth={2}
														dot={{ r: 4 }}
													/>
													<Line
														type='monotone'
														dataKey='replies'
														name='Replies'
														stroke='#22c55e'
														strokeWidth={2}
														dot={{ r: 4 }}
													/>
													<Line
														type='monotone'
														dataKey='reactions'
														name='Reactions'
														stroke='#f59e0b'
														strokeWidth={2}
														dot={{ r: 4 }}
													/>
													<Line
														type='monotone'
														dataKey='recasts'
														name='Recasts'
														stroke='#0ea5e9'
														strokeWidth={2}
														dot={{ r: 4 }}
													/>
												</LineChart>
											</ResponsiveContainer>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Comparison Tab */}
						<TabsContent value='comparison' className='space-y-4'>
							<Card>
								<CardHeader>
									<CardTitle className='text-lg font-semibold'>
										Benchmark Comparison
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className='space-y-8'>
										<div>
											<div className='flex items-center justify-between mb-2'>
												<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
													Engagement Score
												</span>
												<span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
													78/100
												</span>
											</div>
											<div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700'>
												<div
													className='h-full bg-primary-500 rounded-full'
													style={{ width: '78%' }}
												/>
											</div>
											<div className='flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400'>
												<span>Your Score</span>
												<span>Average: 65/100</span>
											</div>
										</div>

										<div>
											<div className='flex items-center justify-between mb-2'>
												<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
													Activity Frequency
												</span>
												<span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
													86/100
												</span>
											</div>
											<div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700'>
												<div
													className='h-full bg-green-500 rounded-full'
													style={{ width: '86%' }}
												/>
											</div>
											<div className='flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400'>
												<span>Your Score</span>
												<span>Average: 72/100</span>
											</div>
										</div>

										<div>
											<div className='flex items-center justify-between mb-2'>
												<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
													Growth Rate
												</span>
												<span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
													64/100
												</span>
											</div>
											<div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700'>
												<div
													className='h-full bg-amber-500 rounded-full'
													style={{ width: '64%' }}
												/>
											</div>
											<div className='flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400'>
												<span>Your Score</span>
												<span>Average: 70/100</span>
											</div>
										</div>

										<div>
											<div className='flex items-center justify-between mb-2'>
												<span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
													Content Quality
												</span>
												<span className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
													92/100
												</span>
											</div>
											<div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700'>
												<div
													className='h-full bg-blue-500 rounded-full'
													style={{ width: '92%' }}
												/>
											</div>
											<div className='flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400'>
												<span>Your Score</span>
												<span>Average: 68/100</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
								<Card>
									<CardHeader>
										<CardTitle className='text-lg font-semibold'>
											Performance Percentile
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className='relative h-64 flex items-center justify-center'>
											{statsLoading ? (
												<Skeleton className='h-64 w-full' />
											) : (
												<>
													<div className='text-center'>
														<h2 className='text-5xl font-bold text-primary-500'>
															Top 15%
														</h2>
														<p className='text-gray-500 dark:text-gray-400 mt-2'>
															of all Farcaster users
														</p>
													</div>
													<div className='absolute inset-0'>
														<svg
															viewBox='0 0 100 100'
															className='absolute inset-0 w-full h-full'
														>
															<circle
																cx='50'
																cy='50'
																r='40'
																fill='none'
																stroke='currentColor'
																strokeWidth='8'
																className='text-gray-200 dark:text-gray-700'
															/>
															<motion.circle
																cx='50'
																cy='50'
																r='40'
																fill='none'
																stroke='currentColor'
																strokeWidth='8'
																strokeDasharray='251.2'
																strokeDashoffset='0'
																strokeLinecap='round'
																className='text-primary-500'
																initial={{ strokeDashoffset: 251.2 }}
																animate={{ strokeDashoffset: 251.2 * 0.15 }}
																transition={{
																	duration: 1.5,
																	ease: 'easeInOut',
																}}
																transform='rotate(-90 50 50)'
															/>
														</svg>
													</div>
												</>
											)}
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className='text-lg font-semibold'>
											Performance Over Time
										</CardTitle>
									</CardHeader>
									<CardContent>
										{statsLoading ? (
											<Skeleton className='h-64 w-full' />
										) : (
											<div className='h-64'>
												<ResponsiveContainer width='100%' height='100%'>
													<LineChart
														data={timeSeriesData}
														margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
													>
														<CartesianGrid
															strokeDasharray='3 3'
															vertical={false}
														/>
														<XAxis dataKey='name' />
														<YAxis />
														<Tooltip />
														<Line
															type='monotone'
															dataKey='engagementRate'
															name='Your Performance'
															stroke='#6366f1'
															strokeWidth={3}
															dot={{ r: 4 }}
														/>
														<Line
															type='monotone'
															dataKey='engagementRate'
															name='Average User'
															stroke='#9ca3af'
															strokeWidth={3}
															dot={{ r: 4 }}
															strokeDasharray='5 5'
															connectNulls
														/>
													</LineChart>
												</ResponsiveContainer>
											</div>
										)}
									</CardContent>
								</Card>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</div>
	)
}
