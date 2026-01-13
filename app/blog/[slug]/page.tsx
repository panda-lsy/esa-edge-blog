'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BlogPostCard } from '../../components/blog/BlogPostCard'
import type { BlogPost } from '../../lib/types'

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchPost()
    }
  }, [params.slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/slug/${params.slug}`)
      const data = (await response.json()) as {
        success: boolean
        data?: BlogPost
      }

      if (data.success && data.data) {
        setPost(data.data)
        fetchRelatedPosts(data.data)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (currentPost: BlogPost) => {
    try {
      const response = await fetch('/api/posts?status=published')
      const data = (await response.json()) as { success: boolean; data?: BlogPost[] }

      if (data.success && data.data) {
        const related = data.data
          .filter(
            (p) =>
              p.id !== currentPost.id &&
              (p.category === currentPost.category ||
                p.tags.some((tag) => currentPost.tags.includes(tag)))
          )
          .slice(0, 3)
        setRelatedPosts(related)
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            文章未找到
          </h1>
          <Link
            href="/blog"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            返回博客列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-6"
          >
            ← 返回博客
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">
              {post.category}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 mb-8">
            <div className="flex items-center gap-4">
              <span>👤 {post.author}</span>
              <span>👁️ {post.views} 阅读</span>
            </div>
            <time>
              {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          {post.coverImage && (
            <div className="aspect-video rounded-lg overflow-hidden mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              相关文章
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post, index) => (
                <BlogPostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
