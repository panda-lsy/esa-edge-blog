'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface HeroSectionProps {
  title?: string
  subtitle?: string
}

export function HeroSection({
  title = '欢迎来到我的博客',
  subtitle = '基于边缘计算的现代化个人博客平台',
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!containerRef.current || !titleRef.current || !subtitleRef.current)
      return

    const tl = gsap.timeline()

    tl.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })
      .from(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.5'
      )
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-primary-500 to-purple-600 overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          {title}
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
        >
          {subtitle}
        </p>
      </div>
    </div>
  )
}
