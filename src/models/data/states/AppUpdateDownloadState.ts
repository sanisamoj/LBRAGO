export interface AppUpdateDownloadState {
  isActive: boolean
  progress: number // 0-100
  status: AppUpdateDownloadStatus
  message: string
  error?: string
}

export type AppUpdateDownloadStatus = 'idle' | 'checking' | 'downloading' | 'installing' | 'error' | 'completed_relaunching'