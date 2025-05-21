import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { User } from '@shared/schema'
import { useQuery } from '@tanstack/react-query'
import {
	AlertCircle,
	CheckCircle2,
	ChevronRight,
	Clock,
	LogOut,
	MoreHorizontal,
	Settings,
} from 'lucide-react'
import { Link } from 'wouter'

export function ProfileList() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['/api/users'],
		queryFn: () => fetch('/api/users').then(res => res.json()),
	})

	const getRegistrationInfo = (date: string) => {
		const registrationDate = new Date(date)
		const now = new Date()
		const diffTime = Math.abs(now.getTime() - registrationDate.getTime())
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

		return {
			date: registrationDate.toLocaleDateString(),
			daysAgo: diffDays,
			displayDate: registrationDate.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}),
		}
	}

	const getStatusInfo = (points: number) => {
		if (points > 800) {
			return {
				label: 'Active',
				component: (
					<Badge variant='success' className='flex items-center gap-1'>
						<CheckCircle2 className='h-3 w-3' />
						<span>Active</span>
					</Badge>
				),
			}
		} else if (points > 500) {
			return {
				label: 'Progressing',
				component: (
					<Badge variant='warning' className='flex items-center gap-1'>
						<Clock className='h-3 w-3' />
						<span>Progressing</span>
					</Badge>
				),
			}
		} else {
			return {
				label: 'Getting Started',
				component: (
					<Badge variant='secondary' className='flex items-center gap-1'>
						<AlertCircle className='h-3 w-3' />
						<span>Getting Started</span>
					</Badge>
				),
			}
		}
	}

	return (
		<Card className='col-span-full'>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-lg font-semibold'>
					Recently Active Profiles
				</CardTitle>
				<Link href='/profiles'>
					<a className='text-primary-600 text-sm font-medium hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center'>
						View All
						<ChevronRight className='h-4 w-4 ml-1' />
					</a>
				</Link>
			</CardHeader>
			<CardContent className='p-0'>
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
						<thead>
							<tr>
								<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400'>
									User
								</th>
								<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400'>
									Points
								</th>
								<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400'>
									Registration Date
								</th>
								<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400'>
									Status
								</th>
								<th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
							{isLoading ? (
								Array.from({ length: 4 }).map((_, index) => (
									<tr key={index}>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='flex items-center'>
												<Skeleton className='h-10 w-10 rounded-full' />
												<div className='ml-3'>
													<Skeleton className='h-4 w-32' />
													<Skeleton className='h-3 w-24 mt-1' />
												</div>
											</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<Skeleton className='h-4 w-16' />
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<Skeleton className='h-4 w-24' />
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<Skeleton className='h-6 w-24' />
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-right'>
											<Skeleton className='h-8 w-8 rounded-full ml-auto' />
										</td>
									</tr>
								))
							) : error ? (
								<tr>
									<td
										colSpan={5}
										className='px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400'
									>
										Failed to load profiles. Please try again.
									</td>
								</tr>
							) : (
								data?.map((user: User) => {
									const regInfo = getRegistrationInfo(user.registrationDate)
									const status = getStatusInfo(user.totalPoints)

									return (
										<tr
											key={user.id}
											className='hover:bg-gray-50 dark:hover:bg-gray-800/50'
										>
											<td className='px-4 py-3 whitespace-nowrap'>
												<div className='flex items-center'>
													<Avatar>
														<AvatarImage
															src={user.profileImage}
															alt={user.displayName || user.username}
														/>
														<AvatarFallback>
															{user.username.substring(0, 2).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div className='ml-3'>
														<div className='text-sm font-medium text-gray-900 dark:text-gray-100'>
															{user.displayName || user.username}
														</div>
														<div className='text-xs text-gray-500 dark:text-gray-400'>
															@{user.username}
														</div>
													</div>
												</div>
											</td>
											<td className='px-4 py-3 whitespace-nowrap'>
												<div className='text-sm text-gray-900 dark:text-gray-100'>
													{user.totalPoints}
												</div>
												<div className='text-xs text-gray-500 dark:text-gray-400'>
													{user.followerCount} followers
												</div>
											</td>
											<td className='px-4 py-3 whitespace-nowrap'>
												<div className='text-sm text-gray-900 dark:text-gray-100'>
													{regInfo.displayDate}
												</div>
												<div className='text-xs text-gray-500 dark:text-gray-400'>
													{regInfo.daysAgo} days ago
												</div>
											</td>
											<td className='px-4 py-3 whitespace-nowrap'>
												{status.component}
											</td>
											<td className='px-4 py-3 whitespace-nowrap text-right text-sm'>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant='ghost' size='icon'>
															<MoreHorizontal className='h-4 w-4' />
															<span className='sr-only'>Open menu</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem>
															<Link href={`/profile/${user.id}`}>
																<a className='flex w-full'>View profile</a>
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem>
															<Settings className='mr-2 h-4 w-4' />
															<span>Settings</span>
														</DropdownMenuItem>
														<DropdownMenuItem>
															<LogOut className='mr-2 h-4 w-4' />
															<span>Log out</span>
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</td>
										</tr>
									)
								})
							)}
						</tbody>
					</table>
				</div>

				<div className='flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700'>
					<div className='text-sm text-gray-700 dark:text-gray-300'>
						Showing <span className='font-medium'>1</span> to{' '}
						<span className='font-medium'>4</span> of{' '}
						<span className='font-medium'>{data?.length || 0}</span> results
					</div>
					<div className='flex space-x-2'>
						<Button variant='outline' size='sm' disabled>
							Previous
						</Button>
						<Button
							variant='outline'
							size='sm'
							className='bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
						>
							1
						</Button>
						<Button variant='outline' size='sm'>
							Next
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
