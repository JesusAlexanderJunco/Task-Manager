'use client'

import { useState } from 'react'
import { apiRouter } from '@/lib/trpc'
import { News_Cycle } from 'next/font/google'
import { error } from 'console'

type Task = {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: Date | null
  assignee: {
    id: string
    name: string
    email: string
  }
}

type TaskCardProps = {
  task: Task
  onUpdate: () => void
  onDelete: (taskId: string) => void
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-blue-100 text-blue-800 border-blue-200', 
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  URGENT: 'bg-red-100 text-red-800 border-red-200'
}

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800', 
  DONE: 'bg-green-100 text-green-800'
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDescription, setEditedDescription] = useState(task.description || '')

  const updateTaskMutation = apiRouter.tasks.update.useMutation({
    onSuccess: () => {
      onUpdate()
      setIsEditing(false)
    }
  })

  const handleStatusChange = (oldStatus: any, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    if (newStatus == 'TODO' || oldStatus == 'DONE') {
      console.log('The task is in progress and cannot be revered to Todo')
    }
    else{ 
    console.log(oldStatus)
    updateTaskMutation.mutate({
      id: task.id,
      status: newStatus
    })}
  }

  const handlePriorityChange = (newPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') => {
    updateTaskMutation.mutate({
      id: task.id,
      priority: newPriority
    })
  }

  const handleSaveEdit = () => {
    updateTaskMutation.mutate({
      id: task.id,
      title: editedTitle,
      description: editedDescription
    })
  }

  const handleCancelEdit = () => {
    setEditedTitle(task.title)
    setEditedDescription(task.description || '')
    setIsEditing(false)
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
      {/* Priority and Status badges */}
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {/* Title and Description */}
      {isEditing ? (
        <div className="space-y-2 mb-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Task title"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Task description"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={updateTaskMutation.isPending}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600">{task.description}</p>
          )}
        </div>
      )}

      {/* Assignee */}
      <p className="text-xs text-gray-500 mb-3">
        Assigned to: {task.assignee.name}
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Status controls */}
        <div className="flex gap-1">
          <button
            onClick={() => handleStatusChange(task.status, 'TODO')}
            disabled={task.status === 'TODO' || updateTaskMutation.isPending}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Todo
          </button>
          <button
            onClick={() => handleStatusChange(task.status, 'IN_PROGRESS')}
            disabled={task.status === 'IN_PROGRESS' || updateTaskMutation.isPending}
            className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusChange(task.status, 'DONE')}
            disabled={task.status === 'DONE' || updateTaskMutation.isPending}
            className="px-2 py-1 text-xs bg-green-200 text-green-800 rounded hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Done
          </button>
        </div>

        {/* Priority controls */}
        <select
          value={task.priority}
          onChange={(e) => handlePriorityChange(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
          disabled={updateTaskMutation.isPending}
          className="px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        {/* Edit/Delete buttons */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  )
}