export interface Platform {
  signature: string
  url: string
}

export interface Version {
  version: string
  notes: string
  pub_date: string // ISO 8601 format (ex: "2024-05-17T12:00:00Z")
  platforms: Record<string, Platform>
  type: string
  changes: string[]
  createdAt: string
}

export interface ApplicationVersion {
  id: string
  actualServerVersion: string
  latestDesktopVersion: Version
  minDesktopVersion: Version
  createdAt: string // ISO 8601 format
}
