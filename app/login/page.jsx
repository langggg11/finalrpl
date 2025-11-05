"use client"

import React, { useState } from "react" // menyimpan data yang diinput
import { useAuth } from "@/lib/auth-context"  // mengambil fungsi login
import { useRouter } from "next/navigation" // redirecting
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, ArrowLeftIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import STISLogo from "@/public/logo-stis.png" 

const MockStats = () => (
  <div className="flex divide-x divide-blue-400/50">
    <div className="pr-6">
      <p className="text-3xl font-bold">500+</p>
      <p className="text-sm text-blue-200 opacity-90">Total Asesi</p>
    </div>
    <div className="px-6">
      <p className="text-3xl font-bold">50+</p>
      <p className="text-sm text-blue-200 opacity-90">Total Soal</p>
    </div>
    <div className="pl-6">
      <p className="text-3xl font-bold">94%</p>
      <p className="text-sm text-blue-200 opacity-90">Tingkat Lulus</p>
    </div>
  </div>
)

// state management
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [nama, setNama] = useState("")
  const { login, loading, error } = useAuth()
  const router = useRouter()

  // Ini kita anggap sebagai 'Masuk' manual (Email/Password)
  const handleManualLogin = async (e) => {
    e.preventDefault()
    try {
      // Kita tetep pake logic 'login(email, nama)'
      // Di real app, ini bakal 'login(email, password)'
      await login(email, nama || email) // Pakai nama atau email sbg fallback
      router.push("/dashboard")
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  // Ini tombol "Masuk dengan Akun STIS"
  const handleSSO = async () => {
    // Ini kita anggap sebagai 'SSO' (Mock SSO)
    const mockEmail = "222310001@stis.ac.id"
    const mockNama = "Nadia Nisrina"
    try {
      await login(mockEmail, mockNama)
      router.push("/dashboard")
    } catch (err) {
      console.error("SSO failed:", err)
    }
  }

  return (
    // Background halaman jadi abu-abu muda
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
      {/* Container Card Utama (sesuai figma) */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden">


        <div 
            className="hidden md:flex md:w-[45%] p-10 lg:p-12 text-white flex-col justify-between"
            style={{ background: 'linear-gradient(140deg, #1e3a8a 0%, #312e81 100%)' }}
        >
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center p-2">
                <Image src={STISLogo} alt="LSP Logo" width={48} height={48} priority />
              </div>
              <div>
                <h1 className="text-lg font-bold opacity-90">LMS LSP STIS</h1>
                <p className="text-xs text-blue-200 opacity-80">Politeknik Statistika STIS</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold leading-tight mb-4 opacity-95">
              Mulai Perjalanan Sertifikasi Anda
            </h2>
            <p className="text-base text-blue-200 opacity-80 mb-12">
              Platform pembelajaran dan sertifikasi profesional untuk Data Scientist
            </p>
            
            <MockStats />
          </div>

          <div className="text-xs text-blue-300 opacity-70">
            © {new Date().getFullYear()} Lembaga Sertifikasi Profesi (LSP)
          </div>
        </div>


        <div className="w-full md:w-[55%] bg-white p-10 lg:p-12 flex flex-col justify-center">
          
          {/* Logo untuk Mobile */}
           <div className="flex items-center gap-3 mb-8 md:hidden">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center p-2">
              <Image src={STISLogo} alt="LSP Logo" width={32} height={32} />
            </div>
            <div>
              <h1 className="text-lg font-bold">LMS LSP STIS</h1>
              <p className="text-sm text-gray-500">Politeknik Statistika STIS</p>
            </div>
          </div>

          {/* Judul Form */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang!</h2>
          <p className="text-gray-500 mb-6">Silakan masuk untuk melanjutkan</p>

          <div className="space-y-4">
            {error && (
              <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}


            {/* Form Manual (Email/Password) */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <Label htmlFor="email-manual" className="text-sm font-medium mb-1.5 block">Email</Label>
                <Input
                  id="email-manual"
                  type="email"
                  placeholder="admin@stis.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="nama-manual" className="text-sm font-medium mb-1.5 block">Nama / Password (untuk testing)</Label>
                <Input
                  id="nama-manual"
                  type="text" 
                  placeholder="Nama Anda"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Checkbox id="remember" className="mr-2" />
                  <Label htmlFor="remember" className="text-gray-600 font-normal">
                    Ingat saya
                  </Label>
                </div>
                <Link href="#" className="text-blue-600 hover:underline">
                  Lupa password?
                </Link>
              </div>

              <Button type="submit" disabled={loading} size="lg" className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700">
                {loading ? <Spinner className="w-4 h-4 mr-2" /> : "Masuk"}
              </Button>
            </form>
            
            {/* Pemisah "atau" */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">atau</span>
              </div>
            </div>

            {/* Tombol Login SSO */}
            <Button 
              onClick={handleSSO} 
              disabled={loading} 
              variant="outline" 
              size="lg" 
              className="w-full h-11 text-base"
            >
              {loading ? (
                <Spinner className="w-4 h-4 mr-2" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Masuk dengan Akun STIS
            </Button>

          </div>
        </div>
      </div>
    </div>
  )
}