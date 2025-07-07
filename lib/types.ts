export interface PhotoData {
  id: number
  thumbnail: string
  date: string
  timestamp: number
  model: string
  count: number
  workerId: string
  status: 'success' | 'error'
  errorReason?: string
  confidenceScore?: number
  metadata?: {
    fileSize?: number
    resolution?: string
    location?: string
  }
}

export interface ModelUsageStats {
  model: string
  count: number
  lastUsed: string
}

export interface DashboardStats {
  dailyPhotoCount: number
  totalPhotoCount: number
  errorRate: number
  modelUsageStats: ModelUsageStats[]
}

export interface Worker {
  id: string
  name?: string
  lastActive: string
  totalPhotos: number
}

export interface CSVExportData {
  workerId: string
  timestamp: string
  date: string
  photoId: number
  modelUsed: string
  countResult: number
  confidenceScore: number
  status: string
  errorReason?: string
  fileSize?: number
  resolution?: string
  location?: string
}
