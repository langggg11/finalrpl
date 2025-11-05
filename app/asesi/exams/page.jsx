"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockGetUnitsForSkema, mockGetProgressAsesi } from "@/lib/api-mock"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Clock, FileUp, Lock, PlayCircle, Download } from "lucide-react"
import Link from "next/link"

export default function ExamsPage() {
  const { user } = useAuth()
  const [units, setUnits] = useState([])
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("teori")

  // Cek prasyarat
  const canStartTeori = progress && progress.tryoutSelesai;
  const canStartPraktikum = progress && progress.ujianTeoriSelesai; 
  const skemaId = user?.skemaId || "ADS"; // Ambil skema dari user

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user]) // Hanya bergantung pada user

  const loadData = async () => {
    try {
      setLoading(true)
      const [unitsData, progressData] = await Promise.all([
        mockGetUnitsForSkema(skemaId),
        mockGetProgressAsesi(user.id)
      ])
      
      setUnits(unitsData)
      setProgress(progressData)
    } catch (error) {
      console.error("Error loading units:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Ujian Sertifikasi</h1>
          <p className="text-muted-foreground mt-1">Ikuti ujian teori, praktikum, dan unjuk diri sesuai jadwal</p>
        </div>

        {/* Warning Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Pastikan koneksi internet stabil sebelum memulai ujian. Ujian tidak dapat dijeda atau diulang dalam satu
            sesi.
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teori">Ujian Teori</TabsTrigger>
            <TabsTrigger value="praktikum">Ujian Praktikum</TabsTrigger>
            <TabsTrigger value="unjuk-diri">Unjuk Diri</TabsTrigger>
          </TabsList>

          {/* Ujian Teori Tab (Sudah Bener) */}
          <TabsContent value="teori" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ujian Teori (Esai)</CardTitle>
                <CardDescription>Jawab pertanyaan esai untuk seluruh unit kompetensi dalam satu sesi.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div className="space-y-4">
                    {/* Cek Prasyarat */}
                    {!canStartTeori ? (
                       <Alert variant="destructive">
                         <Lock className="h-4 w-4" />
                         <AlertDescription>
                           Anda harus menyelesaikan <strong>Tryout</strong> terlebih dahulu sebelum dapat memulai Ujian Teori.
                         </AlertDescription>
                       </Alert>
                    ) : (
                       <Alert>
                         <PlayCircle className="h-4 w-4" />
                         <AlertDescription>
                           Anda sudah menyelesaikan Tryout. Ujian Teori (Esai) siap untuk dimulai.
                         </AlertDescription>
                       </Alert>
                    )}

                    <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                       <div>
                         <h4 className="font-medium">Ujian Teori Skema {skemaId}</h4>
                         <p className="text-sm text-muted-foreground mt-1">
                           Total {units.length} Unit (Full Esai)
                         </p>
                       </div>
                       <Link href="/asesi/exams/teori/run">
                         <Button
                           disabled={!canStartTeori}
                         >
                           Mulai Ujian Teori
                         </Button>
                       </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- (INI BAGIAN YANG BERUBAH) --- */}
          {/* Ujian Praktikum Tab (Revisi Baru) */}
          <TabsContent value="praktikum" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ujian Praktikum (Studi Kasus)</CardTitle>
                <CardDescription>Download soal & data, lalu unggah 1 file presentasi (.ppt) hasil analisis Anda.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-32 w-full" />
                ) : !canStartPraktikum ? (
                    <Alert variant="destructive">
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        Anda harus menyelesaikan <strong>Ujian Teori</strong> terlebih dahulu sebelum dapat memulai Ujian Praktikum.
                      </AlertDescription>
                    </Alert>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Silakan unduh soal dan data studi kasus yang telah disiapkan. Kerjakan analisis secara offline
                      sesuai instruksi, lalu unggah hasil akhir Anda dalam satu file presentasi.
                    </p>
                    <div className="flex gap-4">
                      <Button variant="outline" asChild>
                        <a href="https://example.com/soal-praktikum-skema-ds.zip" target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Download Soal & Data (.zip)
                        </a>
                      </Button>
                      <Button asChild>
                        <Link href="/asesi/exams/praktikum/upload">
                          <FileUp className="w-4 h-4 mr-2" />
                          Unggah File PPT
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          {/* Unjuk Diri Tab */}
          <TabsContent value="unjuk-diri" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unjuk Diri (Demonstrasi)</CardTitle>
                <CardDescription>
                  Presentasikan hasil analisis Anda di hadapan asesor pada jadwal yang telah ditentukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Unjuk diri dilaksanakan secara tatap muka dengan asesor. Jadwal akan diumumkan di bagian linimasa.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">Jadwal unjuk diri akan ditampilkan setelah ujian praktikum dikirimkan.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}