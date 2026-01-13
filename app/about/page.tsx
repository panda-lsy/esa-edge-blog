'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'

export default function AboutPage() {
  useEffect(() => {
    gsap.from('.about-section', {
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })

    gsap.from('.skill-item', {
      scrollTrigger: {
        trigger: '.skill-item',
        start: 'top 90%',
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    })
  }, [])

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="about-section mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            关于我
          </h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              你好！我是一名热爱技术的全栈开发者，专注于构建高性能、可扩展的 Web
              应用。
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              这个博客是基于阿里云 ESA Pages
              构建的现代化个人博客平台。我相信技术的力量，也相信分享的价值。在这里，我会分享我的学习心得、项目经验和技术见解。
            </p>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            技能专长
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="skill-item bg-white dark:bg-dark-700 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                前端开发
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• React / Next.js</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• GSAP 动画</li>
              </ul>
            </div>

            <div className="skill-item bg-white dark:bg-dark-700 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                后端开发
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Node.js</li>
                <li>• API 设计</li>
                <li>• 数据库优化</li>
                <li>• 边缘计算</li>
              </ul>
            </div>

            <div className="skill-item bg-white dark:bg-dark-700 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                DevOps
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• CI/CD 流程</li>
                <li>• 容器化部署</li>
                <li>• 性能监控</li>
                <li>• 缓存策略</li>
              </ul>
            </div>

            <div className="skill-item bg-white dark:bg-dark-700 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                设计与优化
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• UI/UX 设计</li>
                <li>• 性能优化</li>
                <li>• SEO 优化</li>
                <li>• 响应式设计</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            联系我
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="skill-item bg-white dark:bg-dark-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-center"
            >
              <div className="text-4xl mb-3">🐙</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                GitHub
              </h3>
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="skill-item bg-white dark:bg-dark-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-center"
            >
              <div className="text-4xl mb-3">🐦</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Twitter
              </h3>
            </a>

            <a
              href="mailto:your-email@example.com"
              className="skill-item bg-white dark:bg-dark-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-center"
            >
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Email
              </h3>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
