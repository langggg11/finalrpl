"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
// --- (IMPORT FUNGSI BARU) ---
import { 
  mockGetLinimasa, 
  mockGetSesiUjianOffline, 
  mockCreateSesiUjianOffline,
  mockGetAllSkema // <-- IMPORT FUNGSI BARU
} from "@/lib/api-mock";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { Spinner } from "@/components/ui/spinner"; // <-- Import Spinner

export default function TimelinePage() {
  const [skemaId, setSkemaId] = useState(""); // <-- Ubah default jadi string kosong
  const [linimasa, setLinimasa] = useState([]);
  const [sesiUjian, setSesiUjian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("linimasa");

  // --- (STATE BARU UNTUK LIST SKEMA) ---
  const [skemaList, setSkemaList] = useState([]);
  const [loadingSkema, setLoadingSkema] = useState(true);

  // Dialog states
  const [isLinimasaDialogOpen, setIsLinimasaDialogOpen] = useState(false);
  const [isSesiDialogOpen, setIsSesiDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // <-- Tambah state saving
  const [editingLinimasa, setEditingLinimasa] = useState(null);
  const [editingSesi, setEditingSesi] = useState(null);

  // Form states
  const [linimasaForm, setLinimasaForm] = useState({
    judul: "",
    deskripsi: "",
    tanggal: "",
    waktu: "",
    tipe: "PEMBELAJARAN",
    urlZoom: "",
  });

  const [sesiForm, setSesiForm] = useState({
    tanggal: "",
    waktu: "",
    tipeUjian: "TEORI",
    ruangan: "",
    kapasitas: "",
  });

  // --- (PERUBAHAN DI SINI: Panggil loadSkemaList) ---
  useEffect(() => {
    loadSkemaList(); // Panggil fungsi baru
  }, []);

  // --- (PERUBAHAN DI SINI: Cek skemaId) ---
  useEffect(() => {
    if (skemaId) { // Hanya jalankan jika skemaId sudah terisi
      loadData();
    }
  }, [skemaId]);

  // --- (FUNGSI BARU UNTUK LOAD SKEMA) ---
  const loadSkemaList = async () => {
    try {
      setLoadingSkema(true);
      const data = await mockGetAllSkema();
      setSkemaList(data);
      if (data.length > 0) {
        setSkemaId(data[0].id); // Otomatis set skema pertama sebagai default
      } else {
        setLoading(false); // Gak ada skema, stop loading utama
      }
    } catch (error) {
      console.error("[v0] Error loading skema list:", error);
      setLoading(false); // Stop loading utama jika error
    } finally {
      setLoadingSkema(false);
    }
  };
  // --- (BATAS FUNGSI BARU) ---

  const loadData = async () => {
    try {
      setLoading(true);
      const [linimasaData, sesiData] = await Promise.all([
        mockGetLinimasa(skemaId), 
        mockGetSesiUjianOffline(skemaId)
      ]);
      setLinimasa(linimasaData);
      setSesiUjian(sesiData);
    } catch (error) {
      console.error("[v0] Error loading timeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLinimasa = () => {
    if (!linimasaForm.judul || !linimasaForm.tanggal) {
      alert("Judul dan tanggal wajib diisi");
      return;
    }
    // TODO: Panggil API create/update linimasa
    setIsSaving(true); // <-- Tambah
    console.log("[v0] Saving linimasa:", linimasaForm);
    alert("CRUD Linimasa belum diimplementasikan.");
    setIsLinimasaDialogOpen(false);
    setLinimasaForm({
      judul: "", deskripsi: "", tanggal: "", waktu: "", tipe: "PEMBELAJARAN", urlZoom: "",
    });
    setIsSaving(false); // <-- Tambah
    // Harusnya panggil loadData() lagi
  };

  const handleSaveSesi = async () => {
    if (!sesiForm.tanggal || !sesiForm.waktu || !sesiForm.ruangan || !sesiForm.kapasitas) {
      alert("Semua field wajib diisi");
      return;
    }
    try {
      setIsSaving(true); // <-- Tambah
      const newSesi = await mockCreateSesiUjianOffline({
        skemaId,
        tanggal: new Date(sesiForm.tanggal),
        waktu: sesiForm.waktu,
        tipeUjian: sesiForm.tipeUjian,
        ruangan: sesiForm.ruangan,
        kapasitas: Number.parseInt(sesiForm.kapasitas),
      });
      // Panggil loadData() biar konsisten
      await loadData();
      setIsSesiDialogOpen(false);
      setSesiForm({
        tanggal: "", waktu: "", tipeUjian: "TEORI", ruangan: "", kapasitas: "",
      });
    } catch (error) {
      console.error("[v0] Error saving sesi:", error);
      alert("Gagal menyimpan sesi ujian");
    } finally {
      setIsSaving(false); // <-- Tambah
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const getTipeLabel = (tipe) => {
    const labels = {
      PEMBELAJARAN: "🎓 Pembelajaran",
      UJIAN: "📝 Ujian",
      PENGUMUMAN: "📢 Pengumuman",
      SESI_OFFLINE: "📍 Sesi Offline",
      LAINNYA: "📌 Lainnya",
    };
    return labels[tipe] || tipe;
  };

  const getExamTypeLabel = (tipe) => {
    const labels = {
      TEORI: "Ujian Teori",
      PRAKTIKUM: "Ujian Praktikum",
      UNJUK_DIRI: "Ujian Unjuk Diri",
    };
    return labels[tipe];
  };

  const getExamTypeColor = (tipe) => {
    const colors = {
      TEORI: "bg-blue-100 text-blue-800",
      PRAKTIKUM: "bg-orange-100 text-orange-800",
      UNJUK_DIRI: "bg-purple-100 text-purple-800",
    };
    return colors[tipe];
  };

  return (
    <MainLayout>
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Jadwal & Kegiatan</h1>
          <p className="text-gray-600 mt-1">Atur linimasa pembelajaran, sesi ujian online, dan ujian offline untuk peserta</p>
        </div>

        {/* Skema Selector */}
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold text-gray-900">Skema:</label>
                
                {/* --- (BLOK INI YANG BERUBAH TOTAL) --- */}
                <Select 
                  value={skemaId} 
                  onValueChange={(value) => setSkemaId(value)}
                  disabled={loadingSkema} // <-- Tambah disable
                >
                  <SelectTrigger className="w-72 border-gray-300 bg-white">
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
                {/* --- (BATAS PERUBAHAN) --- */}

              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setEditingLinimasa(null);
                    setLinimasaForm({
                      judul: "", deskripsi: "", tanggal: "", waktu: "", tipe: "PEMBELAJARAN", urlZoom: "",
                    });
                    setIsLinimasaDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kegiatan
                </Button>
                <Button
                  onClick={() => {
                    setEditingSesi(null);
                    setSesiForm({
                      tanggal: "", waktu: "", tipeUjian: "TEORI", ruangan: "", kapasitas: "",
                    });
                    setIsSesiDialogOpen(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Sesi Ujian Offline
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white border-b border-gray-200 p-0 h-auto rounded-none">
            <TabsTrigger value="linimasa" className="border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none px-4 py-3">
              Linimasa Kegiatan {!loading && <span className="ml-2 text-xs">({linimasa.length})</span>}
            </TabsTrigger>
            <TabsTrigger value="sesi" className="border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none px-4 py-3">
              Sesi Ujian Offline {!loading && <span className="ml-2 text-xs">({sesiUjian.length})</span>}
            </TabsTrigger>
          </TabsList>

          {/* Linimasa Tab (Manajemen Zoom) */}
          <TabsContent value="linimasa" className="space-y-4">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Linimasa Kegiatan {skemaId}</CardTitle>
                <CardDescription>Jadwal pembelajaran, pengumuman, dan kegiatan penting lainnya</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : linimasa.length === 0 ? (
                  <Alert>
                    <AlertDescription>Belum ada kegiatan yang dijadwalkan untuk skema ini.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {linimasa
                      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
                      .map((item) => (
                        <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              {/* --- Icon logic disederhanakan --- */}
                              {item.tipe === "PEMBELAJARAN" ? <span className="text-xl">🎓</span> : <span className="text-xl">📢</span>}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900">{item.judul}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.deskripsi}</p>

                            <div className="flex flex-wrap gap-4 mt-3">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(item.tanggal)}</span>
                              </div>
                              {item.waktu && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>{item.waktu}</span>
                                </div>
                              )}
                              {item.urlZoom && (
                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-blue-600 hover:bg-transparent hover:text-blue-700" asChild>
                                  <a href={item.urlZoom} target="_blank" rel="noopener noreferrer">
                                    <Video className="w-3 h-3 mr-1" />
                                    Zoom Link
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingLinimasa(item);
                                setLinimasaForm({
                                  judul: item.judul,
                                  deskripsi: item.deskripsi,
                                  tanggal: new Date(item.tanggal).toISOString().split("T")[0],
                                  waktu: item.waktu || "",
                                  tipe: item.tipe,
                                  urlZoom: item.urlZoom || "",
                                });
                                setIsLinimasaDialogOpen(true);
                              }}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => console.log("[v0] Delete linimasa:", item.id)} className="text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sesi Ujian Offline Tab (Manajemen Plotting) */}
          <TabsContent value="sesi" className="space-y-4">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Sesi Ujian Offline {skemaId}</CardTitle>
                <CardDescription>Jadwal ujian offline dengan ruangan dan kapasitas tertentu</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : sesiUjian.length === 0 ? (
                  <Alert>
                    <AlertDescription>Belum ada sesi ujian offline yang dijadwalkan untuk skema ini. Buat sesi baru untuk mulai menjadwalkan ujian offline.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {sesiUjian
                      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
                      .map((sesi) => (
                        <div key={sesi.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-10 h-10 rounded-lg ${getExamTypeColor(sesi.tipeUjian)} flex items-center justify-center`}>
                              {sesi.tipeUjian === "TEORI" && <span className="text-lg">📝</span>}
                              {sesi.tipeUjian === "PRAKTIKUM" && <span className="text-lg">💻</span>}
                              {sesi.tipeUjian === "UNJUK_DIRI" && <span className="text-lg">🎤</span>}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{getExamTypeLabel(sesi.tipeUjian)}</h4>
                              <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${getExamTypeColor(sesi.tipeUjian)}`}>{getExamTypeLabel(sesi.tipeUjian)}</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <div>
                                  <p className="text-xs text-gray-500">Tanggal</p>
                                  <p className="font-medium">{formatDate(sesi.tanggal)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <div>
                                  <p className="text-xs text-gray-500">Waktu</p>
                                  <p className="font-medium">{sesi.waktu}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <div>
                                  <p className="text-xs text-gray-500">Ruangan</p>
                                  <p className="font-medium">{sesi.ruangan}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Users className="w-4 h-4 text-gray-500" />
                                <div>
                                  <p className="text-xs text-gray-500">Kapasitas</p>
                                  <p className="font-medium">{sesi.kapasitas} Peserta</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent" asChild>
                              <a href={`/admin/offline-exam/${sesi.id}`}>Atur Peserta</a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingSesi(sesi);
                                setSesiForm({
                                  tanggal: new Date(sesi.tanggal).toISOString().split("T")[0],
                                  waktu: sesi.waktu,
                                  tipeUjian: sesi.tipeUjian,
                                  ruangan: sesi.ruangan,
                                  kapasitas: String(sesi.kapasitas),
                                });
                                setIsSesiDialogOpen(true);
                              }}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => console.log("[v0] Delete sesi:", sesi.id)} className="text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Linimasa Dialog */}
      <Dialog open={isLinimasaDialogOpen} onOpenChange={setIsLinimasaDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingLinimasa ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}</DialogTitle>
            <DialogDescription className="text-sm">{editingLinimasa ? "Ubah jadwal dan detail kegiatan" : "Buat kegiatan baru dalam linimasa pembelajaran"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-900">Judul Kegiatan *</label>
              <Input placeholder="Contoh: Sesi Pembelajaran Unit 1" value={linimasaForm.judul} onChange={(e) => setLinimasaForm({ ...linimasaForm, judul: e.target.value })} className="mt-1 border-gray-300" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Deskripsi *</label>
              <Textarea placeholder="Jelaskan detail kegiatan ini" value={linimasaForm.deskripsi} onChange={(e) => setLinimasaForm({ ...linimasaForm, deskripsi: e.target.value })} rows={3} className="mt-1 border-gray-300" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Tipe Kegiatan *</label>
              <Select value={linimasaForm.tipe} onValueChange={(value) => setLinimasaForm({ ...linimasaForm, tipe: value })}>
                <SelectTrigger className="mt-1 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEMBELAJARAN">🎓 Pembelajaran</SelectItem>
                  <SelectItem value="UJIAN">📝 Ujian</SelectItem>
                  <SelectItem value="PENGUMUMAN">📢 Pengumuman</SelectItem>
                  <SelectItem value="LAINNYA">📌 Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Tanggal *</label>
              <Input type="date" value={linimasaForm.tanggal} onChange={(e) => setLinimasaForm({ ...linimasaForm, tanggal: e.target.value })} className="mt-1 border-gray-300" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Waktu (opsional)</label>
              <Input type="time" value={linimasaForm.waktu} onChange={(e) => setLinimasaForm({ ...linimasaForm, waktu: e.target.value })} className="mt-1 border-gray-300" />
            </div>
            {linimasaForm.tipe === "PEMBELAJARAN" && (
              <div>
                <label className="text-sm font-medium text-gray-900">Link Zoom (opsional)</label>
                <Input placeholder="https://zoom.us/j/..." value={linimasaForm.urlZoom} onChange={(e) => setLinimasaForm({ ...linimasaForm, urlZoom: e.target.value })} className="mt-1 border-gray-300" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinimasaDialogOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button onClick={handleSaveLinimasa} className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
              {isSaving ? <Spinner className="w-4 h-4 mr-2" /> : "Simpan Kegiatan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sesi Ujian Dialog */}
      <Dialog open={isSesiDialogOpen} onOpenChange={setIsSesiDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSesi ? "Edit Sesi Ujian" : "Tambah Sesi Ujian Offline"}</DialogTitle>
            <DialogDescription className="text-sm">{editingSesi ? "Ubah jadwal dan detail sesi ujian offline" : `Buat jadwal baru untuk skema ${skemaId}`}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-900">Tipe Ujian *</label>
              <Select value={sesiForm.tipeUjian} onValueChange={(value) => setSesiForm({ ...sesiForm, tipeUjian: value })}>
                <SelectTrigger className="mt-1 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEORI">📝 Ujian Teori</SelectItem>
                  <SelectItem value="PRAKTIKUM">💻 Ujian Praktikum</SelectItem>
                  <SelectItem value="UNJUK_DIRI">🎤 Ujian Unjuk Diri</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Tanggal *</label>
              <Input type="date" value={sesiForm.tanggal} onChange={(e) => setSesiForm({ ...sesiForm, tanggal: e.target.value })} className="mt-1 border-gray-300" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Waktu *</label>
              <Input type="time" value={sesiForm.waktu} onChange={(e) => setSesiForm({ ...sesiForm, waktu: e.target.value })} className="mt-1 border-gray-300" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Ruangan *</label>
              <Input placeholder="Contoh: Ruang Ujian A - Lantai 2" value={sesiForm.ruangan} onChange={(e) => setSesiForm({ ...sesiForm, ruangan: e.target.value })} className="mt-1 border-gray-300" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">Kapasitas *</label>
              <Input type="number" placeholder="30" value={sesiForm.kapasitas} onChange={(e) => setSesiForm({ ...sesiForm, kapasitas: e.target.value })} className="mt-1 border-gray-300" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSesiDialogOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button onClick={handleSaveSesi} className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
              {isSaving ? <Spinner className="w-4 h-4 mr-2" /> : "Simpan Sesi Ujian"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}