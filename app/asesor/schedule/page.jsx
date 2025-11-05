"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { mockGetLinimasa } from "@/lib/api-mock"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Link as LinkIcon } from "lucide-react" 
import { Button } from "@/components/ui/button"

export default function AsesorSchedulePage() {
  const { user } = useAuth() 
  const [linimasa, setLinimasa] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    // Hanya load jika user sudah ada
    if (user) {
      loadLinimasa()
    }
  }, [user])

  const loadLinimasa = async () => {
    try {
      setLoading(true)
      // Ambil jadwal berdasarkan skema yang bisa diajar asesor
      // Untuk mock, kita ambil aja salah satu atau gabung
      const skemaId = user?.skemaKeahlian?.[0] || "ADS" // Ambil skema pertama yg dia bisa
      const data = await mockGetLinimasa(skemaId) 
      setLinimasa(data)
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
                      <div key={event.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium">{event.judul}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{event.deskripsi}</p>

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

