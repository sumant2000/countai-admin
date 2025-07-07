"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { WorkerAuthService } from "@/lib/services"
import { User, LogOut } from "lucide-react"

interface WorkerAuthProps {
  onAuthChange: (authenticated: boolean) => void
}

export function WorkerAuth({ onAuthChange }: WorkerAuthProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [workerId, setWorkerId] = useState("")
  const [workerName, setWorkerName] = useState("")
  const [currentWorker, setCurrentWorker] = useState<{ id: string; name?: string } | null>(null)

  useEffect(() => {
    const id = WorkerAuthService.getWorkerId()
    const name = WorkerAuthService.getWorkerName()
    
    if (id) {
      setCurrentWorker({ id, name: name || undefined })
      onAuthChange(true)
    } else {
      setIsOpen(true)
      onAuthChange(false)
    }
  }, [onAuthChange])

  const handleLogin = () => {
    if (workerId.trim()) {
      WorkerAuthService.setWorker(workerId.trim(), workerName.trim() || undefined)
      setCurrentWorker({ id: workerId.trim(), name: workerName.trim() || undefined })
      setIsOpen(false)
      onAuthChange(true)
      setWorkerId("")
      setWorkerName("")
    }
  }

  const handleLogout = () => {
    WorkerAuthService.clearWorker()
    setCurrentWorker(null)
    setIsOpen(true)
    onAuthChange(false)
  }

  const openLoginDialog = () => {
    setIsOpen(true)
  }

  if (currentWorker) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>Worker: {currentWorker.name || currentWorker.id}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-8"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Worker Identification</DialogTitle>
          <DialogDescription>
            Please enter your worker ID to access the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="worker-id">Worker ID *</Label>
              <Input
                id="worker-id"
                placeholder="Enter your worker ID"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="worker-name">Worker Name (Optional)</Label>
              <Input
                id="worker-name"
                placeholder="Enter your name"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={!workerId.trim()}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
