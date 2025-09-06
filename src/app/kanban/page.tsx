'use client'

import { useState } from 'react'
import { apiRouter } from '@/lib/trpc'
import { TaskCard } from '@/components/ui/TaskCard'
import { TaskForm } from '@/components/ui/TaskForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export default function KanbanPage() {
  const [showTaskForm, setShowTaskForm] = useState(false)
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
    isLoading: usersLoading 
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

  if (tasksLoading || usersLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  // Group tasks by status
  const todoTasks = tasks?.filter(task => task.status === 'TODO') || []
  const inProgressTasks = tasks?.filter(task => task.status === 'IN_PROGRESS') || []
  const doneTasks = tasks?.filter(task => task.status === 'DONE') || []

  const columns = [
    { 
      id: 'TODO' as TaskStatus, 
      title: 'To Do', 
      tasks: todoTasks, 
      bgColor: 'bg-gray-100',
      headerColor: 'bg-gray-200'
    },
    { 
      id: 'IN_PROGRESS' as TaskStatus, 
      title: 'In Progress', 
      tasks: inProgressTasks, 
      bgColor: 'bg-yellow-50',
      headerColor: 'bg-yellow-100'
    },
    { 
      id: 'DONE' as TaskStatus, 
      title: 'Done', 
      tasks: doneTasks, 
      bgColor: 'bg-green-50',
      headerColor: 'bg-green-100'
    }
  ]

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600 mt-1">Drag and drop tasks between columns</p>
        </div>
        <button
          onClick={() => setShowTaskForm(true)}
          disabled={!users?.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Task
        </button>
      </div>

      {!users?.length && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> Add users first to create and assign tasks.{' '}
            <a href="/tasks" className="underline hover:text-yellow-900">
              Go to Tasks page
            </a> to add users.
          </p>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className={`${column.bgColor} rounded-lg p-4`}>
            {/* Column Header */}
            <div className={`${column.headerColor} rounded-md px-4 py-2 mb-4`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{column.title}</h3>
                <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {column.tasks.length > 0 ? (
                column.tasks.map((task) => (
                  <div key={task.id} className="transform transition-transform duration-200 hover:scale-105">
                    <TaskCard
                      task={task}
                      onUpdate={refetchTasks}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-sm">
                    {column.id === 'TODO' ? (
                      users?.length ? (
                        <>
                          No tasks yet
                          <br />
                          <button
                            onClick={() => setShowTaskForm(true)}
                            className="text-blue-500 hover:text-blue-600 font-medium mt-1"
                          >
                            Add your first task
                          </button>
                        </>
                      ) : (
                        'Add users first to create tasks'
                      )
                    ) : `No ${column.title.toLowerCase()} tasks`}
                  </p>
                </div>
              )}
            </div>

            {/* Add Task Button for TODO column */}
            {column.id === 'TODO' && users?.length && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-400 text-gray-600 rounded-md hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
              >
                + Add Task
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Task Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">{todoTasks.length}</div>
          <div className="text-sm text-gray-600">Tasks to do</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">{inProgressTasks.length}</div>
          <div className="text-sm text-gray-600">In progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{doneTasks.length}</div>
          <div className="text-sm text-gray-600">Completed</div>
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