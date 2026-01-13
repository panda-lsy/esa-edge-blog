'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '../AdminLayout'

interface DashboardStats {
  posts: {
    total: number
    published: number
    draft: number
  }
  comments: {
    total: number
    pending: number
    approved: number
    spam: number
  }
  stats: {
    totalViews: number
    totalPosts: number
    totalComments: number
    lastUpdated: string
  }
  recentPosts: any[]
  recentComments: any[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json() as { success: boolean; data?: DashboardStats; error?: string }

      if (data.success && data.data) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </AdminLayout>
    )
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">加载失败</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            仪表板
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            欢迎回来，这里是您的博客数据概览
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">总文章数</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.posts.total}
                </p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">已发布</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {stats.posts.published}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">草稿</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                  {stats.posts.draft}
                </p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">总阅读量</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                  {stats.stats.totalViews}
                </p>
              </div>
              <div className="text-4xl">👁️</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              最新文章
            </h2>
            <div className="space-y-4">
              {stats.recentPosts.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  暂无文章
                </p>
              ) : (
                stats.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {post.status === 'published' ? '已发布' : '草稿'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl">👁️</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {post.views}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              评论统计
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.comments.total}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  总评论
                </p>
              </div>

              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.comments.pending}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  待审核
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.comments.approved}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  已通过
                </p>
              </div>

              <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {stats.comments.spam}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  垃圾评论
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            快捷操作
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/posts/new"
              className="flex items-center justify-center p-6 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors text-primary-600 dark:text-primary-400 font-medium"
            >
              <span className="text-2xl mr-2">➕</span>
              创建新文章
            </a>
            <a
              href="/admin/comments"
              className="flex items-center justify-center p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors text-yellow-600 dark:text-yellow-400 font-medium"
            >
              <span className="text-2xl mr-2">💬</span>
              管理评论
            </a>
            <a
              href="/admin/settings"
              className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 font-medium"
            >
              <span className="text-2xl mr-2">⚙️</span>
              网站设置
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
