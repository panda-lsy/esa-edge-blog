'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '../../../AdminLayout'
import type { BlogPost } from '../../../../lib/types'

export default function AdminPostEditPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: 'Admin',
    category: '技术',
    tags: [] as string[],
    status: 'draft' as 'published' | 'draft',
    coverImage: '',
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json() as { success: boolean; data?: BlogPost; error?: string }

      if (data.success && data.data) {
        setFormData({
          title: data.data.title,
          slug: data.data.slug,
          content: data.data.content,
          excerpt: data.data.excerpt,
          author: data.data.author,
          category: data.data.category,
          tags: data.data.tags,
          status: data.data.status,
          coverImage: data.data.coverImage || '',
        })
      } else {
        alert('文章不存在或加载失败')
        router.push('/admin/posts')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      router.push('/admin/posts')
    } finally {
      setFetching(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSlugChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      })

      const data = await response.json() as { success: boolean; data?: { url: string }; error?: string }

      if (data.success && data.data) {
        setFormData((prev) => ({ ...prev, coverImage: data.data!.url }))
      } else {
        alert(data.error || '上传失败')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('上传失败')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          excerpt:
            formData.excerpt || formData.content.substring(0, 200) + '...',
        }),
      })

      const data = await response.json() as { success: boolean; error?: string }

      if (data.success) {
        router.push('/admin/posts')
      } else {
        alert(data.error || '更新失败')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('更新失败')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            编辑文章
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            编辑文章内容和元数据
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  文章标题 *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onBlur={(e) => handleSlugChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL 别名 *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    分类
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="技术">技术</option>
                    <option value="生活">生活</option>
                    <option value="随笔">随笔</option>
                    <option value="教程">教程</option>
                    <option value="其他">其他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    状态
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="draft">草稿</option>
                    <option value="published">发布</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  标签
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="输入标签后按回车"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  封面图片
                </label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                    <label className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg cursor-pointer transition-colors">
                      {uploading ? '上传中...' : '上传图片'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.coverImage && (
                    <div className="relative w-full h-48">
                      <img
                        src={formData.coverImage}
                        alt="封面预览"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
                        className="absolute top-2 right-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  文章摘要
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="文章摘要（可选，留空自动生成）"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              文章内容 *
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              支持 Markdown 语法
            </p>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={20}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
