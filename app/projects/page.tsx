'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl?: string
  githubUrl?: string
}

export default function ProjectsPage() {
  const projects: Project[] = [
    {
      id: '1',
      title: 'ESA Blog',
      description:
        '基于阿里云 ESA Pages 的现代化个人博客平台，使用边缘计算和 KV 存储，实现全球加速和极致性能。',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
      tags: ['Next.js', 'TypeScript', 'ESA Pages', 'KV Storage', 'GSAP'],
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.com',
    },
    {
      id: '2',
      title: '动画展示平台',
      description:
        '使用 GSAP 和 Three.js 构建的 3D 动画展示平台，展示最新的 Web 动画技术和交互设计。',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
      tags: ['GSAP', 'Three.js', 'React', 'WebGL'],
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.com',
    },
    {
      id: '3',
      title: '边缘函数工具集',
      description:
        '一套实用的边缘函数工具集，包括 API 网关、缓存策略、请求路由等功能。',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
      tags: ['Edge Functions', 'JavaScript', 'API', 'Caching'],
      githubUrl: 'https://github.com',
    },
    {
      id: '4',
      title: '性能监控面板',
      description:
        '实时监控 Web 应用性能数据的仪表板，支持 Core Web Vitals 和自定义指标追踪。',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
      tags: ['Analytics', 'Performance', 'Dashboard', 'Real-time'],
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.com',
    },
    {
      id: '5',
      title: '组件库项目',
      description:
        '一套可复用的 React 组件库，遵循最新的设计规范和最佳实践。',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
      tags: ['React', 'Components', 'Design System', 'TypeScript'],
      githubUrl: 'https://github.com',
    },
    {
      id: '6',
      title: 'AI 助手集成',
      description:
        '将 AI 助手集成到 Web 应用中，实现智能问答和内容生成功能。',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
      tags: ['AI', 'ChatGPT', 'Integration', 'React'],
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.com',
    },
  ]

  useEffect(() => {
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.project-card',
        start: 'top 90%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    })
  }, [])

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            项目展示
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            这里展示了我的一些个人项目和开源作品。每个项目都倾注了心血和热情。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card bg-white dark:bg-dark-700 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                    >
                      查看演示
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
