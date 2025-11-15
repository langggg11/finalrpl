"use client"

import React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"

export default function AdminExamsPage() {

  // Halaman ini masih placeholder
  // Nanti kita bisa isi dengan logic untuk me-monitor ujian yang sedang berjalan, dll.

  return (
    <MainLayout>
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Ujian</h1>
          <p className="text-gray-600 mt-1">Monitor sesi ujian yang sedang berlangsung dan lihat hasil.</p>
        </div>

        {/* Placeholder Content */}
        <Card>
          <CardHeader>
            <CardTitle>Ujian Sedang Berlangsung</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Fitur Manajemen Ujian sedang dalam pengembangan.</p>
            <p className="text-sm text-gray-400 mt-2">Halaman ini akan berisi daftar sesi ujian yang aktif.</p>
          </CardContent>
        </Card>
        
        <Skeleton className="h-40 w-full bg-gray-200" />
      </div>
    </MainLayout>
  )
}