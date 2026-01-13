import type { BlogPost, Comment, SiteStats, ApiResponse } from './types'
import type { KVNamespace } from '@cloudflare/workers-types'

export class EdgeStorage {
  private kv: KVNamespace

  constructor(kv: KVNamespace) {
    this.kv = kv
  }

  private getPostKey(id: string): string {
    return `post:${id}`
  }

  private getCommentKey(id: string): string {
    return `comment:${id}`
  }

  private getPostCommentsKey(postId: string): string {
    return `post_comments:${postId}`
  }

  private getStatsKey(): string {
    return 'site_stats'
  }

  private getPostViewsKey(postId: string): string {
    return `post_views:${postId}`
  }

  async savePost(post: BlogPost): Promise<ApiResponse<BlogPost>> {
    try {
      await this.kv.put(this.getPostKey(post.id), JSON.stringify(post), {
        metadata: {
          title: post.title,
          slug: post.slug,
          publishedAt: post.publishedAt,
          tags: post.tags.join(','),
          category: post.category,
        },
      })

      return {
        success: true,
        data: post,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save post',
      }
    }
  }

  async getPost(id: string): Promise<ApiResponse<BlogPost>> {
    try {
      const data = await this.kv.get(this.getPostKey(id), { type: 'json' })
      if (!data) {
        return {
          success: false,
          error: 'Post not found',
        }
      }

      return {
        success: true,
        data: data as BlogPost,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get post',
      }
    }
  }

  async getPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    try {
      const list = await this.kv.list({
        prefix: 'post:',
      })

      for (const key of list.keys) {
        const post = await this.kv.get(key.name, { type: 'json' })
        if (post && (post as BlogPost).slug === slug) {
          return {
            success: true,
            data: post as BlogPost,
          }
        }
      }

      return {
        success: false,
        error: 'Post not found',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get post',
      }
    }
  }

  async getAllPosts(filter?: {
    status?: 'draft' | 'published'
    category?: string
    tag?: string
  }): Promise<ApiResponse<BlogPost[]>> {
    try {
      const list = await this.kv.list({
        prefix: 'post:',
      })

      const posts: BlogPost[] = []
      for (const key of list.keys) {
        const post = await this.kv.get(key.name, { type: 'json' })
        if (post) {
          const postData = post as BlogPost

          if (filter?.status && postData.status !== filter.status) {
            continue
          }

          if (filter?.category && postData.category !== filter.category) {
            continue
          }

          if (filter?.tag && !postData.tags.includes(filter.tag)) {
            continue
          }

          posts.push(postData)
        }
      }

      posts.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )

      return {
        success: true,
        data: posts,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get posts',
      }
    }
  }

  async deletePost(id: string): Promise<ApiResponse<void>> {
    try {
      await this.kv.delete(this.getPostKey(id))
      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete post',
      }
    }
  }

  async incrementPostViews(postId: string): Promise<ApiResponse<number>> {
    try {
      const key = this.getPostViewsKey(postId)
      const currentViews = await this.kv.get(key, { type: 'json' })
      const newViews = ((currentViews as number) || 0) + 1

      await this.kv.put(key, JSON.stringify(newViews))

      return {
        success: true,
        data: newViews,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to increment views',
      }
    }
  }

  async getPostViews(postId: string): Promise<ApiResponse<number>> {
    try {
      const key = this.getPostViewsKey(postId)
      const views = await this.kv.get(key, { type: 'json' })

      return {
        success: true,
        data: (views as number) || 0,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get views',
      }
    }
  }

  async saveComment(comment: Comment): Promise<ApiResponse<Comment>> {
    try {
      await this.kv.put(this.getCommentKey(comment.id), JSON.stringify(comment))

      const postCommentsKey = this.getPostCommentsKey(comment.postId)
      const currentComments = await this.kv.get(postCommentsKey, { type: 'json' })
      const commentIds: string[] = (currentComments as string[]) || []

      commentIds.push(comment.id)
      await this.kv.put(postCommentsKey, JSON.stringify(commentIds))

      return {
        success: true,
        data: comment,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save comment',
      }
    }
  }

  async getComment(id: string): Promise<ApiResponse<Comment>> {
    try {
      const data = await this.kv.get(this.getCommentKey(id), { type: 'json' })
      if (!data) {
        return {
          success: false,
          error: 'Comment not found',
        }
      }

      return {
        success: true,
        data: data as Comment,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get comment',
      }
    }
  }

  async getCommentsByPost(
    postId: string,
    status?: 'pending' | 'approved' | 'spam'
  ): Promise<ApiResponse<Comment[]>> {
    try {
      const postCommentsKey = this.getPostCommentsKey(postId)
      const commentIds = await this.kv.get(postCommentsKey, { type: 'json' })

      if (!commentIds) {
        return {
          success: true,
          data: [],
        }
      }

      const comments: Comment[] = []
      for (const id of commentIds as string[]) {
        const comment = await this.getComment(id)
        if (comment.success && comment.data) {
          if (status && comment.data.status !== status) {
            continue
          }
          comments.push(comment.data)
        }
      }

      comments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      return {
        success: true,
        data: comments,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get comments',
      }
    }
  }

  async getAllComments(
    options?: { status?: 'pending' | 'approved' | 'spam' }
  ): Promise<ApiResponse<Comment[]>> {
    try {
      const list = await this.kv.list({
        prefix: 'comment:',
      })

      const comments: Comment[] = []
      for (const key of list.keys) {
        const comment = await this.getComment(key.name.replace('comment:', ''))
        if (comment.success && comment.data) {
          if (options?.status && comment.data.status !== options.status) {
            continue
          }
          comments.push(comment.data)
        }
      }

      comments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      return {
        success: true,
        data: comments,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get all comments',
      }
    }
  }

  async updateSiteStats(updates: Partial<SiteStats>): Promise<ApiResponse<SiteStats>> {
    try {
      const currentStats = await this.kv.get(this.getStatsKey(), { type: 'json' })
      const stats: SiteStats = {
        ...(currentStats as SiteStats),
        totalViews: 0,
        totalPosts: 0,
        totalComments: 0,
        lastUpdated: new Date().toISOString(),
        ...updates,
      }

      await this.kv.put(this.getStatsKey(), JSON.stringify(stats))

      return {
        success: true,
        data: stats,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update stats',
      }
    }
  }

  async getSiteStats(): Promise<ApiResponse<SiteStats>> {
    try {
      const stats = await this.kv.get(this.getStatsKey(), { type: 'json' })

      return {
        success: true,
        data: (stats as SiteStats) || {
          totalViews: 0,
          totalPosts: 0,
          totalComments: 0,
          lastUpdated: new Date().toISOString(),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get stats',
      }
    }
  }
}
