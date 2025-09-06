'use client'

import { useState } from 'react'
import { apiRouter } from '@/lib/trpc'
import { TaskCard } from '@/components/ui/TaskCard'
import { TaskForm } from '@/components/ui/TaskForm'
import { UserForm } from '@/components/ui/UserForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export default function TasksPage() {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    taskId: string | null
    taskTitle: string
  }>({ isOpen: false, taskId: null, taskTitle: '' })

  const { 
    data: tasks, 
    isLoading: tasksLoading, 
    refetch: refetchTasks 
  } = apiRouter.tasks.getAll.useQuery({})
  
  const { 
    data: users, 
    isLoading: usersLoading, 
    refetch: refetchUsers 
  } = apiRouter.users.getAll.useQuery()

  const deleteTaskMutation = apiRouter.tasks.delete.useMutation({
    onSuccess: () => {
      refetchTasks()
      setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' })
    }
  })

  const handleDeleteTask = (taskId: string) => {
    const task = tasks?.find(t => t.id === taskId)
    if (task) {
      setDeleteConfirm({
        isOpen: true,
        taskId: taskId,
        taskTitle: task.title
      })
    }
  }

  const confirmDelete = () => {
    if (deleteConfirm.taskId) {
      deleteTaskMutation.mutate({ id: deleteConfirm.taskId })
    }
  }

  const handleTaskFormSuccess = () => {
    setShowTaskForm(false)
    refetchTasks()
  }

  const handleUserFormSuccess = () => {
    setShowUserForm(false)
    refetchUsers()
  }

  if (tasksLoading || usersLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-white min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">Manage your team&apos;s tasks and assignments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUserForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add User
          </button>
          <button
            onClick={() => setShowTaskForm(true)}
            disabled={!users?.length}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            New Task
          </button>
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            <div className="text-sm text-gray-500">
              {tasks?.length || 0} total
            </div>
          </div>
          
          {tasks?.length ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={refetchTasks}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-500 mb-2">No tasks yet</div>
              {users?.length ? (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Create your first task
                </button>
              ) : (
                <div className="text-sm text-gray-400">
                  Add users first to create tasks
                </div>
              )}
            </div>
          )}
        </div>

        {/* Users Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            <div className="text-sm text-gray-500">
              {users?.length || 0} users
            </div>
          </div>
          
          {users?.length ? (
            <div className="space-y-3">
              {users.map((user) => {
                const userTasks = tasks?.filter(task => task.assigneeId === user.id) || []
                const completedTasks = userTasks.filter(task => task.status === 'DONE').length
                
                return (
                  <div key={user.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        <div>{userTasks.length} tasks</div>
                        <div>{completedTasks} completed</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-gray-500 mb-2">No team members</div>
              <button
                onClick={() => setShowUserForm(true)}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Add your first user
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Forms */}
      {showTaskForm && users && (
        <TaskForm
          users={users}
          onSuccess={handleTaskFormSuccess}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {showUserForm && (
        <UserForm
          onSuccess={handleUserFormSuccess}
          onCancel={() => setShowUserForm(false)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteConfirm.taskTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, taskId: null, taskTitle: '' })}
        isLoading={deleteTaskMutation.isPending}
      />
    </div>
  )
}