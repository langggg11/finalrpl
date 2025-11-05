"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload } from "lucide-react"

export default function PraktikumUploadPage() {
  const router = useRouter()
  const { user } = useAuth() // Ambil data user

  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      // Simulasi upload
      console.log("[Mock] Uploading file:", file.name, "for user:", user.id)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("File berhasil diunggah!")
      router.push("/asesi/exams") 
    } catch (error) {
      console.error("Upload error:", error)
      alert("Gagal mengunggah file")
    } finally {
      setUploading(false)
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Unggah Jawaban Ujian Praktikum</h1>
          <p className="text-muted-foreground mt-1">Skema: {user?.skemaId}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Panduan Pengumpulan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Format File yang Diterima:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Presentasi (.pptx) - **Direkomendasikan**</li>
                <li>PDF (.pdf)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Ukuran File Maksimal:</h4>
              <p className="text-muted-foreground">50 MB</p>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Pastikan file yang Anda unggah sudah final. Anda hanya dapat mengunggah **satu file** untuk
            seluruh ujian praktikum.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <label htmlFor="file-input" className="cursor-pointer">
                  <p className="font-medium">Pilih file atau tarik ke sini</p>
                  <p className="text-sm text-muted-foreground">{file ? file.name : "Hanya file .ppt atau .pdf (Maks 50MB)"}</p>
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.pptx"
                />
              </div>

              {file && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">File dipilih:</span> {file.name} ({Math.round(file.size / 1024)} KB)
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    const input = document.getElementById("file-input")
                    if (input) input.value = ""
                  }}
                  disabled={!file}
                >
                  Hapus File
                </Button>
                <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1">
                  {uploading ? "Mengunggah..." : "Unggah dan Selesaikan"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}