import { PhotoData, ModelUsageStats, DashboardStats, Worker, CSVExportData } from './types'

// LocalStorage keys
const WORKER_ID_KEY = 'countai_worker_id'
const WORKER_NAME_KEY = 'countai_worker_name'

// Worker authentication service
export class WorkerAuthService {
  static getWorkerId(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(WORKER_ID_KEY)
  }

  static getWorkerName(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(WORKER_NAME_KEY)
  }

  static setWorker(workerId: string, workerName?: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(WORKER_ID_KEY, workerId)
    if (workerName) {
      localStorage.setItem(WORKER_NAME_KEY, workerName)
    }
  }

  static clearWorker(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(WORKER_ID_KEY)
    localStorage.removeItem(WORKER_NAME_KEY)
  }

  static isAuthenticated(): boolean {
    return this.getWorkerId() !== null
  }
}

// Mock data service (replace with actual Azure DB calls)
export class DataService {
  // Mock data - replace with actual Azure database queries
  static async getPhotos(): Promise<PhotoData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return [
      {
        id: 1,
        thumbnail: '/placeholder.svg?height=200&width=300',
        date: '2025-07-07 14:30',
        timestamp: Date.now() - 7200000,
        model: 'Round Type',
        count: 24,
        workerId: '12345',
        status: 'success',
        confidenceScore: 0.95,
        metadata: {
          fileSize: 2048000,
          resolution: '1920x1080',
          location: 'Station A'
        }
      },
      {
        id: 2,
        thumbnail: '/placeholder.svg?height=200&width=300',
        date: '2025-07-07 14:25',
        timestamp: Date.now() - 7500000,
        model: 'Plate Type',
        count: 18,
        workerId: '23456',
        status: 'success',
        confidenceScore: 0.89,
        metadata: {
          fileSize: 1856000,
          resolution: '1920x1080',
          location: 'Station B'
        }
      },
      {
        id: 3,
        thumbnail: '/placeholder.svg?height=200&width=300',
        date: '2025-07-07 14:20',
        timestamp: Date.now() - 7800000,
        model: 'ND Press',
        count: 32,
        workerId: '12345',
        status: 'success',
        confidenceScore: 0.92,
        metadata: {
          fileSize: 2204000,
          resolution: '1920x1080',
          location: 'Station A'
        }
      },
      {
        id: 4,
        thumbnail: '/placeholder.svg?height=200&width=300',
        date: '2025-07-07 14:15',
        timestamp: Date.now() - 8100000,
        model: 'Baseboard',
        count: 12,
        workerId: '34567',
        status: 'success',
        confidenceScore: 0.87,
        metadata: {
          fileSize: 1945000,
          resolution: '1920x1080',
          location: 'Station C'
        }
      },
      {
        id: 5,
        thumbnail: '/placeholder.svg?height=200&width=300',
        date: '2025-07-07 13:55',
        timestamp: Date.now() - 9300000,
        model: 'Aluminum Stairs',
        count: 0,
        workerId: '23456',
        status: 'error',
        errorReason: 'Image is blurry',
        confidenceScore: 0.23,
        metadata: {
          fileSize: 1654000,
          resolution: '1920x1080',
          location: 'Station B'
        }
      },
      // Add more mock data with today's date
      ...Array.from({ length: 15 }, (_, i) => ({
        id: i + 10,
        thumbnail: '/placeholder.svg?height=200&width=300',
        date: new Date(Date.now() - (i * 600000)).toISOString().slice(0, 16).replace('T', ' '),
        timestamp: Date.now() - (i * 600000),
        model: ['Round Type', 'Plate Type', 'ND Press', 'Baseboard', 'Aluminum Stairs'][i % 5],
        count: Math.floor(Math.random() * 40) + 1,
        workerId: ['12345', '23456', '34567', '45678'][i % 4],
        status: Math.random() > 0.1 ? 'success' : 'error' as 'success' | 'error',
        confidenceScore: Math.random() * 0.4 + 0.6,
        errorReason: Math.random() > 0.1 ? undefined : 'Processing failed',
        metadata: {
          fileSize: Math.floor(Math.random() * 1000000) + 1500000,
          resolution: '1920x1080',
          location: ['Station A', 'Station B', 'Station C'][i % 3]
        }
      }))
    ]
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    const photos = await this.getPhotos()
    const today = new Date().toISOString().split('T')[0]
    
    const dailyPhotos = photos.filter(p => p.date.startsWith(today))
    const errorPhotos = photos.filter(p => p.status === 'error')
    
    const modelUsage = photos.reduce((acc, photo) => {
      if (photo.status === 'success') {
        const existing = acc.find(m => m.model === photo.model)
        if (existing) {
          existing.count++
          if (photo.timestamp > new Date(existing.lastUsed).getTime()) {
            existing.lastUsed = photo.date
          }
        } else {
          acc.push({
            model: photo.model,
            count: 1,
            lastUsed: photo.date
          })
        }
      }
      return acc
    }, [] as ModelUsageStats[])

    return {
      dailyPhotoCount: dailyPhotos.length,
      totalPhotoCount: photos.length,
      errorRate: photos.length > 0 ? (errorPhotos.length / photos.length) * 100 : 0,
      modelUsageStats: modelUsage.sort((a, b) => b.count - a.count)
    }
  }

  static async getWorkers(): Promise<Worker[]> {
    const photos = await this.getPhotos()
    const workerMap = new Map<string, Worker>()

    photos.forEach(photo => {
      if (workerMap.has(photo.workerId)) {
        const worker = workerMap.get(photo.workerId)!
        worker.totalPhotos++
        if (photo.timestamp > new Date(worker.lastActive).getTime()) {
          worker.lastActive = photo.date
        }
      } else {
        workerMap.set(photo.workerId, {
          id: photo.workerId,
          lastActive: photo.date,
          totalPhotos: 1
        })
      }
    })

    return Array.from(workerMap.values()).sort((a, b) => 
      new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    )
  }
}

// CSV export service
export class CSVExportService {
  static async exportAllData(): Promise<void> {
    const photos = await DataService.getPhotos()
    const csvData = this.convertPhotosToCSV(photos)
    this.downloadCSV(csvData, 'countai_all_data')
  }

  static async exportFilteredData(photos: PhotoData[]): Promise<void> {
    const csvData = this.convertPhotosToCSV(photos)
    this.downloadCSV(csvData, 'countai_filtered_data')
  }

  private static convertPhotosToCSV(photos: PhotoData[]): string {
    const headers = [
      'Photo ID',
      'Worker ID',
      'Timestamp',
      'Date Time',
      'Model Used',
      'Count Result',
      'Confidence Score',
      'Status',
      'Error Reason',
      'File Size (bytes)',
      'Resolution',
      'Location'
    ]

    const csvRows = photos.map(photo => [
      photo.id.toString(),
      photo.workerId,
      photo.timestamp.toString(),
      photo.date,
      photo.model,
      photo.count.toString(),
      photo.confidenceScore?.toFixed(2) || '0.00',
      photo.status,
      photo.errorReason || '',
      photo.metadata?.fileSize?.toString() || '',
      photo.metadata?.resolution || '',
      photo.metadata?.location || ''
    ])

    return [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n')
  }

  private static downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
