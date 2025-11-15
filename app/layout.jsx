// File: app/layout.jsx
// Fungsi: File "Induk" atau "Root Template" untuk seluruh aplikasi.
// Semua halaman akan di-render di dalam sini.

import React from "react" 
// Impor font kustom (Geist) untuk konsistensi branding & styling.
import { Geist, Geist_Mono } from "next/font/google" 
// Impor stylesheet global. Di sinilah TailwindCSS dan variabel warna shadcn/ui didefinisikan.
import "./globals.css" 
// Impor "jantung" dari aplikasi kita: AuthProvider.
import { AuthProvider } from "@/lib/auth-context" 

// Inisialisasi font
const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

// Mendefinisikan metadata SEO statis untuk seluruh halaman (judul default, deskripsi).
export const metadata = {
  title: "LMS LSP Polstat STIS",
  description: "Learning Management System untuk Sertifikasi Profesi",
  authors: [{ 
    name: "Galang Dwi Nugroho, M. Rezky Raya Kilwouw, Meldiro Augusto, Nadia Nur Nisrina, Naila Hanifa, Nailatur Rajaa, Rani Kusumawati" 
  }],
  developerTeam: "Tim 2 RPL 3SI1 (2025)"
}

/**
 * RootLayout adalah komponen server-side utama dari Next.js App Router.
 * @param {object} props - Props yang diberikan oleh Next.js.
 * @param {React.ReactNode} props.children - Ini adalah "halaman" itu sendiri (misal: login/page.jsx, dashboard/page.jsx).
 */
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      {/* Menerapkan font 'Geist' ke seluruh body.
        'bg-background' dan 'text-foreground' adalah variabel CSS dari shadcn/ui
        (didefinisikan di globals.css) untuk mendukung Dark Mode.
      */}
      <body className={`${geistSans.className} bg-background text-foreground`}>
        {/* Ini adalah bagian penting di file ini.
          Dengan membungkus `{children}` (semua halaman) dengan <AuthProvider>,
          kita memastikan bahwa setiap komponen di dalam aplikasi ini
          bisa mengakses global state autentikasi (data 'user', 'isLoggedIn', 'loading', 'error')
          menggunakan hook 'useAuth()'. 
          
          Inilah yang bikin data login-nya tidak hilang waktu pindah halaman.
          [Lihat: lib/auth-context.jsx]
        */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}