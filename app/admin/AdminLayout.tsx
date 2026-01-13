'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Admin } from '../lib/admin-types'

export function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json() as { success: boolean; data?: { admin: Admin }; error?: string }

      if (data.success && data.data?.admin) {
        setAdmin(data.data.admin)
      } else {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_info')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin/login')
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }

    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    router.push('/admin/login')
  }

  const navigation = [
    { name: '仪表板', href: '/admin/dashboard', icon: '📊' },
    { name: '文章管理', href: '/admin/posts', icon: '📝' },
    { name: '评论管理', href: '/admin/comments', icon: '💬' },
    { name: '设置', href: '/admin/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-900">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                管理后台
              </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:pl-6 hover:shadow-md"
                >
                  <span className="text-xl mr-3 transition-transform duration-300 hover:scale-110">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300 hover:pl-6 hover:shadow-md"
              >
                <span className="text-xl mr-3 transition-transform duration-300 hover:rotate-12">🚪</span>
                退出登录
              </button>
              <Link
                href="/"
                className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:pl-6 hover:shadow-md mt-2"
              >
                <span className="text-xl mr-3 transition-transform duration-300 hover:scale-110">🏠</span>
                返回网站
              </Link>
            </div>
          </div>
        </aside>

        <main
          className={`flex-1 lg:ml-64 transition-all duration-300 ${
            sidebarOpen ? 'ml-0' : 'ml-0'
          }`}
        >
          <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-2xl">{sidebarOpen ? '✕' : '☰'}</span>
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                欢迎, {admin?.username}
              </span>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                {admin?.username?.[0]?.toUpperCase()}
              </div>
            </div>
          </header>

          <div className="p-6 transition-opacity duration-300">{children}</div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
