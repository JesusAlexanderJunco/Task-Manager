'use client'

import { useState } from 'react'
import { Comment } from './Comment'
import { CommentForm } from './CommentForm'

interface CommentListProps {
  taskId: string
  comments?: Array<{
    id: string
    content: string
    createdAt: Date
    author: {
      id: string
      name: string
      email: string
    }
  }>
  isLoading?: boolean
  onRefresh?: () => void
}

export function CommentList({ taskId, comments = [], isLoading, onRefresh }: CommentListProps) {
  const [showForm, setShowForm] = useState(false)

  const handleCommentAdded = () => {
    setShowForm(false)
    onRefresh?.()
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">Comments</h4>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">
          Comments ({comments.length})
        </h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showForm ? 'Cancel' : 'Add Comment'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-3 rounded-md">
          <CommentForm
            taskId={taskId}
            onCommentAdded={handleCommentAdded}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">No comments yet.</p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-blue-600 hover:text-blue-800 mt-1"
            >
              Be the first to comment
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-0">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}