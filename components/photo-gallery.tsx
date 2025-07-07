"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Download, 
  AlertCircle, 
  RefreshCw,
  Filter
} from "lucide-react"
import { DataService, CSVExportService } from "@/lib/services"
import { PhotoData } from "@/lib/types"

export function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState<string>("all")
  const [selectedWorker, setSelectedWorker] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null)
  const itemsPerPage = 6

  // Load photos on component mount
  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true)
      try {
        const photoData = await DataService.getPhotos()
        setPhotos(photoData)
        setFilteredPhotos(photoData)
        
        // Set default date range to today
        const today = new Date().toISOString().split('T')[0]
        setStartDate(today)
        setEndDate(today)
      } catch (error) {
        console.error('Failed to load photos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [])

  // Filter photos based on criteria
  useEffect(() => {
    let filtered = photos

    // Filter by model
    if (selectedModel !== "all") {
      filtered = filtered.filter(photo => photo.model === selectedModel)
    }

    // Filter by worker
    if (selectedWorker !== "all") {
      filtered = filtered.filter(photo => photo.workerId === selectedWorker)
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(photo => photo.status === selectedStatus)
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(photo => photo.date >= startDate)
    }
    if (endDate) {
      filtered = filtered.filter(photo => photo.date <= endDate + " 23:59:59")
    }

    setFilteredPhotos(filtered)
    setCurrentPage(1)
  }, [photos, selectedModel, selectedWorker, selectedStatus, startDate, endDate])

  // Get unique values for filters
  const uniqueWorkers = Array.from(new Set(photos.map(photo => photo.workerId))).sort()
  const uniqueModels = Array.from(new Set(photos.map(photo => photo.model))).sort()

  const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentPhotos = filteredPhotos.slice(startIndex, startIndex + itemsPerPage)

  const handleExportCSV = async () => {
    await CSVExportService.exportFilteredData(filteredPhotos)
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const photoData = await DataService.getPhotos()
      setPhotos(photoData)
    } catch (error) {
      console.error('Failed to refresh photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSelectedModel("all")
    setSelectedWorker("all")
    setSelectedStatus("all")
    setStartDate("")
    setEndDate("")
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo Gallery</h2>
          <p className="text-gray-600">Loading photos...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo Gallery</h2>
          <p className="text-gray-600">View captured photos and AI analysis results</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportCSV} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">to</span>
              <Input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Model Filter */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="All Models" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {uniqueModels.map((model) => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Worker Filter */}
            <Select value={selectedWorker} onValueChange={setSelectedWorker}>
              <SelectTrigger>
                <SelectValue placeholder="All Workers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workers</SelectItem>
                {uniqueWorkers.map((worker) => (
                  <SelectItem key={worker} value={worker}>Worker {worker}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {currentPhotos.length} of {filteredPhotos.length} photos
          {filteredPhotos.length !== photos.length && ` (filtered from ${photos.length} total)`}
        </div>
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPhotos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={photo.thumbnail || "/placeholder.svg"}
                alt={`Photo ${photo.id}`}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              />
              <Button 
                size="sm" 
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {photo.status === "error" && (
                <div className="absolute top-2 left-2">
                  <AlertCircle className="h-5 w-5 text-red-500 bg-white rounded-full p-0.5" />
                </div>
              )}
              {photo.confidenceScore && (
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {(photo.confidenceScore * 100).toFixed(0)}% confidence
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={photo.status === "error" ? "destructive" : "secondary"} className="text-xs">
                    {photo.model}
                  </Badge>
                  <span className="text-xs text-gray-500">{photo.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {photo.status === "success" ? (
                      <>
                        <span className="text-sm font-medium text-gray-900">Count: </span>
                        <span className="text-lg font-bold text-blue-600">{photo.count}</span>
                      </>
                    ) : (
                      <div className="text-sm text-red-600">
                        <div className="font-medium">Processing Error</div>
                        <div className="text-xs">{photo.errorReason}</div>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Worker</div>
                    <div className="text-sm font-medium text-gray-900">{photo.workerId}</div>
                  </div>
                </div>
                {photo.metadata?.location && (
                  <div className="text-xs text-gray-500">📍 {photo.metadata.location}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  page = currentPage - 2 + i;
                }
                if (currentPage > totalPages - 2) {
                  page = totalPages - 4 + i;
                }
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Photo Detail Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle>Photo Details - ID: {selectedPhoto.id}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedPhoto.thumbnail || "/placeholder.svg"}
                    alt={`Photo ${selectedPhoto.id}`}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-500">Worker ID</div>
                      <div className="text-gray-900">{selectedPhoto.workerId}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Timestamp</div>
                      <div className="text-gray-900">{selectedPhoto.date}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Model Used</div>
                      <div className="text-gray-900">{selectedPhoto.model}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Status</div>
                      <Badge variant={selectedPhoto.status === "error" ? "destructive" : "secondary"}>
                        {selectedPhoto.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Count Result</div>
                      <div className="text-gray-900 text-lg font-bold">{selectedPhoto.count}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Confidence Score</div>
                      <div className="text-gray-900">{((selectedPhoto.confidenceScore || 0) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  {selectedPhoto.errorReason && (
                    <div>
                      <div className="font-medium text-gray-500">Error Reason</div>
                      <div className="text-red-600">{selectedPhoto.errorReason}</div>
                    </div>
                  )}

                  {selectedPhoto.metadata && (
                    <div className="space-y-2">
                      <div className="font-medium text-gray-500">Metadata</div>
                      <div className="text-sm space-y-1">
                        {selectedPhoto.metadata.fileSize && (
                          <div>File Size: {(selectedPhoto.metadata.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                        )}
                        {selectedPhoto.metadata.resolution && (
                          <div>Resolution: {selectedPhoto.metadata.resolution}</div>
                        )}
                        {selectedPhoto.metadata.location && (
                          <div>Location: {selectedPhoto.metadata.location}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
