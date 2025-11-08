"use client"

import React, { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
// --- (PERUBAHAN IMPORT) ---
import { mockGetLinimasa, mockGetAsesorUsers } from "@/lib/api-mock"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Link as LinkIcon, User as UserIcon } from "lucide-react" 
// --- (BATAS PERUBAHAN IMPORT) ---
import { Button } from "@/components/ui/button"

export default function AsesorSchedulePage() {
  const { user } = useAuth() 
  const [linimasa, setLinimasa] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  // (Tidak perlu state asesorList, kita akan merge langsung)

  useEffect(() => {
    // Hanya load jika user sudah ada
    if (user) {
      loadLinimasa()
    }
  }, [user])

  const loadLinimasa = async () => {
    try {
      setLoading(true)
      const skemaId = user?.skemaKeahlian?.[0] || "ADS" // Ambil skema pertama yg dia bisa
      
      // --- (PERUBAHAN LOGIKA LOAD DATA) ---
      // Kita panggil 2 API: jadwal linimasa DAN daftar semua asesor
      const [data, asesorData] = await Promise.all([
        mockGetLinimasa(skemaId),
        mockGetAsesorUsers() 
      ]);

      // Buat "kamus" untuk mapping ID asesor ke nama
      const asesorNameMap = new Map(asesorData.map(a => [a.id, a.nama]));
      
      // Proses data linimasa untuk menambahkan info pemateri
      const formattedData = data.map(event => ({
        ...event,
        // Cari nama pemateri dari kamus
        pemateriNama: asesorNameMap.get(event.pemateriAsesorId) || null,
        // Cek apakah ID pemateri = ID user yang sedang login
        isPemateri: event.pemateriAsesorId === user.id 
      }));
      // --- (BATAS PERUBAHAN) ---

      setLinimasa(formattedData) // Simpan data yang sudah digabung
    } catch (error) {
      console.error("Error loading linimasa:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = selectedDate
    ? linimasa.filter((event) => new Date(event.tanggal).toDateString() === selectedDate.toDateString())
    : [] 

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Jadwal Kegiatan</h1>
          <p className="text-muted-foreground mt-1">Lihat linimasa pelaksanaan pembelajaran dan ujian</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              {loading ? (
                 <Skeleton className="h-[290px] w-full" />
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="p-0"
                  // (Tambahkan modifiers untuk event dot)
                  modifiers={{ hasEvent: linimasa.map(l => new Date(l.tanggal)) }}
                  modifiersClassNames={{ hasEvent: 'has-event-dot' }}
                />
              )}
            </CardContent>
          </Card>

          {/* Events */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{selectedDate ? new Date(selectedDate).toLocaleDateString("id-ID", {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : "Pilih Tanggal"}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Tidak ada kegiatan pada tanggal ini</p>
                ) : (
                  <div className="space-y-3">
                    {filteredEvents.map((event) => (
                      // --- (PERUBAHAN UI KARTU EVENT) ---
                      <div 
                        key={event.id} 
                        // Kartu akan di-highlight biru jika 'isPemateri' true
                        className={`border rounded-lg p-4 transition-colors ${
                          event.isPemateri 
                            ? "bg-blue-50 border-blue-300" 
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium">{event.judul}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{event.deskripsi}</p>
                            
                            {/* Tambahkan info pemateri di sini */}
                            {event.pemateriNama && (
                              <div className={`flex items-center gap-1.5 mt-3 text-sm ${
                                event.isPemateri 
                                  ? "text-blue-700 font-semibold" 
                                  : "text-gray-600"
                              }`}>
                                <UserIcon className="w-4 h-4" />
                                Pemateri: {event.pemateriNama} 
                                {event.isPemateri && " (Anda)"}
                              </div>
                            )}

                            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                              {event.waktu && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {event.waktu}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                  {event.tipe}
                                </span>
                              </div>
                            </div>

                            {event.urlZoom && (
                              <div className="mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(event.urlZoom, "_blank")}
                                >
                                  <LinkIcon className="w-4 h-4 mr-2" />
                                  Masuk Zoom
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      // --- (BATAS PERUBAHAN UI) ---
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}