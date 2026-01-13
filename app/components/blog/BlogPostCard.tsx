'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import type { BlogPost } from '../../lib/types'

gsap.registerPlugin(ScrollTrigger)

interface BlogPostCardProps {
  post: BlogPost
  index: number
}

export function BlogPostCard({ post, index }: BlogPostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return

    gsap.from(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power3.out',
    })
  }, [index])

  return (
    <div
      ref={cardRef}
      className="bg-white dark:bg-dark-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`}>
          <div className="aspect-video overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full">
            {post.category}
          </span>
          {post.tags.slice(0, 2).map((tag: string) => (
            <span
              key={tag}
              className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>👁️ {post.views} 阅读</span>
            <span>👤 {post.author}</span>
          </div>
          <time>
            {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        </div>
      </div>
    </div>
  )
}
