'use client'

import { useState } from 'react'
import { AdminLayout } from '../AdminLayout'

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    siteName: 'ESA Blog',
    siteDescription: '基于边缘计算的现代化博客平台',
    authorName: 'Admin',
    authorEmail: 'admin@example.com',
    postsPerPage: '10',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json() as { success: boolean; error?: string }

      if (data.success) {
        alert('设置已保存')
      } else {
        alert(data.error || '保存失败')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('保存失败')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            网站设置
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            配置您的博客基本信息
          </p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                网站名称
              </label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                网站描述
              </label>
              <textarea
                name="siteDescription"
                value={formData.siteDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  作者名称
                </label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  作者邮箱
                </label>
                <input
                  type="email"
                  name="authorEmail"
                  value={formData.authorEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                每页文章数
              </label>
              <select
                name="postsPerPage"
                value={formData.postsPerPage}
                onChange={handleSelectChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="6">6 篇</option>
                <option value="10">10 篇</option>
                <option value="15">15 篇</option>
                <option value="20">20 篇</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                保存设置
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            其他操作
          </h2>
          <div className="space-y-4">
            <a
              href="/"
              target="_blank"
              className="block px-6 py-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors text-primary-600 dark:text-primary-400 font-medium"
            >
              🌐 查看网站
            </a>
            <button className="w-full px-6 py-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors text-yellow-600 dark:text-yellow-400 font-medium">
              🔄 清除缓存
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
