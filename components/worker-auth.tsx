"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { WorkerAuthService } from "@/lib/services"
import { WorkerAutoFill } from "@/lib/worker-autofill"
import { User, LogOut, Shuffle } from "lucide-react"

interface WorkerAuthProps {
  onAuthChange: (authenticated: boolean) => void
}

// Auto-fill data for demo purposes - now using the utility
const generateWorkerId = (): string => {
  return WorkerAutoFill.generateWorkerId()
}

const getRandomWorkerName = (): string => {
  return WorkerAutoFill.getRandomWorkerName()
}

export function WorkerAuth({ onAuthChange }: WorkerAuthProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [workerId, setWorkerId] = useState("")
  const [workerName, setWorkerName] = useState("")
  const [currentWorker, setCurrentWorker] = useState<{ id: string; name?: string } | null>(null)

  // Auto-fill on component mount
  useEffect(() => {
    // Check if user is already authenticated
    const id = WorkerAuthService.getWorkerId()
    const name = WorkerAuthService.getWorkerName()
    
    if (id) {
      setCurrentWorker({ id, name: name || undefined })
      onAuthChange(true)
    } else {
      // Auto-fill form with demo data
      setWorkerId(generateWorkerId())
      setWorkerName(getRandomWorkerName())
      setIsOpen(true)
      onAuthChange(false)
    }
  }, [onAuthChange])

  const handleAutoFill = () => {
    setWorkerId(generateWorkerId())
    setWorkerName(getRandomWorkerName())
  }

  const handleQuickLogin = (preset: { id: string; name: string }) => {
    setWorkerId(preset.id)
    setWorkerName(preset.name)
  }

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
    // Auto-fill form when opening dialog
    setWorkerId(generateWorkerId())
    setWorkerName(getRandomWorkerName())
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
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e: any) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Worker Identification</DialogTitle>
          <DialogDescription>
            Your worker credentials have been auto-filled for convenience. You can modify them or generate new ones.
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="worker-id">Worker ID *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAutoFill}
                  className="h-6 px-2 text-xs"
                >
                  <Shuffle className="h-3 w-3 mr-1" />
                  Generate New
                </Button>
              </div>
              <Input
                id="worker-id"
                placeholder="Enter your worker ID"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="worker-name">Worker Name</Label>
              <Input
                id="worker-name"
                placeholder="Enter your name"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleLogin} 
                className="flex-1"
                disabled={!workerId.trim()}
              >
                Continue as {workerName || workerId}
              </Button>
            </div>
            
            {/* Quick Login Presets */}
            <div className="border-t pt-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Quick Login Options:</Label>
              <div className="grid grid-cols-2 gap-2">
                {WorkerAutoFill.getPresetDemoUsers().slice(0, 4).map((preset) => (
                  <Button
                    key={preset.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin(preset)}
                    className="h-8 text-xs"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              💡 Tip: Worker credentials are auto-generated for demo purposes. Use quick login or generate new credentials.
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
