"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible" 
import { mockGetSesiUjianDetail, mockGetAsesiBelumDiplot, mockUpdatePlottingSesi } from "@/lib/api-mock"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Users, UserPlus, ArrowLeft, Save, AlertCircle, Trash2, ChevronRight, Check } from "lucide-react"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { Label } from "@/components/ui/label"
// --- (PERUBAHAN 1: Impor AlertDialog) ---
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// --- (Batas Perubahan 1) ---

export default function PlottingPage() {
  const params = useParams()
  const router = useRouter()
  const sesiId = params.sesiId

  const [sesi, setSesi] = useState(null)
  const [availableGrup, setAvailableGrup] = useState([]) 
  const [plottedAsesi, setPlottedAsesi] = useState([]) 
  
  const [selectedAvailable, setSelectedAvailable] = useState(new Set())
  const [selectedPlotted, setSelectedPlotted] = useState(new Set())
  
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // --- (PERUBAHAN 2: State untuk dialog notifikasi) ---
  const [infoDialog, setInfoDialog] = useState({ open: false, title: "", message: "" });
  // --- (Batas Perubahan 2) ---

  useEffect(() => {
    if (sesiId) {
      loadData()
    }
  }, [sesiId])

  const loadData = async () => {
    try {
      setLoading(true)
      const sesiData = await mockGetSesiUjianDetail(sesiId)
      setSesi(sesiData)
      setPlottedAsesi(sesiData.asesiTerplot || [])
      
      const availableDataGrup = await mockGetAsesiBelumDiplot(sesiData.skemaId, sesiId)
      setAvailableGrup(availableDataGrup)
      
    } catch (error) {
      console.error("Error loading plotting data:", error)
      // --- (PERUBAHAN 3: Ganti alert) ---
      setInfoDialog({ open: true, title: "Error", message: "Gagal memuat data sesi." })
      // --- (Batas Perubahan 3) ---
    } finally {
      setLoading(false)
    }
  }
  
  const sisaKapasitas = sesi ? sesi.kapasitas - plottedAsesi.length : 0
  const kapasitasPenuh = sisaKapasitas <= 0

  
  const plotGrup = (asesiGrup) => {
    if (asesiGrup.length > sisaKapasitas) {
      // --- (PERUBAHAN 4: Ganti alert) ---
      setInfoDialog({ open: true, title: "Kapasitas Penuh", message: `Kapasitas tidak cukup! Kelas ini berisi ${asesiGrup.length} asesi, tapi sisa kapasitas hanya ${sisaKapasitas}.` })
      // --- (Batas Perubahan 4) ---
      return
    }
    setAvailableGrup(prev => prev.filter(g => g.namaKelas !== asesiGrup[0].kelas))
    setPlottedAsesi(prev => [...prev, ...asesiGrup])
  }

  const plotSelected = () => {
    const toPlot = availableGrup.flatMap(g => g.asesi).filter(a => selectedAvailable.has(a.id))
    
    if (toPlot.length > sisaKapasitas) {
      // --- (PERUBAHAN 5: Ganti alert) ---
      setInfoDialog({ open: true, title: "Kapasitas Penuh", message: `Kapasitas tidak cukup! Anda mencoba memasukkan ${toPlot.length} asesi, tapi sisa kapasitas hanya ${sisaKapasitas}.` })
      // --- (Batas Perubahan 5) ---
      return
    }
    
    setAvailableGrup(prev => 
      prev.map(grup => ({
        ...grup,
        asesi: grup.asesi.filter(a => !selectedAvailable.has(a.id))
      })).filter(grup => grup.asesi.length > 0) 
    )
    
    setPlottedAsesi(prev => [...prev, ...toPlot])
    setSelectedAvailable(new Set())
  }
  
  const unplotSelected = () => {
    const toUnplot = plottedAsesi.filter(a => selectedPlotted.has(a.id))
    
    setPlottedAsesi(prev => prev.filter(a => !selectedPlotted.has(a.id)))
    
    setAvailableGrup(prev => {
      const newGrup = [...prev]
      toUnplot.forEach(asesi => {
        const namaKelas = asesi.kelas || "Lainnya"
        let grup = newGrup.find(g => g.namaKelas === namaKelas)
        if (!grup) {
          grup = { namaKelas: namaKelas, asesi: [] }
          newGrup.push(grup)
        }
        grup.asesi.push(asesi)
      })
      return newGrup
    })
    setSelectedPlotted(new Set())
  }

  const handleSelectAvailable = (id, checked) => {
    setSelectedAvailable(prev => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }
  
  const handleSelectPlotted = (id, checked) => {
    setSelectedPlotted(prev => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }
  
  // ==========================================================
  // --- FUNGSI BARU UNTUK PILIH CEPAT (REVISI) ---
  // ==========================================================
  const handleSelectSisaKapasitas = (grup) => {
    // 1. Hitung sisa slot yang SEBENARNYA (total sisa - yang sudah dipilih)
    const sisaSlotSebenarnya = sisaKapasitas - selectedAvailable.size;

    if (sisaSlotSebenarnya <= 0) {
      // --- (PERUBAHAN 6: Ganti alert) ---
      setInfoDialog({ open: true, title: "Kapasitas Penuh", message: "Kapasitas sudah penuh atau terisi oleh asesi terpilih dari grup lain." });
      // --- (Batas Perubahan 6) ---
      return; 
    }

    // 2. Ambil ID asesi di grup ini yang BELUM terpilih
    const asesiBelumTerpilihDiGrupIni = grup.asesi
      .filter(a => !selectedAvailable.has(a.id))
      .map(a => a.id);
    
    // 3. Ambil hanya sebanyak sisa slot yang sebenarnya
    const idUntukDipilih = asesiBelumTerpilihDiGrupIni.slice(0, sisaSlotSebenarnya);

    if (idUntukDipilih.length === 0) {
      // --- (PERUBAHAN 7: Ganti alert) ---
      setInfoDialog({ open: true, title: "Informasi", message: "Semua asesi di grup ini sudah terpilih atau sisa kapasitas sudah dipenuhi oleh grup lain." });
      // --- (Batas Perubahan 7) ---
      return;
    }

    // 4. Tambahkan ID tersebut ke state 'selectedAvailable'
    setSelectedAvailable(prev => {
      const next = new Set(prev);
      idUntukDipilih.forEach(id => next.add(id));
      return next;
    });
  }

  // --- FUNGSI BARU UNTUK PILIH SEMUA DI GRUP ---
  const handleSelectAllInGroup = (grup, checked) => {
    setSelectedAvailable(prev => {
      const next = new Set(prev);
      if (checked) {
        grup.asesi.forEach(a => next.add(a.id));
      } else {
        grup.asesi.forEach(a => next.delete(a.id));
      }
      return next;
    });
  }
  // ==========================================================
  // --- BATAS FUNGSI BARU ---
  // ==========================================================


  const handleSavePlotting = async () => {
    setIsSaving(true)
    try {
      const asesiIds = plottedAsesi.map(a => a.id)
      await mockUpdatePlottingSesi(sesiId, asesiIds)
      // --- (PERUBAHAN 8: Ganti alert dengan dialog + logic redirect) ---
      setInfoDialog({ 
        open: true, 
        title: "Sukses", 
        message: "Plotting berhasil disimpan!",
        // Tambahkan onConfirm untuk redirect setelah dialog ditutup
        onConfirm: () => router.push("/admin/timeline") 
      });
      // --- (Batas Perubahan 8) ---
    } catch (error) {
      console.error("Error saving plotting:", error)
      // --- (PERUBAHAN 9: Ganti alert) ---
      setInfoDialog({ open: true, title: "Gagal Menyimpan", message: `Gagal menyimpan: ${error.message}` })
      // --- (Batas Perubahan 9) ---
    } finally {
      setIsSaving(false)
    }
  }

  const filteredAvailableGrup = useMemo(() => {
    if (!searchTerm) return availableGrup
    
    return availableGrup
      .map(grup => ({
        ...grup,
        asesi: grup.asesi.filter(a => 
          a.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.nim.includes(searchTerm)
        )
      }))
      .filter(grup => grup.asesi.length > 0) 
      
  }, [availableGrup, searchTerm])
  
  const totalAsesiAvailable = filteredAvailableGrup.reduce((sum, grup) => sum + grup.asesi.length, 0)
  
  // ==========================================================
  // --- VARIABEL BARU UNTUK TOMBOL "PILIH CEPAT" ---
  // ==========================================================
  // Ini adalah sisa slot SEBENARNYA, dikurangi yang sudah dipilih di daftar kiri
  const sisaSlotReal = sisaKapasitas - selectedAvailable.size;
  // ==========================================================

  if (loading || !sesi) {
    return (
      <MainLayout>
        <div className="p-6 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
           <Button variant="outline" size="sm" asChild className="mb-2">
             <Link href="/admin/timeline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Manajemen Jadwal
             </Link>
           </Button>
          <h1 className="text-3xl font-bold text-gray-900">Atur Peserta Sesi Ujian Offline</h1>
          <p className="text-gray-600 mt-1">
            Plotting peserta untuk sesi: <strong>{sesi.tipeUjian}</strong> ({sesi.ruangan}) pada <strong>{new Date(sesi.tanggal).toLocaleDateString("id-ID")}</strong>
          </p>
        </div>

        {/* Info Kapasitas */}
        <Card>
            <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-500" />
                        <span className="text-lg font-bold">Kapasitas Ruangan</span>
                    </div>
                    <div className={`text-2xl font-bold ${kapasitasPenuh ? 'text-red-600' : 'text-gray-900'}`}>
                        {plottedAsesi.length} / {sesi.kapasitas}
                    </div>
                </div>
                {kapasitasPenuh && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Kapasitas ruangan sudah penuh. Anda tidak dapat menambahkan peserta lagi.</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>

        {/* 2 Kolom Plotting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Kolom Kiri: Asesi Tersedia (Pake Collapsible) */}
          <Card>
            <CardHeader>
              <CardTitle>Asesi Tersedia (Skema {sesi.skemaId})</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Cari nama atau NIM..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-10 h-10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pr-2">
              {/* --- (PERUBAHAN 10: Tambah gap-2) --- */}
              <div className="flex items-center justify-between gap-2 p-3 border-b">
              {/* --- (Batas Perubahan 10) --- */}
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">Total Tersedia: {totalAsesiAvailable}</span>
                </div>
                <Button 
                  size="sm" 
                  onClick={plotSelected}
                  disabled={selectedAvailable.size === 0 || (selectedAvailable.size > sisaKapasitas)}
                  title={selectedAvailable.size > sisaKapasitas ? `Kapasitas tidak cukup! (Sisa: ${sisaKapasitas})` : "Plot asesi yang terpilih"}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Plot Terpilih ({selectedAvailable.size})
                </Button>
              </div>
              
              <div className="max-h-80 overflow-y-auto space-y-2 pt-2">
                {filteredAvailableGrup.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Tidak ada asesi tersedia.</p>}
                
                {filteredAvailableGrup.map(grup => {
                  // ==========================================================
                  // --- LOGIKA BARU UNTUK CHECKBOX "PILIH SEMUA" ---
                  // ==========================================================
                  const allInGroupSelected = grup.asesi.length > 0 && grup.asesi.every(a => selectedAvailable.has(a.id));
                  const someInGroupSelected = grup.asesi.some(a => selectedAvailable.has(a.id));
                  const checkboxState = allInGroupSelected ? "checked" : (someInGroupSelected ? "indeterminate" : "unchecked");
                  // ==========================================================
                  
                  return (
                    <Collapsible key={grup.namaKelas} className="border rounded-lg">
                        <div className="flex items-center justify-between p-2 bg-gray-50">
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" className="flex-1 justify-start">
                                    <ChevronRight className="w-4 h-4 mr-2 data-[state=open]:rotate-90 transition-transform" />
                                    <span className="font-bold">{grup.namaKelas}</span>
                                    <span className="text-sm text-gray-500 ml-2">({grup.asesi.length} asesi)</span>
                                </Button>
                            </CollapsibleTrigger>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8"
                              onClick={() => plotGrup(grup.asesi)}
                              disabled={grup.asesi.length > sisaKapasitas}
                              title={grup.asesi.length > sisaKapasitas ? `Kapasitas tidak cukup (Butuh: ${grup.asesi.length}, Sisa: ${sisaKapasitas})` : "Plot 1 Kelas"}
                            >
                              Plot 1 Kelas
                            </Button>
                        </div>
                        <CollapsibleContent className="p-2 space-y-2">
                            
                            {/* ========================================================== */}
                            {/* --- BLOK KONTROL BARU DI DALAM COLLAPSIBLE --- */}
                            {/* ========================================================== */}
                            <div className="flex items-center justify-between gap-4 p-2 border-b">
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id={`select-all-${grup.namaKelas}`}
                                  checked={checkboxState === "checked"}
                                  data-state={checkboxState} // Untuk menampilkan status indeterminate (-)
                                  onCheckedChange={(checked) => handleSelectAllInGroup(grup, checked)}
                                />
                                <Label htmlFor={`select-all-${grup.namaKelas}`} className="text-sm font-medium">
                                  Pilih Semua ({grup.asesi.length})
                                </Label>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-blue-600 border-blue-300 hover:bg-blue-50"
                                // Tombol mati jika sisa slot 0
                                disabled={sisaSlotReal <= 0}
                                onClick={() => handleSelectSisaKapasitas(grup)}
                              >
                                {/* Tampilkan sisa slot yang sebenarnya */}
                                Pilih Cepat (Sisa {sisaSlotReal})
                              </Button>
                            </div>
                            {/* ========================================================== */}
                            {/* --- BATAS BLOK KONTROL BARU --- */}
                            {/* ========================================================== */}

                            {grup.asesi.map(asesi => (
                              <div key={asesi.id} className="flex items-center gap-3 p-2 border rounded-md">
                                <Checkbox 
                                  id={`avail-${asesi.id}`}
                                  checked={selectedAvailable.has(asesi.id)}
                                  onCheckedChange={(checked) => handleSelectAvailable(asesi.id, checked)}
                                />
                                <Label htmlFor={`avail-${asesi.id}`} className="flex-1 cursor-pointer">
                                  <p className="font-medium text-sm">{asesi.nama}</p>
                                  <p className="text-xs text-muted-foreground">{asesi.nim}</p>
                                </Label>
                              </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Kolom Kanan: Peserta Sesi Ini (Pake Checkbox) */}
          <Card>
            <CardHeader>
              <CardTitle>Peserta Sesi Ini ({plottedAsesi.length})</CardTitle>
              <CardDescription>Daftar asesi yang akan mengikuti sesi di ruangan ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pr-2">
               {/* --- (PERUBAHAN 11: Tambah gap-2) --- */}
               <div className="flex items-center justify-between gap-2 p-3 border-b">
               {/* --- (Batas Perubahan 11) --- */}
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="select-all-plotted"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPlotted(new Set(plottedAsesi.map(a => a.id)))
                      } else {
                        setSelectedPlotted(new Set())
                      }
                    }}
                    checked={selectedPlotted.size === plottedAsesi.length && plottedAsesi.length > 0}
                  />
                  <Label htmlFor="select-all-plotted" className="font-normal text-sm">Pilih Semua ({selectedPlotted.size})</Label>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={unplotSelected}
                  disabled={selectedPlotted.size === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Terpilih
                </Button>
              </div>
              
              <div className="max-h-80 overflow-y-auto space-y-2 pt-2">
                {plottedAsesi.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Belum ada peserta.</p>}
                {plottedAsesi.map(asesi => (
                  <div key={asesi.id} className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50">
                    <Checkbox 
                      id={`plot-${asesi.id}`}
                      checked={selectedPlotted.has(asesi.id)}
                      onCheckedChange={(checked) => handleSelectPlotted(asesi.id, checked)}
                    />
                    <Label htmlFor={`plot-${asesi.id}`} className="flex-1 cursor-pointer">
                      <p className="font-medium text-sm text-blue-900">{asesi.nama}</p>
                      <p className="text-xs text-blue-700">{asesi.nim}</p>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tombol Simpan */}
        <div className="flex justify-end">
            <Button size="lg" onClick={handleSavePlotting} disabled={isSaving}>
                {isSaving ? <Spinner className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Simpan Plotting Peserta
            </Button>
        </div>

      </div>

      {/* --- (PERUBAHAN 12: Tambahkan Dialog Notifikasi) --- */}
      <AlertDialog open={infoDialog.open} onOpenChange={() => setInfoDialog({ open: false, title: "", message: "" })}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{infoDialog.title || "Informasi"}</AlertDialogTitle>
            <AlertDialogDescription>
              {infoDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              // Jalankan fungsi onConfirm (untuk redirect) jika ada
              if (typeof infoDialog.onConfirm === 'function') {
                infoDialog.onConfirm();
              }
              setInfoDialog({ open: false, title: "", message: "" });
            }}>
              Oke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* --- (Batas Perubahan 12) --- */}

    </MainLayout>
  )
}