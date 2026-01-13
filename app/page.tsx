'use client'

import { useEffect, useState } from 'react'
import { HeroSection } from './components/ui/HeroSection'
import { BlogPostCard } from './components/blog/BlogPostCard'
import type { BlogPost } from './lib/types'

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?status=published')
      const data = (await response.json()) as { success: boolean; data?: BlogPost[] }

      if (data.success) {
        setPosts(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <HeroSection
        title="欢迎来到 ESA Blog"
        subtitle="基于边缘计算的现代化个人博客平台"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            最新文章
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            探索技术、分享见解、记录成长
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              暂无文章，敬请期待！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
