"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, PrinterIcon, Share2, CheckCircle2 } from "lucide-react"

export default function CertificatePage() {
  const { user } = useAuth()

  const certificateData = {
    noSertifikat: "LSP-ADS-2025-001234",
    nama: user?.nama || "Nama Asesi",
    skema: user?.skemaId || "Associate Data Scientist (ADS)",
    tanggalLulus: new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    berlakuHingga: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    alert("Download sertifikat sebagai PDF")
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/verify/${certificateData.noSertifikat}`
    navigator.clipboard.writeText(shareUrl)
    alert("Link verifikasi disalin ke clipboard")
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Sertifikat Digital</h1>
          <p className="text-muted-foreground mt-1">Unduh dan bagikan sertifikat kompetensi Anda</p>
        </div>

        {/* Certificate Preview */}
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-12 pb-12 px-8">
            {/* Certificate Design */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 text-center border border-blue-200 shadow-lg">
              <div className="mb-8">
                <p className="text-sm text-blue-600 font-semibold tracking-widest">SERTIFIKAT KOMPETENSI</p>
              </div>

              <div className="mb-8">
                <p className="text-xs text-blue-600 mb-2">Diberikan kepada</p>
                <p className="text-3xl font-bold text-blue-900 mb-6">{certificateData.nama}</p>
              </div>

              <div className="border-t border-b border-blue-300 py-6 mb-8">
                <p className="text-xs text-blue-600 mb-2">Telah dinyatakan KOMPETEN dalam</p>
                <p className="text-lg font-semibold text-blue-900 mb-4">{certificateData.skema}</p>
                <p className="text-xs text-blue-600">Berdasarkan uji kompetensi yang diselenggarakan oleh</p>
                <p className="font-semibold text-blue-900">Lembaga Sertifikasi Profesi (LSP)</p>
                <p className="text-sm font-semibold text-blue-900">Politeknik Statistika STIS</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div>
                  <p className="text-xs text-blue-600 mb-1">Nomor Sertifikat</p>
                  <p className="font-bold text-blue-900">{certificateData.noSertifikat}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 mb-1">Tanggal Lulus</p>
                  <p className="font-bold text-blue-900">{certificateData.tanggalLulus}</p>
                </div>
              </div>

              <div className="text-xs text-blue-700 mb-6">
                Sertifikat ini berlaku hingga: <span className="font-bold">{certificateData.berlakuHingga}</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Sertifikat Digital Terverifikasi</span>
              </div>

              <p className="text-xs text-blue-600 mt-4">Verifikasi di: lsp.stis.ac.id/verify</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={handleDownload} size="lg" className="gap-2">
            <Download className="w-5 h-5" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} variant="outline" size="lg" className="gap-2 bg-transparent">
            <PrinterIcon className="w-5 h-5" />
            Cetak
          </Button>
          <Button onClick={handleShare} variant="outline" size="lg" className="gap-2 bg-transparent">
            <Share2 className="w-5 h-5" />
            Bagikan
          </Button>
        </div>

      </div>
    </MainLayout>
  )
}