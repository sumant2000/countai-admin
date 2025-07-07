"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Dashboard } from "@/components/dashboard"
import { PhotoGallery } from "@/components/photo-gallery"
import { WorkerAuth } from "@/components/worker-auth"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const renderContent = () => {
    if (!isAuthenticated) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "gallery":
        return <PhotoGallery />
      default:
        return <Dashboard />
    }
  }

  return (
    <>
      <WorkerAuth onAuthChange={setIsAuthenticated} />
      {isAuthenticated && (
        <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
          {renderContent()}
        </AdminLayout>
      )}
    </>
  )
}
