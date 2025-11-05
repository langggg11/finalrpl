"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { mockGetUnitsForSkema, mockGetSoalForUnit, mockSubmitTryout, mockGetProgressAsesi } from "@/lib/api-mock";
import { Lock, Play, Loader2, Check, Book, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TryoutPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State untuk data
  const [units, setUnits] = useState([]);
  const [soalList, setSoalList] = useState([]);
  const [progress, setProgress] = useState(null);

  // State untuk UI
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk Ujian
  const [currentSoalIndex, setCurrentSoalIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { "soalId": "jawaban" }

  // Cek prasyarat
  const canStartTryout = progress?.progressPembelajaran === 100;
  const userSkemaId = user?.skemaId || "ADS";

  useEffect(() => {
    if (user) {
      loadPrerequisites();
    }
  }, [user]);

  // Ambil data progress & units (buat tau jumlah unit)
  const loadPrerequisites = async () => {
    try {
      setLoading(true);
      const [progressData, unitsData] = await Promise.all([mockGetProgressAsesi(user.id), mockGetUnitsForSkema(userSkemaId)]);
      setProgress(progressData);
      setUnits(unitsData);
    } catch (error) {
      console.error("Error loading prerequisites:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ambil soal HANYA JIKA user klik "Mulai"
  const loadSoalTryout = async () => {
    try {
      setLoading(true);
      // Ambil soal dari unitId palsu (sesuai mock)
      const soalData = await mockGetSoalForUnit(`${userSkemaId}-1`, "TRYOUT");
      setSoalList(soalData);

      // Inisialisasi state jawaban
      const initialAnswers = {};
      soalData.forEach((soal) => {
        initialAnswers[soal.id] = "";
      });
      setAnswers(initialAnswers);

      setIsStarted(true);
    } catch (error) {
      console.error("Error loading soal tryout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (soalId, value) => {
    setAnswers((prev) => ({ ...prev, [soalId]: value }));
  };

  const handleSubmit = async () => {
    // Cek apa ada soal yang belum diisi
    const answeredCount = Object.values(answers).filter(Boolean).length;
    if (answeredCount < soalList.length) {
      if (!confirm(`Anda baru mengerjakan ${answeredCount} dari ${soalList.length} soal. Tetap selesaikan tryout?`)) {
        return;
      }
    } else {
      if (!confirm("Apakah Anda yakin ingin menyelesaikan tryout ini?")) return;
    }

    try {
      setIsSubmitting(true);
      await mockSubmitTryout(user.id, answers);

      // Update progress di client-side
      setProgress((prev) => ({ ...prev, tryoutSelesai: true }));

      // Reset state ujian
      setIsStarted(false);

      alert("Tryout berhasil diselesaikan! Anda sekarang bisa melanjutkan ke Ujian Teori.");
      router.push("/asesi/dashboard");
    } catch (error) {
      console.error("Error submitting tryout:", error);
      alert("Gagal menyimpan tryout. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSoal = soalList[currentSoalIndex];

  if (loading && !isStarted) {
    return (
      <MainLayout>
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (isStarted) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* --- KOLOM KIRI (SOAL) --- */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Soal {currentSoalIndex + 1} dari {soalList.length}
                  </CardTitle>
                  <CardDescription className="pt-2 text-base text-gray-800">{currentSoal.teks}</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea className="w-full min-h-[400px] p-3 border rounded-md" placeholder="Tulis jawaban esai Anda di sini..." value={answers[currentSoal.id]} onChange={(e) => handleAnswerChange(currentSoal.id, e.target.value)} />
                </CardContent>
              </Card>
            </div>

            {/* --- KOLOM KANAN (NAVIGASI) --- */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Soal</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-5 gap-2">
                  {soalList.map((soal, index) => {
                    const isCurrent = currentSoalIndex === index;
                    const isAnswered = answers[soal.id];

                    let variant = "secondary"; // Belum diisi
                    if (isAnswered) variant = "outline"; // Udah diisi
                    if (isCurrent) variant = "default"; // Lagi aktif

                    return (
                      <Button
                        key={soal.id}
                        variant={variant}
                        className={`
                          w-full h-12 text-lg
                          ${isAnswered && !isCurrent ? "border-green-600 text-green-700 hover:bg-green-50" : ""}
                        `}
                        onClick={() => setCurrentSoalIndex(index)}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700">
                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                    Selesaikan Tryout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Tryout</h1>
        <p className="text-muted-foreground">Selesaikan Tryout untuk membuka Ujian Teori</p>

        <div className="flex justify-center items-center pt-10">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Tryout - Asesmen Mandiri</CardTitle>
              <CardDescription>Skema: {userSkemaId === "ADS" ? "Associate Data Scientist" : "Data Scientist"}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {!canStartTryout ? (
                // TAMPILAN TERKUNCI
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <Lock className="h-5 w-5 text-red-600" />
                  <AlertTitle className="text-red-800 font-semibold">Tryout Terkunci</AlertTitle>
                  <AlertDescription className="text-red-700">
                    Anda harus menyelesaikan 100% materi pembelajaran sebelum dapat memulai tryout. Progress Anda saat ini: <span className="font-bold">{progress?.progressPembelajaran || 0}%</span>.
                  </AlertDescription>
                  <Button asChild variant="link" className="p-0 h-auto text-red-700 mt-2">
                    <Link href="/asesi/learning">Kembali ke Pembelajaran</Link>
                  </Button>
                </Alert>
              ) : (
                // TAMPILAN SIAP MULAI
                <>
                  <div className="text-center text-muted-foreground">Harap baca instruksi berikut sebelum memulai tryout:</div>

                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Check className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-800">
                        Total <span className="font-semibold">{units.length} unit</span> kompetensi
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Book className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-800">
                        Soal berupa <span className="font-semibold">esai</span>
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-800">
                        Estimasi waktu pengerjaan <span className="font-semibold">90 menit</span> (tidak ada *timer* untuk tryout)
                      </span>
                    </li>
                  </ul>

                  <Button onClick={loadSoalTryout} disabled={loading} size="lg" className="w-full text-base h-11">
                    <Play className="w-5 h-5 mr-2" />
                    Mulai Tryout
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
