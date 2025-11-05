"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { mockGetLinimasa, mockGetPlottingAsesi } from "@/lib/api-mock"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Link as LinkIcon, MapPin, Video, Calendar as CalendarIcon } from "lucide-react" // <-- Import Ikon Kalender
import { Button } from "@/components/ui/button"

export default function SchedulePage() {
  const { user } = useAuth()
  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      const skemaId = user?.skemaId || "ADS"
      
      const [linimasaData, plottingData] = await Promise.all([
        mockGetLinimasa(skemaId),
        mockGetPlottingAsesi(user.id)
      ])
      
      const normalizedLinimasa = linimasaData.map(item => ({
        id: `lin-${item.id}`,
        judul: item.judul,
        deskripsi: item.deskripsi,
        tanggal: new Date(item.tanggal),
        waktu: item.waktu,
        tipe: item.tipe,
        urlZoom: item.urlZoom,
      }))
      
      const normalizedPlotting = plottingData.map(item => ({
        id: `plot-${item.id}`,
        judul: `Ujian Offline: ${item.tipeUjian}`,
        deskripsi: `Lokasi: ${item.ruangan}`,
        tanggal: new Date(item.tanggal),
        waktu: item.waktu,
        tipe: "SESI_OFFLINE",
        ruangan: item.ruangan,
      }))
      
      setAllEvents([...normalizedLinimasa, ...normalizedPlotting])
      
    } catch (error) {
      console.error("Error loading schedule data:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const filteredEvents = selectedDate
    ? allEvents.filter((event) => event.tanggal.toDateString() === selectedDate.toDateString())
    : []

  // --- (INI KOMPONEN BARU BUAT ITEM KEGIATAN) ---
  const EventItem = ({ event }) => {
    let icon = <Clock className="w-4 h-4 text-gray-500" />
    let badgeColor = "bg-gray-100 text-gray-800"
    
    if (event.tipe === "PEMBELAJARAN") {
      icon = <Video className="w-4 h-4 text-blue-600" />
      badgeColor = "bg-blue-100 text-blue-800"
    } else if (event.tipe === "SESI_OFFLINE") {
      icon = <MapPin className="w-4 h-4 text-purple-600" />
      badgeColor = "bg-purple-100 text-purple-800"
    } else if (event.tipe === "PENGUMUMAN") {
      badgeColor = "bg-yellow-100 text-yellow-800"
    }

    return (
      <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
             <div className={`w-8 h-8 rounded-lg ${badgeColor} flex items-center justify-center`}>
                {icon}
             </div>
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{event.judul}</h4>
            <p className="text-sm text-muted-foreground mt-1">{event.deskripsi}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
              {event.waktu && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {event.waktu}
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className={`px-2 py-0.5 rounded ${badgeColor} text-xs font-medium`}>
                  {event.tipe.replace("_", " ")}
                </span>
              </div>
            </div>

            {event.urlZoom && (
              <div className="mt-4">
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
    )
  }
  // --- (BATAS KOMPONEN BARU) ---

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        
        {/* --- (INI DIA PERBAIKANNYA) --- */}
        
        {/* 1. Banner Biru Sesuai Figma */}
        <div className="w-full bg-blue-700 text-white rounded-lg p-8 flex items-center gap-4">
            <CalendarIcon className="w-10 h-10 text-blue-300 flex-shrink-0" />
            <div>
                <h1 className="text-3xl font-bold">Linimasa Kegiatan</h1>
                <p className="text-blue-200 mt-1">Jadwal seluruh kegiatan pembelajaran, ujian, dan kegiatan penting lainnya.</p>
            </div>
        </div>

        {/* 2. Layout diubah jadi 1 kolom (Vertikal) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Kalender */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Kalender Kegiatan</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[290px] w-full" />
                ) : (
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="p-0 w-full" // <-- Dibuat full width
                    classNames={{
                        month: "w-full",
                        table: "w-full",
                        head_row: "flex w-full",
                        head_cell: "flex-1",
                        row: "flex w-full mt-2",
                        cell: "flex-1",
                        day: "w-full h-12", // <-- Bikin selnya gede
                    }}
                    modifiers={{
                        hasEvent: allEvents.map(e => e.tanggal)
                    }}
                    modifiersStyles={{
                        hasEvent: { fontWeight: 'bold', textDecoration: 'underline' }
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Detail Kegiatan (Sesuai Tanggal) */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="lg:sticky lg:top-6"> {/* <-- Bikin sticky biar ngikut pas scroll */}
              <CardHeader>
                <CardTitle>
                  {selectedDate ? new Date(selectedDate).toLocaleDateString("id-ID", {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  }) : "Pilih Tanggal"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : filteredEvents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Tidak ada kegiatan pada tanggal ini</p>
                ) : (
                  <div className="space-y-3">
                    {filteredEvents.map((event) => (
                      <EventItem key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        {/* --- (BATAS PERBAIKAN) --- */}
        
      </div>
    </MainLayout>
  )
}