"use client"

import React, { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import STISLogo from "@/public/logo-stis.png"
import STISBuildingImg from "@/public/stis-building.png"
import STISStudentsImg from "@/public/stis-students.png"
import STISComputerImg from "@/public/stis-computer.png"

const MockStats = () => (
  <div className="grid grid-cols-3 gap-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
    <div className="text-center">
      <p className="text-3xl mb-1">500+</p>
     
    </div>
    <div className="text-center border-x border-white/20">
      <p className="text-3xl mb-1">50+</p>
      <p className="text-sm text-blue-100">Bank Soal</p>
    </div>
    <div className="text-center">
      <p className="text-3xl mb-1">94%</p>
      <p className="text-sm text-blue-100">Tingkat Lulus</p>
    </div>
  </div>
)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [nama, setNama] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)
  const { login, loading, error } = useAuth()
  const router = useRouter()

  const slides = [
    {
      image: STISBuildingImg,
      title: "Platform LMS LSP STIS",
      description: "Learning Management System untuk Lembaga Sertifikasi Profesi Politeknik Statistika STIS",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm tracking-wider mb-3 text-blue-100 font-semibold">Tentang LMS LSP STIS</h3>
            <p className="text-base leading-relaxed text-white/95">
              Platform terpadu untuk mengelola pembelajaran, ujian kompetensi, dan sertifikasi profesional bidang Data Science.
            </p>
          </div>

          <div>
            <h3 className="text-sm tracking-wider mb-3 text-blue-100 font-semibold">Fitur Utama</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed">Uji kompetensi yang terstandarisasi dan terakreditasi</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed">Akses ke bank soal dan materi pembelajaran yang komprehensif</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed">Sertifikat kompetensi digital yang dapat diverifikasi online</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      image: STISStudentsImg,
      title: "Komunitas STIS",
      description: "Bergabunglah dengan ribuan asesi yang telah tersertifikasi",
      content: (
        <div className="space-y-6">
          <MockStats />
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm leading-relaxed">
                "LMS LSP STIS memberikan pengalaman belajar yang terstruktur dan membantu saya meraih sertifikasi Data Science dengan mudah."
              </p>
              <p className="text-xs text-blue-100 mt-2">- Alumni STIS 2023</p>
            </div>
          </div>
        </div>
      )
    },
    {
      image: STISComputerImg,
      title: "Pembelajaran Modern",
      description: "Akses materi dan ujian kapan saja, di mana saja",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg mb-1 font-semibold">Materi Lengkap</h3>
                <p className="text-sm text-blue-100 leading-relaxed">Akses materi pembelajaran Data Science yang komprehensif dan selalu update</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg mb-1 font-semibold">Ujian Fleksibel</h3>
                <p className="text-sm text-blue-100 leading-relaxed">Ikuti ujian kompetensi dengan jadwal yang fleksibel sesuai kebutuhan Anda</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg mb-1 font-semibold">Sertifikat Digital</h3>
                <p className="text-sm text-blue-100 leading-relaxed">Dapatkan sertifikat digital yang terverifikasi</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  const handleManualLogin = async (e) => {
    e.preventDefault()
    try {
      await login(email, nama || email)
      router.push("/dashboard")
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  const handleSSO = async () => {
    const mockEmail = "222310001@stis.ac.id"
    const mockNama = "Nadia Nisrina"
    try {
      await login(mockEmail, mockNama)
      router.push("/dashboard")
    } catch (err) {
      console.error("SSO failed:", err)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100" />
      
      {/* Animated Diagonal Lines */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(135deg, #0c3c8c 0%, transparent 50%), linear-gradient(45deg, #1e40af 0%, transparent 50%)`,
          backgroundSize: '200px 200px',
          backgroundPosition: '0 0, 100px 100px',
        }}
      />

      {/* Geometric Shapes - Top Left */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      
      {/* Geometric Shapes - Top Right */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-400/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2" />
      
      {/* Geometric Shapes - Bottom Left */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/2" />
      
      {/* Geometric Shapes - Bottom Right */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-slate-400/10 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/3" />

      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #1e40af 1px, transparent 1px), linear-gradient(to bottom, #1e40af 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Accent Elements - Vertical Line Left */}
      <div className="absolute left-0 top-1/4 w-1 h-48 bg-gradient-to-b from-blue-500/30 via-blue-500/10 to-transparent" />
      
      {/* Accent Elements - Vertical Line Right */}
      <div className="absolute right-0 bottom-1/4 w-1 h-40 bg-gradient-to-t from-indigo-500/30 via-indigo-500/10 to-transparent" />

      {/* Decorative Circles */}
      <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-blue-400/40" />
      <div className="absolute top-2/3 left-1/4 w-3 h-3 rounded-full bg-indigo-400/30" />
      <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-blue-400/30" />

      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Left Panel - Login Form (White, Centered) */}
        <div className="w-full md:w-[40%] bg-white p-8 lg:p-12 flex flex-col justify-center relative">
          
          {/* Form Content - Centered */}
          <div className="max-w-sm mx-auto w-full">
            {/* Form Title */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-center text-blue-700 mb-2 tracking-tight">Selamat Datang</h2>
              <p className="text-center text-gray-600 text-base mb-1">LMS LSP STIS</p>
              <p className="text-center text-gray-500 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            {error && (
              <div className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Manual Login Form */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
                <Input
                  id="email-manual"
                  type="email"
                  placeholder="admin@stis.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Password</Label>
                <Input
                  id="nama-manual"
                  type="password" 
                  placeholder="Password"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex justify-end pt-2">
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Forgot your Password?
                </a>
              </div>

              <Button type="submit" disabled={loading} size="lg" className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold mt-6">
                {loading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                LOG IN
              </Button>
            </form>
            
            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600 font-medium">atau</span>
              </div>
            </div>

            {/* SSO Login Button */}
            <Button 
              onClick={handleSSO} 
              disabled={loading} 
              variant="outline" 
              size="lg" 
              className="w-full h-12 border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all font-semibold text-gray-700"
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

        {/* Right Panel - Hero Section with Carousel */}
        <div className="hidden md:flex md:w-[60%] text-white flex-col relative overflow-hidden min-h-[700px]">
          {/* Background Image - with smooth transition */}
          <div className="absolute inset-0 transition-opacity duration-500">
            <Image
              key={currentSlide}
              src={slides[currentSlide].image}
              alt="STIS"
              fill
              priority
              className="w-full h-full object-cover"
            />
            {/* Strong Blue Overlay */}
            <div className="absolute inset-0 bg-blue-600/80" />
          </div>

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between p-8 flex-shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center p-2 border border-white/30">
                <Image
                  src={STISLogo}
                  alt="STIS Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="tracking-wide font-bold">LMS LSP STIS</h1>
                <p className="text-xs text-blue-100">Politeknik Statistika STIS</p>
              </div>
            </div>
          </div>

          {/* Center Content - with fixed height container */}
          
          <div className="flex-1 flex flex-col justify-start px-12 py-8 relative z-10 overflow-y-auto">
            <div className="min-h-[450px]">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg mb-3">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-blue-50/95 leading-relaxed tracking-wide mb-8">
                {slides[currentSlide].description}
              </p>
    
              {/* Dynamic Content */}
              <div className="transition-opacity duration-300 prose prose-invert max-w-none">
                {slides[currentSlide].content}
              </div>
            </div>
          </div>

          {/* Bottom Navigation - fixed position */}
          <div className="relative z-10 flex items-center justify-between px-12 pb-8 flex-shrink-0">
            {/* Prev Button */}
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors border border-white/30"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Carousel Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors border border-white/30"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}