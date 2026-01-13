export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
  coverImage?: string;
  views: number;
  status: 'draft' | 'published';
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'spam';
}

export interface SiteStats {
  totalViews: number;
  totalPosts: number;
  totalComments: number;
  lastUpdated: string;
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  darkMode: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

declare global {
  interface Window {
    BLOG_KV?: import('@cloudflare/workers-types').KVNamespace;
  }
}
