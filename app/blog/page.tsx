'use client'

import { useEffect, useState } from 'react'
import { BlogPostCard } from '../components/blog/BlogPostCard'
import type { BlogPost } from '../lib/types'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedTag, setSelectedTag] = useState<string>('')

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchTerm, selectedCategory, selectedTag])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?status=published')
      const data = (await response.json()) as { success: boolean; data?: BlogPost[] }

      if (data.success) {
        setPosts(data.data || [])
        setFilteredPosts(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag))
    }

    setFilteredPosts(filtered)
  }

  const categories = ['All', ...new Set(posts.map((post) => post.category))]
  const allTags = [...new Set(posts.flatMap((post) => post.tags))]

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            博客文章
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            探索技术、分享见解、记录成长
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? '所有分类' : cat}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2">
              {selectedTag ? (
                <button
                  onClick={() => setSelectedTag('')}
                  className="px-3 py-1 rounded-full bg-primary-600 text-white text-sm"
                >
                  {selectedTag} ✕
                </button>
              ) : (
                allTags.slice(0, 5).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    #{tag}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              没有找到相关文章
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
