"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Camera, Home } from "lucide-react"
import { WorkerAuthService } from "@/lib/services"

interface AdminLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const [workerInfo, setWorkerInfo] = useState<{ id: string; name?: string } | null>(null)

  useEffect(() => {
    const id = WorkerAuthService.getWorkerId()
    const name = WorkerAuthService.getWorkerName()
    if (id) {
      setWorkerInfo({ id, name: name || undefined })
    }
  }, [])

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "gallery", label: "Photo Gallery", icon: Camera },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">CountAI Admin Panel</h1>
          {workerInfo && (
            <div className="text-sm">
              <span className="opacity-75">Logged in as: </span>
              <span className="font-medium">{workerInfo.name || workerInfo.id}</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-72px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <Button
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        activeTab === item.id
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => onTabChange(item.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
