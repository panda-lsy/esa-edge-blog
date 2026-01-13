import type { Admin, AuthSession } from './admin-types'
import type { KVNamespace } from '@cloudflare/workers-types'

export class AdminStorage {
  private kv: KVNamespace

  constructor(kv: KVNamespace) {
    this.kv = kv
  }

  private getAdminKey(id: string): string {
    return `admin:${id}`
  }

  private getAdminByUsernameKey(username: string): string {
    return `admin_username:${username}`
  }

  private getSessionKey(token: string): string {
    return `session:${token}`
  }

  async createAdmin(admin: Admin): Promise<Admin | null> {
    try {
      await this.kv.put(this.getAdminKey(admin.id), JSON.stringify(admin))
      await this.kv.put(this.getAdminByUsernameKey(admin.username), admin.id)
      return admin
    } catch (error) {
      console.error('Error creating admin:', error)
      return null
    }
  }

  async getAdminById(id: string): Promise<Admin | null> {
    try {
      const data = await this.kv.get(this.getAdminKey(id), { type: 'json' })
      return data as Admin | null
    } catch (error) {
      console.error('Error getting admin by id:', error)
      return null
    }
  }

  async getAdminByUsername(username: string): Promise<Admin | null> {
    try {
      const adminId = await this.kv.get(
        this.getAdminByUsernameKey(username),
        { type: 'text' }
      )

      if (!adminId) return null

      return this.getAdminById(adminId)
    } catch (error) {
      console.error('Error getting admin by username:', error)
      return null
    }
  }

  async verifyAdmin(username: string, password: string): Promise<Admin | null> {
    try {
      const admin = await this.getAdminByUsername(username)

      if (!admin || admin.password !== password) {
        return null
      }

      return admin
    } catch (error) {
      console.error('Error verifying admin:', error)
      return null
    }
  }

  async createSession(session: AuthSession): Promise<void> {
    try {
      await this.kv.put(this.getSessionKey(session.token), JSON.stringify(session))
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  async getSession(token: string): Promise<AuthSession | null> {
    try {
      const data = await this.kv.get(this.getSessionKey(token), {
        type: 'json',
      })

      if (!data) return null

      const session = data as AuthSession

      if (new Date(session.expiresAt) < new Date()) {
        await this.deleteSession(token)
        return null
      }

      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  async deleteSession(token: string): Promise<void> {
    try {
      await this.kv.delete(this.getSessionKey(token))
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  async getAllAdmins(): Promise<Admin[]> {
    try {
      const list = await this.kv.list({ prefix: 'admin:' })
      const admins: Admin[] = []

      for (const key of list.keys) {
        if (!key.name.startsWith('admin_username:')) {
          const data = await this.kv.get(key.name, { type: 'json' })
          if (data) {
            admins.push(data as Admin)
          }
        }
      }

      return admins
    } catch (error) {
      console.error('Error getting all admins:', error)
      return []
    }
  }

  async updateAdmin(id: string, updates: Partial<Admin>): Promise<Admin | null> {
    try {
      const admin = await this.getAdminById(id)
      if (!admin) return null

      const updatedAdmin = { ...admin, ...updates }
      await this.kv.put(this.getAdminKey(id), JSON.stringify(updatedAdmin))

      if (updates.username && updates.username !== admin.username) {
        await this.kv.delete(this.getAdminByUsernameKey(admin.username))
        await this.kv.put(
          this.getAdminByUsernameKey(updates.username),
          updatedAdmin.id
        )
      }

      return updatedAdmin
    } catch (error) {
      console.error('Error updating admin:', error)
      return null
    }
  }

  async deleteAdmin(id: string): Promise<boolean> {
    try {
      const admin = await this.getAdminById(id)
      if (!admin) return false

      await this.kv.delete(this.getAdminKey(id))
      await this.kv.delete(this.getAdminByUsernameKey(admin.username))

      return true
    } catch (error) {
      console.error('Error deleting admin:', error)
      return false
    }
  }

  async createDefaultAdmin(): Promise<void> {
    const existingAdmin = await this.getAdminByUsername('admin')
    if (existingAdmin) return

    const defaultAdmin: Admin = {
      id: 'admin_default',
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    }

    await this.createAdmin(defaultAdmin)
    console.log('Default admin created')
  }
}
