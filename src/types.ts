export interface Vault {
  id: string
  name: string
  description: string
  imageUrl: string
  accessLevel: "Read" | "Admin" | "Write"
}

export interface Password {
  id: string
  vaultId: string
  name: string
  description: string
  icon: string
  iconBg: string
  url?: string
  username?: string
  password?: string
  notes?: string
  addedAt: string
  updatedAt: string
  accessIndicator?: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Environment {
  id: string
  name: string
  icon: string
  iconBg: string
  customImage?: string
  userEmail: string
  userName: string
  userPassword: string
  createdAt: string
  updatedAt: string
}
