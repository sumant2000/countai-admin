"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Camera, TrendingUp, AlertTriangle, Users } from "lucide-react"
import { DataService } from "@/lib/services"
import { DashboardStats } from "@/lib/types"

const chartConfig = {
  count: {
    label: "Usage Count",
    color: "hsl(var(--chart-1))",
  },
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const dashboardStats = await DataService.getDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Loading system status...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Failed to load dashboard data</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Monitor system operation status - Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Photos</CardTitle>
            <Camera className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.dailyPhotoCount}</div>
            <p className="text-xs text-green-600 mt-1">
              <span className="inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Photos taken today
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Photos</CardTitle>
            <Camera className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalPhotoCount.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Cumulative since launch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-red-500 mt-1">
              <span className="inline-flex items-center">Model failures requiring review</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Models</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.modelUsageStats.length}</div>
            <p className="text-xs text-gray-500 mt-1">AI models in use</p>
          </CardContent>
        </Card>
      </div>

      {/* Model Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">AI Model Usage</CardTitle>
          <p className="text-sm text-gray-600">API call frequency by model type</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.modelUsageStats}>
                <XAxis 
                  dataKey="model" 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Model Usage Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Model Details</CardTitle>
          <p className="text-sm text-gray-600">Detailed usage statistics for each AI model</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.modelUsageStats.map((model, index) => (
              <div key={model.model} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <div>
                    <div className="font-medium text-gray-900">{model.model}</div>
                    <div className="text-xs text-gray-500">Last used: {model.lastUsed}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{model.count}</div>
                  <div className="text-xs text-gray-500">API calls</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
