export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-dark-800 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ESA Blog
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              基于阿里云 ESA Pages 的现代化边缘博客平台，全球加速，极致性能。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              快速链接
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  首页
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  博客
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  关于
                </a>
              </li>
              <li>
                <a
                  href="/projects"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  项目
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              技术栈
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Next.js 14+</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>GSAP</li>
              <li>ESA Pages + KV Storage</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} ESA Blog. All rights reserved.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 md:mt-0">
              本项目由
              <a
                href="https://www.aliyun.com/product/esa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline ml-1"
              >
                阿里云ESA
              </a>
              提供加速、计算和保护
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
