'use client'

import { apiRouter } from '@/lib/trpc'

export default function OverviewPage() {
  const { data: tasks, isLoading: tasksLoading } = apiRouter.tasks.getAll.useQuery({})
  const { data: users, isLoading: usersLoading } = apiRouter.users.getAll.useQuery()

  if (tasksLoading || usersLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const totalTasks = tasks?.length || 0
  const inProgressTasks = tasks?.filter(task => task.status === 'IN_PROGRESS').length || 0
  const completedTasks = tasks?.filter(task => task.status === 'DONE').length || 0
  const totalUsers = users?.length || 0

  // Priority breakdown
  const urgentTasks = tasks?.filter(task => task.priority === 'URGENT').length || 0
  const highTasks = tasks?.filter(task => task.priority === 'HIGH').length || 0
  const mediumTasks = tasks?.filter(task => task.priority === 'MEDIUM').length || 0
  const lowTasks = tasks?.filter(task => task.priority === 'LOW').length || 0

  // Recent activity (last 5 completed tasks)
  const recentActivity = tasks
    ?.filter(task => task.status === 'DONE')
    .slice(-5)
    .reverse() || []

  // Team workload
  const teamWorkload = users?.map(user => {
    const userTasks = tasks?.filter(task => task.assigneeId === user.id) || []
    const activeTasks = userTasks.filter(task => task.status !== 'DONE').length
    return {
      ...user,
      activeTasks
    }
  }) || []

  return (
    <div className="p-8 bg-white min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-600 mt-1">Dashboard and project insights</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-md">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Urgent</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{urgentTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">High</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{highTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Medium</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{mediumTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Low</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{lowTasks}</span>
            </div>
          </div>
        </div>

        {/* Team Workload */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Workload</h3>
          {teamWorkload.length > 0 ? (
            <div className="space-y-3">
              {teamWorkload.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {user.activeTasks} active tasks
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No team members yet</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg border lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Completions</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((task) => (
                <div key={task.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{task.assignee.name}</span> completed{' '}
                      <span className="font-medium">&ldquo;{task.title}&rdquo;</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {task.description && task.description.length > 60 
                        ? `${task.description.substring(0, 60)}...` 
                        : task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No completed tasks yet</p>
          )}
        </div>
      </div>
    </div>
  )
}