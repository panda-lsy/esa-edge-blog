'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '../AdminLayout'

interface Comment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  createdAt: string
  status: 'pending' | 'approved' | 'spam'
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('all')

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch('/api/comments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json() as { success: boolean; data?: Comment[]; error?: string }

      if (data.success) {
        setComments(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json() as { success: boolean; error?: string }

      if (data.success) {
        setComments(comments.map((c) => (c.id === id ? { ...c, status: 'approved' } : c)))
      }
    } catch (error) {
      console.error('Error approving comment:', error)
      alert('操作失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条评论吗？')) return

    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json() as { success: boolean; error?: string }

      if (data.success) {
        setComments(comments.filter((c) => c.id !== id))
      } else {
        alert(data.error || '删除失败')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('删除失败')
    }
  }

  const handleMarkSpam = async (id: string) => {
    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'spam' }),
      })

      const data = await response.json() as { success: boolean; error?: string }

      if (data.success) {
        setComments(comments.map((c) => (c.id === id ? { ...c, status: 'spam' } : c)))
      }
    } catch (error) {
      console.error('Error marking comment as spam:', error)
      alert('操作失败')
    }
  }

  const filteredComments = comments.filter((comment) => {
    if (filter !== 'all' && comment.status !== filter) return false
    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            评论管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            审核和管理所有博客评论
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="all">全部评论</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="spam">垃圾评论</option>
          </select>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">总计: {comments.length}</span>
            <span className="font-medium text-yellow-600 dark:text-yellow-400">
              待审核: {comments.filter((c) => c.status === 'pending').length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-800 rounded-lg shadow-lg">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              暂无评论
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          comment.status === 'approved'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : comment.status === 'spam'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        {comment.status === 'approved'
                          ? '已通过'
                          : comment.status === 'spam'
                            ? '垃圾'
                          : '待审核'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleString('zh-CN')}
                      </span>
                    </div>

                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {comment.author}
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        ({comment.email})
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                  </div>

                  <div className="flex gap-2">
                    {comment.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                      >
                        通过
                      </button>
                    )}
                    <button
                      onClick={() => handleMarkSpam(comment.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                    >
                      垃圾
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                  文章 ID: {comment.postId}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
