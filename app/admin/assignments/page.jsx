"use client"

import React, { useEffect, useState, useMemo } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// --- (IMPORT FUNGSI BARU) ---
import { 
  mockGetAsesiUsers, 
  mockGetAsesorUsers, 
  mockGetUnitsForSkema, 
  mockAssignAsesorPerUnit,
  mockGetAllSkema // <-- IMPORT FUNGSI BARU
} from "@/lib/api-mock"
import { Skeleton } from "@/components/ui/skeleton"
import { Save, Search, ChevronLeft, ChevronRight, User, Sparkles } from "lucide-react"
import { Spinner } from "@/components/ui/spinner" 

const ITEMS_PER_PAGE = 20; 

// ====================================================================
// Komponen SingleAssignmentTable (Praktikum & Unjuk Diri)
// (TIDAK BERUBAH)
// ====================================================================
const SingleAssignmentTable = ({ asesiList, asesorList, tipeUjian, onSave }) => {
  const [assignments, setAssignments] = useState({}) // State lokal: { "asesiId": "asesorId" }
  const [savingAsesiId, setSavingAsesiId] = useState(null)

  const handleSave = async (asesiId) => {
    setSavingAsesiId(asesiId);
    const asesorId = assignments[asesiId];
    if (!asesorId) {
      alert("Pilih seorang asesor terlebih dahulu.");
      setSavingAsesiId(null);
      return;
    }
    
    await onSave(asesiId, [{
      tipe: tipeUjian,
      unitId: null,
      asesorId: asesorId
    }]);
    
    setSavingAsesiId(null);
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[40%]">Asesi</TableHead>
            <TableHead className="w-[40%]">Asesor Penilai</TableHead>
            <TableHead className="w-[20%] text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asesiList.map(asesi => (
            <TableRow key={asesi.id} className="hover:bg-gray-50">
              <TableCell>
                <p className="font-medium text-gray-900">{asesi.nama}</p>
                <p className="text-sm text-gray-500">{asesi.nim}</p>
              </TableCell>
              <TableCell>
                <Select
                  value={assignments[asesi.id] || ""}
                  onValueChange={(value) => setAssignments(prev => ({ ...prev, [asesi.id]: value }))}
                >
                  <SelectTrigger className="bg-gray-50 w-full">
                    <SelectValue placeholder="-- Pilih Asesor --" />
                  </SelectTrigger>
                  <SelectContent>
                    {asesorList.map(asesor => (
                      <SelectItem key={asesor.id} value={asesor.id}>
                        {asesor.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  size="sm"
                  onClick={() => handleSave(asesi.id)}
                  disabled={savingAsesiId === asesi.id}
                >
                  {savingAsesiId === asesi.id ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


// ====================================================================
// Komponen Utama Halaman
// ====================================================================
export default function AssignmentsPage() {
  // --- (STATE LAMA) ---
  const [skemaId, setSkemaId] = useState("") // <-- Ubah default jadi string kosong
  const [tipeUjian, setTipeUjian] = useState("TEORI")
  
  const [allAsesi, setAllAsesi] = useState([])
  const [allAsesor, setAllAsesor] = useState([])
  const [units, setUnits] = useState([])
  
  const [asesiList, setAsesiList] = useState([])
  const [asesorList, setAsesorList] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [savingAsesiId, setSavingAsesiId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [teoriAssignments, setTeoriAssignments] = useState({}) 
  
  const [selectedBulkClass, setSelectedBulkClass] = useState("")
  const [selectedBulkAsesor, setSelectedBulkAsesor] = useState("")
  const [selectedBulkUnitStart, setSelectedBulkUnitStart] = useState("")
  const [selectedBulkUnitEnd, setSelectedBulkUnitEnd] = useState("")

  // --- (STATE BARU UNTUK LIST SKEMA) ---
  const [skemaList, setSkemaList] = useState([]);
  const [loadingSkema, setLoadingSkema] = useState(true);

  // --- (PERUBAHAN DI SINI: Panggil loadSkemaList) ---
  useEffect(() => {
    loadMasterData();
    loadSkemaList(); // Panggil fungsi baru
  }, [])

  // --- (PERUBAHAN DI SINI: Cek skemaId) ---
  useEffect(() => {
    if (skemaId) { // Hanya jalankan jika skemaId sudah terisi
      loadSkemaData();
    }
  }, [skemaId])

  // --- (PERUBAHAN DI SINI: Cek skemaId) ---
  useEffect(() => {
    if (!skemaId) return; // Jangan filter jika skemaId masih kosong

    const filteredAsesi = allAsesi.filter(a => a.skemaId === skemaId)
    setAsesiList(filteredAsesi)
    const filteredAsesor = allAsesor.filter(a => a.skemaKeahlian && a.skemaKeahlian.includes(skemaId))
    setAsesorList(filteredAsesor)
    setCurrentPage(1);
    
    setSelectedBulkClass("")
    setSelectedBulkAsesor("")
    setSelectedBulkUnitStart("")
    setSelectedBulkUnitEnd("")

  }, [skemaId, allAsesi, allAsesor]) // Tetap dependency-nya

  // --- (FUNGSI BARU UNTUK LOAD SKEMA) ---
  const loadSkemaList = async () => {
    try {
      setLoadingSkema(true);
      const data = await mockGetAllSkema();
      setSkemaList(data);
      if (data.length > 0) {
        setSkemaId(data[0].id); // Otomatis set skema pertama sebagai default
      }
    } catch (error) {
      console.error("Error loading skema list:", error);
    } finally {
      setLoadingSkema(false);
    }
  };
  // --- (BATAS FUNGSI BARU) ---

  const loadMasterData = async () => {
    try {
      setLoading(true)
      const [asesiData, asesorData] = await Promise.all([
        mockGetAsesiUsers(),
        mockGetAsesorUsers(),
      ])
      setAllAsesi(asesiData)
      setAllAsesor(asesorData)
    } catch (error) {
      console.error("Error loading master data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadSkemaData = async () => {
    try {
      setLoading(true)
      const unitsData = await mockGetUnitsForSkema(skemaId)
      setUnits(unitsData)
    } catch (error) {
      console.error("Error loading skema data:", error)
    } finally {
      setLoading(false)
    }
  }

  // (Sisa logic di bawah ini tidak ada yang berubah)
  // ...
  const kelasList = useMemo(() => {
    const kelasSet = new Set(asesiList.map(a => a.kelas).filter(Boolean));
    return Array.from(kelasSet).sort();
  }, [asesiList]);

  const unitOptions = useMemo(() => {
    return units.map(u => ({ 
      value: u.nomorUnit,
      label: `Unit ${u.nomorUnit}: ${u.judul}` 
    }));
  }, [units]);
  
  const filteredAsesi = useMemo(() => {
    return asesiList.filter((a) => 
        a.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.nim && a.nim.includes(searchTerm))
    )
  }, [asesiList, searchTerm])

  const paginatedAsesi = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredAsesi.slice(start, end)
  }, [filteredAsesi, currentPage])

  const totalPages = Math.ceil(filteredAsesi.length / ITEMS_PER_PAGE)

  const handleTeoriAssignmentChange = (asesiId, unitId, asesorId) => {
    setTeoriAssignments(prev => ({
      ...prev,
      [`${asesiId}-${unitId}`]: asesorId
    }))
  }

  const handleSaveAssignments = async (asesiId, assignmentsData) => {
    setSavingAsesiId(asesiId); 
    
    if (assignmentsData.length === 0) {
      alert("Belum ada asesor yang ditugaskan untuk asesi ini.")
      setSavingAsesiId(null)
      return
    }

    try {
      await mockAssignAsesorPerUnit(asesiId, assignmentsData) 
      alert(`Penugasan untuk asesi (ID: ${asesiId}) berhasil disimpan!`)
    } catch (error)
 {
      console.error("Error saving assignments:", error)
      alert("Gagal menyimpan penugasan")
    } finally {
      setSavingAsesiId(null) 
    }
  }
  
  const handleSaveTeori = (asesiId) => {
    const assignmentsForAsesi = units.map(unit => ({
      unitId: unit.nomorUnit,
      tipe: "TEORI",
      asesorId: teoriAssignments[`${asesiId}-${unit.id}`] || null
    })).filter(a => a.asesorId); 

    handleSaveAssignments(asesiId, assignmentsForAsesi)
  }

  const handleBulkAssign = () => {
    if (!selectedBulkClass || !selectedBulkAsesor || !selectedBulkUnitStart || !selectedBulkUnitEnd) {
      alert("Harap lengkapi semua field 'Bulk Assign' (Kelas, Asesor, dan rentang Unit).");
      return;
    }

    const startUnitNum = parseInt(selectedBulkUnitStart);
    const endUnitNum = parseInt(selectedBulkUnitEnd);

    if (startUnitNum > endUnitNum) {
      alert("Unit Awal tidak boleh lebih besar dari Unit Akhir.");
      return;
    }

    const asesiInClass = asesiList
      .filter(a => a.kelas === selectedBulkClass)
      .map(a => a.id);
    
    const unitsToAssign = units
      .filter(u => u.nomorUnit >= startUnitNum && u.nomorUnit <= endUnitNum)
      .map(u => u.id); 

    if (asesiInClass.length === 0) {
      alert("Tidak ada asesi di kelas ini.");
      return;
    }

    if (unitsToAssign.length === 0) {
      alert("Tidak ada unit yang valid dalam rentang tersebut.");
      return;
    }

    const newAssignments = { ...teoriAssignments };
    
    for (const asesiId of asesiInClass) {
      for (const unitId of unitsToAssign) {
        const assignmentKey = `${asesiId}-${unitId}`;
        newAssignments[assignmentKey] = selectedBulkAsesor; 
      }
    }

    setTeoriAssignments(newAssignments);

    const asesorNama = asesorList.find(a => a.id === selectedBulkAsesor)?.nama || "Asesor";
    alert(`Berhasil menerapkan ${asesorNama} ke ${unitsToAssign.length} unit untuk ${asesiInClass.length} asesi di kelas ${selectedBulkClass}.`);
    
    setSelectedBulkClass("");
    setSelectedBulkAsesor("");
    setSelectedBulkUnitStart("");
    setSelectedBulkUnitEnd("");
  }
  
  // ...
  // (Sisa logic di atas tidak berubah)
  // ...

  return (
    <MainLayout>
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Penugasan Asesor</h1>
          <p className="text-gray-600 mt-1">
            Atur penugasan asesor untuk Ujian Teori (per unit), Ujian Praktikum (umum), dan Unjuk Diri (umum).
          </p>
        </div>

        {/* Filters Card */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* --- (BLOK INI YANG BERUBAH TOTAL) --- */}
              <div>
                <label className="text-sm font-medium block mb-1.5">Skema</label>
                <Select 
                  value={skemaId} 
                  onValueChange={setSkemaId}
                  disabled={loadingSkema} // <-- Tambah disable
                >
                  <SelectTrigger className="border-gray-300 bg-white">
                    <SelectValue placeholder="Memuat skema..." />
                  </SelectTrigger>
                  <SelectContent>
                    {skemaList.length === 0 && !loadingSkema ? (
                      <SelectItem value="" disabled>Tidak ada skema</SelectItem>
                    ) : (
                      skemaList.map(skema => (
                        <SelectItem key={skema.id} value={skema.id}>
                          {skema.judul} ({skema.id})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              {/* --- (BATAS PERUBAHAN) --- */}

              {/* Search Asesi (Tidak berubah) */}
              <div>
                 <label className="text-sm font-medium block mb-1.5">Cari Asesi</label>
                 <div className="relative">
                   <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                   <Input 
                      placeholder="Cari nama atau NIM..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-10 h-10"
                  />
                </div>
              </div>
            </div>
            
            {/* Tipe Ujian Tabs (Tidak berubah) */}
            <Tabs value={tipeUjian} onValueChange={setTipeUjian}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="TEORI">Ujian Teori (Per Unit)</TabsTrigger>
                <TabsTrigger value="PRAKTIKUM">Ujian Praktikum (Umum)</TabsTrigger>
                <TabsTrigger value="UNJUK_DIRI">Unjuk Diri (Umum)</TabsTrigger>
              </TabsList>
            </Tabs>

          </CardContent>
        </Card>

        {/* Card Konten Dinamis berdasarkan Tab */}
        <Card>
          <CardHeader>
            <CardTitle>Penugasan Skema {skemaId} - {tipeUjian}</CardTitle>
            <CardDescription>
              Menampilkan {paginatedAsesi.length} dari {filteredAsesi.length} asesi.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <>
                
                {/* Tampilan Matrix untuk TEORI (Tidak berubah) */}
                {tipeUjian === 'TEORI' && (
                  <div className="space-y-4">
                    
                    {/* Bulk Assign (Tidak berubah) */}
                    <div className="p-4 border-b">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                        Bulk Assign (Khusus Teori)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {/* 1. Pilih Kelas */}
                        <Select value={selectedBulkClass} onValueChange={setSelectedBulkClass}>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Pilih Kelas --" />
                          </SelectTrigger>
                          <SelectContent>
                            {kelasList.map(kelas => (
                              <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* 2. Pilih Asesor */}
                        <Select value={selectedBulkAsesor} onValueChange={setSelectedBulkAsesor}>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Pilih Asesor --" />
                          </SelectTrigger>
                          <SelectContent>
                            {asesorList.map(asesor => (
                              <SelectItem key={asesor.id} value={asesor.id}>{asesor.nama}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* 3. Dari Unit */}
                        <Select value={selectedBulkUnitStart} onValueChange={setSelectedBulkUnitStart}>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Dari Unit --" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions.map(u => (
                              <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* 4. Sampai Unit */}
                        <Select value={selectedBulkUnitEnd} onValueChange={setSelectedBulkUnitEnd}>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Sampai Unit --" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions.map(u => (
                              <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* 5. Tombol Terapkan */}
                        <Button
                          onClick={handleBulkAssign}
                          disabled={!selectedBulkClass || !selectedBulkAsesor || !selectedBulkUnitStart || !selectedBulkUnitEnd}
                        >
                          Terapkan ke Kelas
                        </Button>
                      </div>
                    </div>

                    {/* Matrix Table (Tidak berubah) */}
                    <div className="overflow-x-auto">
                      <Table className="min-w-max">
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="sticky left-0 bg-gray-50 z-10 w-[250px]">Asesi</TableHead>
                            {units.map(unit => (
                              <TableHead key={unit.id} className="w-[200px]">
                                Unit {unit.nomorUnit}: {unit.judul}
                              </TableHead>
                            ))}
                            <TableHead className="sticky right-0 bg-gray-50 z-10 w-[120px] text-center">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedAsesi.map(asesi => (
                            <TableRow key={asesi.id} className="hover:bg-gray-50">
                              <TableCell className="sticky left-0 bg-white hover:bg-gray-50 z-10 w-[250px]">
                                <p className="font-medium text-gray-900">{asesi.nama}</p>
                                <p className="text-sm text-gray-500">{asesi.nim}</p>
                                {asesi.kelas && <span className="text-xs text-blue-600 font-medium">{asesi.kelas}</span>}
                              </TableCell>
                              {units.map(unit => {
                                 const assignmentKey = `${asesi.id}-${unit.id}`
                                 const currentAsesorId = teoriAssignments[assignmentKey] || "" 
                                 return (
                                   <TableCell key={unit.id} className="w-[200px]">
                                     <Select
                                        value={currentAsesorId}
                                        onValueChange={(value) => handleTeoriAssignmentChange(asesi.id, unit.id, value)}
                                      >
                                        <SelectTrigger className="bg-gray-50 w-full">
                                          <SelectValue placeholder="-- Pilih Asesor --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {asesorList.map(asesor => (
                                            <SelectItem key={asesor.id} value={asesor.id}>
                                              {asesor.nama}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                   </TableCell>
                                 )
                              })}
                              <TableCell className="sticky right-0 bg-white hover:bg-gray-50 z-10 w-[120px] text-center">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveTeori(asesi.id)}
                                  disabled={savingAsesiId === asesi.id}
                                >
                                  {savingAsesiId === asesi.id ? <Spinner className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
                
                {/* Tampilan List Sederhana untuk PRAKTIKUM (Tidak berubah) */}
                {tipeUjian === 'PRAKTIKUM' && (
                  <SingleAssignmentTable 
                    asesiList={paginatedAsesi} 
                    asesorList={asesorList}
                    tipeUjian="PRAKTIKUM"
                    onSave={handleSaveAssignments}
                  />
                )}
                
                {/* Tampilan List Sederhana untuk UNJUK DIRI (Tidak berubah) */}
                {tipeUjian === 'UNJUK_DIRI' && (
                  <SingleAssignmentTable 
                    asesiList={paginatedAsesi} 
                    asesorList={asesorList}
                    tipeUjian="UNJUK_DIRI"
                    onSave={handleSaveAssignments}
                  />
                )}
                
              </>
            )}
            {paginatedAsesi.length === 0 && !loading && (
                 <div className="text-center py-12 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-2" />
                    Tidak ada asesi yang cocok dengan filter.
                 </div>
            )}
          </CardContent>
          
          {/* Pagination Footer (Tidak berubah) */}
          {totalPages > 1 && (
            <CardFooter className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  Berikutnya
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          )}

        </Card>
      </div>
    </MainLayout>
  )
}