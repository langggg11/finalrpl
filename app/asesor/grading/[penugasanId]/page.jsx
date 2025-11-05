"use client";

import React, { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { mockSubmitNilai, mockGetPenugasanDetail } from "@/lib/api-mock"; 
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function GradingPage() {
  const params = useParams();
  const router = useRouter();
  const penugasanId = params.penugasanId;

  const [penugasan, setPenugasan] = useState(null);
  const [status, setStatus] = useState("BELUM_KOMPETEN"); 
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (penugasanId) {
      setLoading(true);
      mockGetPenugasanDetail(penugasanId)
        .then((data) => {
          setPenugasan(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          alert(`Gagal memuat data penugasan: ${err.message}`); 
          setLoading(false);
        });
    }
  }, [penugasanId]);

  // Mock Jawaban Asesi (Hardcoded, nanti diganti API)
  const jawabanAsesi = {
    TEORI: "Ini adalah jawaban esai Asesi untuk unit ini. Jawabannya terlihat cukup komprehensif dan mencakup poin-poin utama yang diminta dalam soal.",
    PRAKTIKUM: "https://example.com/asesi-upload.ppt", // Ini harusnya link ke file
    UNJUK_DIRI: "Penilaian dilakukan offline. Asesi hadir dan mempresentasikan hasil dengan cukup baik.",
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await mockSubmitNilai(penugasanId, null, status, feedback);
      alert("Penilaian berhasil disimpan");
      router.push("/asesor/dashboard");
    } catch (error) {
      console.error("Error submitting grading:", error);
      alert("Gagal menyimpan penilaian");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !penugasan) {
    return (
      <MainLayout>
        <div className="p-6 space-y-4">
          <Skeleton className="h-32 w-full bg-gray-200" />
          <Skeleton className="h-96 w-full bg-gray-200" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Penilaian {penugasan.tipe}</h1>
          <p className="text-muted-foreground mt-1">{penugasan.unitJudul}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Penugasan</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Asesi</p>
              <p className="text-lg font-semibold mt-1">{penugasan.asesiNama}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Skema</p>
              <p className="text-lg font-semibold mt-1">{penugasan.skemaId}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Unit</p>
              {/* Tampilkan N/A kalo bukan ujian teori */}
              <p className="text-lg font-semibold mt-1">{penugasan.unitId ? `Unit ${penugasan.unitId}` : "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Jawaban Asesi */}
        <Card>
          <CardHeader>
            <CardTitle>Jawaban Asesi</CardTitle>
          </CardHeader>
          <CardContent className="bg-muted/50 p-4 rounded-lg text-sm leading-relaxed">
            {penugasan.tipe === "PRAKTIKUM" ? (
              <Button asChild variant="outline">
                <a href={jawabanAsesi.PRAKTIKUM} target="_blank" rel="noopener noreferrer">
                  Download File PPT Asesi
                </a>
              </Button>
            ) : (
              <p>{jawabanAsesi[penugasan.tipe]}</p>
            )}
          </CardContent>
        </Card>

        {/* Penilaian Form */}
        <Card>
          <CardHeader>
            <CardTitle>Form Penilaian</CardTitle>
            <CardDescription>Berikan status kompetensi dan feedback untuk unit ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Kompetensi (Bukan Nilai Angka) */}
            <div>
              <label className="text-sm font-medium block mb-3">Status Kompetensi *</label>
              <RadioGroup value={status} onValueChange={(value) => setStatus(value)}>
                <div className="flex items-center space-x-2 mb-3 p-4 border rounded-lg has-[[data-state=checked]]:bg-green-50 has-[[data-state=checked]]:border-green-300">
                  <RadioGroupItem value="KOMPETEN" id="kompeten" />
                  <Label htmlFor="kompeten" className="font-normal cursor-pointer flex-1">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Kompeten
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg has-[[data-state=checked]]:bg-red-50 has-[[data-state=checked]]:border-red-300">
                  <RadioGroupItem value="BELUM_KOMPETEN" id="belum-kompeten" />
                  <Label htmlFor="belum-kompeten" className="font-normal cursor-pointer flex-1">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Belum Kompeten
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Feedback */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Feedback & Saran *</label>
              <Textarea placeholder="Berikan umpan balik konstruktif..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="min-h-32" />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => router.back()}>
                Batal
              </Button>
              <Button onClick={() => setShowConfirm(true)} disabled={!feedback}>
                Simpan Penilaian
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penilaian</DialogTitle>
            <DialogDescription>
              Anda akan memberikan status <strong>{status}</strong>. Penilaian ini final. Lanjutkan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Ya, Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
