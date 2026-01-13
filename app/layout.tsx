import type { Metadata } from 'next'
import './styles/globals.css'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'

export const metadata: Metadata = {
  title: 'ESA Blog - 现代化边缘博客平台',
  description: '基于阿里云 ESA Pages 的现代化个人博客，全球加速，极致性能',
  keywords: ['blog', 'ESA', 'Next.js', '边缘计算', '个人博客'],
  authors: [{ name: 'ESA Blog Author' }],
  openGraph: {
    title: 'ESA Blog - 现代化边缘博客平台',
    description: '基于阿里云 ESA Pages 的现代化个人博客',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
