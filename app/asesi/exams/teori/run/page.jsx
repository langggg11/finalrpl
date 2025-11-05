"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { mockGetSoalForUnit, mockGetUnitsForSkema, mockSubmitUjianTeori } from "@/lib/api-mock"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Clock } from "lucide-react"

// Fungsi helper untuk kunci localStorage yang unik per user & skema
const getExamStorageKey = (userId, skemaId) => `teori_exam_progress_${userId}_${skemaId}`;

export default function TeoriExamRunPage() {
  const { user, loading: isAuthLoading } = useAuth()
  const router = useRouter()

  const [units, setUnits] = useState([])
  const [soal, setSoal] = useState([])
  const [unitDetails, setUnitDetails] = useState([]) 
  
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  // State yang akan di-persist (disimpan)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isExamActive, setIsExamActive] = useState(false)
  
  // Flag untuk menandai data sudah dipulihkan (agar tidak save prematur)
  const [isRestored, setIsRestored] = useState(false)

  // Buat kunci storage yang unik
  const storageKey = useMemo(() => {
    if (!user) return null
    return getExamStorageKey(user.id, user.skemaId)
  }, [user])

  // Fungsi untuk membersihkan data ujian dari storage
  const clearExamState = useCallback(() => {
    if (storageKey) {
      localStorage.removeItem(storageKey)
    }
  }, [storageKey])

  // Fungsi Submit Ujian
  const handleSubmitExam = useCallback(async () => {
    if (!user) return;
    
    // Set status tidak aktif agar timer berhenti
    setIsExamActive(false)
    
    console.log("Ujian Teori submitted with answers:", answers)
    await mockSubmitUjianTeori(user.id, answers);
    
    clearExamState(); // Hapus data ujian dari localStorage
    
    alert("Ujian Teori selesai! Jawaban Anda telah dikirim untuk dinilai.")
    router.push("/asesi/exams")
  }, [answers, user, router, clearExamState])

  // Efek Samping: Timer Ujian
  useEffect(() => {
    // Hanya jalankan jika ujian aktif DAN data sudah dipulihkan
    if (!isExamActive || !isRestored) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitExam() // Auto-submit saat waktu habis
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [isExamActive, isRestored, handleSubmitExam])

  // Efek Samping: Memuat data ujian (termasuk memulihkan progres)
  useEffect(() => {
    if (isAuthLoading) return; // Tunggu auth selesai
    if (!user) {
      router.push("/login");
      return;
    }
    if (!storageKey) return; // Tunggu storageKey siap

    const loadExamData = async () => {
      try {
        setLoading(true)
        const skemaId = user.skemaId || "ADS"
        const unitsData = await mockGetUnitsForSkema(skemaId)
        setUnits(unitsData)

        // Hitung durasi total dari semua unit
        const totalDurasiMenit = unitsData.reduce((sum, unit) => sum + (unit.durasiTeori || 15), 0)
        const totalDurationInSeconds = totalDurasiMenit * 60
        
        // Ambil semua soal
        const allSoalPromises = unitsData.map(unit => mockGetSoalForUnit(unit.id, "UJIAN_TEORI"))
        const allSoalArrays = await Promise.all(allSoalPromises)
        const combinedSoal = allSoalArrays.flat()
        setSoal(combinedSoal)
        
        // Buat detail untuk layar Pre-Start
        const details = unitsData.map((unit, index) => ({
          ...unit,
          soalCount: allSoalArrays[index].length
        }))
        setUnitDetails(details)

        // --- INI LOGIKA PEMULIHAN (ROBUSTNESS) ---
        const savedStateJSON = localStorage.getItem(storageKey)
        
        if (savedStateJSON) {
          // Jika ada progres tersimpan
          const savedState = JSON.parse(savedStateJSON)
          setAnswers(savedState.answers || {})
          setTimeLeft(savedState.timeLeft || totalDurationInSeconds)
          setIsExamActive(true) // Langsung masuk ke ujian
        } else {
          // Jika tidak ada (ujian baru)
          setAnswers({})
          setTimeLeft(totalDurationInSeconds)
          setIsExamActive(false) // Tampilkan layar Pre-Start
        }
        
      } catch (error) {
        console.error("Error loading exam:", error)
      } finally {
        setLoading(false)
        setIsRestored(true) // Tandai pemulihan selesai
      }
    }
    
    loadExamData()

  }, [user, isAuthLoading, router, storageKey])


  // --- EFEK SAMPING: Menyimpan Progres ke localStorage ---

  // Simpan jawaban setiap kali berubah (jika ujian aktif)
  useEffect(() => {
    if (!isExamActive || !isRestored || !storageKey) return;
    try {
      const stateJSON = localStorage.getItem(storageKey) || "{}"
      const currentState = JSON.parse(stateJSON)
      currentState.answers = answers
      localStorage.setItem(storageKey, JSON.stringify(currentState))
    } catch (e) { console.error("Gagal simpan jawaban:", e) }
  }, [answers, isExamActive, isRestored, storageKey])

  // Simpan sisa waktu setiap kali berubah (jika ujian aktif)
  useEffect(() => {
    if (!isExamActive || !isRestored || !storageKey) return;
    try {
      const stateJSON = localStorage.getItem(storageKey) || "{}"
      const currentState = JSON.parse(stateJSON)
      // Hanya simpan jika beda (efisiensi)
      if (currentState.timeLeft !== timeLeft) {
        currentState.timeLeft = timeLeft
        localStorage.setItem(storageKey, JSON.stringify(currentState))
      }
    } catch (e) { console.error("Gagal simpan waktu:", e) }
  }, [timeLeft, isExamActive, isRestored, storageKey])


  // --- Handlers ---

  const handleStartExam = () => {
    setIsExamActive(true)
  }

  const handleAnswerChange = (value) => {
    // Menggunakan soal.id sebagai kunci, BUKAN indeks
    const currentSoalId = soal[currentQuestionIndex]?.id;
    if (!currentSoalId) return;
    setAnswers((prev) => ({ ...prev, [currentSoalId]: value }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < soal.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }


  if (isAuthLoading || loading) {
    return (
      <MainLayout>
        <div className="p-6 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </MainLayout>
    )
  }

  if ((!units || units.length === 0 || !soal || soal.length === 0) && !loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Soal ujian teori tidak ditemukan untuk skema Anda.</AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    )
  }

  const currentSoal = soal[currentQuestionIndex];
  const currentUnit = units.find(u => u.id === currentSoal?.unitId);
  const answeredCount = Object.keys(answers).length;
  const totalDurationMinutes = Math.floor(units.reduce((sum, unit) => sum + (unit.durasiTeori || 15), 0));

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {!isExamActive ? (
          // Layar Pre-exam
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>
                Ujian Teori Skema {user?.skemaId}
              </CardTitle>
              <CardDescription>
                Rincian soal dan durasi per unit kompetensi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2 border rounded-lg p-4 max-h-60 overflow-y-auto">
                {unitDetails.map(unit => (
                  <div key={unit.id} className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">
                      Unit {unit.nomorUnit}: {unit.judul}
                    </p>
                    <p className="font-medium">{unit.soalCount} Soal ({unit.durasiTeori} Menit)</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Soal</p>
                  <p className="text-2xl font-bold mt-2">{soal.length}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Durasi Ujian</p>
                  <p className="text-2xl font-bold mt-2">{totalDurationMinutes} menit</p>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ujian akan dimulai segera. Pastikan Anda siap dan koneksi internet stabil. Waktu tidak dapat dijeda
                  atau diulang setelah dimulai.
                </AlertDescription>
              </Alert>

              <Button onClick={handleStartExam} size="lg" className="w-full">
                Mulai Ujian
              </Button>
            </CardContent>
          </Card>

        ) : (
          // Layar Ujian Aktif
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Ujian Teori Skema {user?.skemaId}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Soal {currentQuestionIndex + 1} dari {soal.length}
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${timeLeft < 300 ? "text-destructive" : ""}`}>
                      <Clock className="w-5 h-5 inline mr-2" />
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  {currentUnit && (
                    <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit mb-2">
                      Unit {currentUnit.nomorUnit}: {currentUnit.judul}
                    </div>
                  )}
                  <CardTitle className="text-base">
                    {currentSoal.teks}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Ketik jawaban esai Anda di sini..."
                    // --- (PERBAIKAN: Gunakan soal.id sebagai kunci) ---
                    value={answers[currentSoal?.id] || ""} 
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="min-h-40"
                  />
                </CardContent>
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === soal.length - 1}
                  className="flex-1 bg-transparent"
                >
                  Selanjutnya
                </Button>
                {currentQuestionIndex === soal.length - 1 && (
                  <Button onClick={() => setShowConfirmSubmit(true)} className="flex-1">
                    Selesaikan Ujian
                  </Button>
                )}
              </div>
            </div>
            <Card className="lg:sticky lg:top-6 h-fit">
              <CardHeader>
                <CardTitle className="text-base">
                  Daftar Soal ({answeredCount}/{soal.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {soal.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-full aspect-square flex items-center justify-center rounded text-xs font-medium transition-colors ${
                        currentQuestionIndex === idx
                          ? "bg-primary text-primary-foreground"
                          // --- (PERBAIKAN: Cek jawaban pakai soal.id) ---
                          : answers[s.id] 
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dialog Konfirmasi */}
        <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Selesaikan Ujian</DialogTitle>
              <DialogDescription>
                Anda telah menjawab {answeredCount} dari {soal.length} soal. Yakin ingin menyelesaikan ujian?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmSubmit(false)}>
                Lanjut Menjawab
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmSubmit(false)
                  handleSubmitExam()
                }}
              >
                Ya, Selesaikan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}