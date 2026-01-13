export interface Admin {
  id: string
  username: string
  email: string
  password: string
  role: 'admin' | 'editor'
  createdAt: string
}

export interface AuthSession {
  token: string
  adminId: string
  expiresAt: string
}
