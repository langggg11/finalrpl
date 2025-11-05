// Core type definitions untuk LMS LSP Polstat STIS
// Di JavaScript, file ini tidak digunakan secara fungsional
// tetapi disimpan untuk referensi struktur data.

/*
export type UserRole = "ASESI" | "ASESOR" | "ADMIN_LSP"

export type SkemaType = "ADS" | "DS" // Associate Data Scientist | Data Scientist

export type ExamType = "TEORI" | "PRAKTIKUM" | "UNJUK_DIRI"

export type ExamStatus = "BELUM_DIMULAI" | "SEDANG_BERLANGSUNG" | "SELESAI"

export type CompetencyStatus = "KOMPETEN" | "BELUM_KOMPETEN"

export interface User {
  id: string
  email: string
  nama: string
  role: UserRole
  fotoProfil?: string
  noIdentitas?: string
  nim?: string // untuk ASESI
  nip?: string // untuk ASESOR/ADMIN_LSP
  createdAt: Date
  updatedAt: Date
}

export interface Unit {
  id: string
  skemaId: SkemaType
  nomorUnit: number
  judul: string
  deskripsi: string
  materiCount: number
  soalCount: number
  durasiTeori: number // dalam menit
  urutan: number
}

export interface Materi {
  id: string
  unitId: string
  judul: string
  jenis: "VIDEO" | "PDF" | "LINK"
  urlKonten: string
  urutan: number
}

export interface Soal {
  id: string
  unitId: string
  tipeSoal: TipeSoal
  teks?: string // opsional untuk Praktikum (form upload)
  tipe: "PILIHAN_GANDA" | "ESAI"
  pilihan?: string[] // untuk PILIHAN_GANDA
  kunciJawaban?: string | string[] // untuk PILIHAN_GANDA atau ESAI
  bobot?: number // hanya untuk PILIHAN_GANDA
  urutan: number
  fileTemplate?: string // untuk UJIAN_PRAKTIKUM - file yang bisa didownload Asesi
}

export type TipeSoal = "TRYOUT" | "UJIAN_TEORI" | "UJIAN_PRAKTIKUM"

export interface JawabanSoal {
  id: string
  soalId: string
  ujianId: string
  jawaban: string
  waktuMenjawab: Date
}

export interface Ujian {
  id: string
  asesiId: string
  unitId: string
  tipe: ExamType
  status: ExamStatus
  nilaiTeori?: number
  hasilPraktikum?: CompetencyStatus
  hasilUnjukDiri?: CompetencyStatus
  waktuMulai?: Date
  waktuSelesai?: Date
  fileJawaban?: string // untuk PRAKTIKUM
}

export interface ProgressAsesi {
  asesiId: string
  skemaId: SkemaType
  unitIdTerakhirSelesai: number
  persentaseProgress: number // 0-100%
  statusPraAsesmen: "BELUM" | "SELESAI"
  tryoutSelesai: boolean
  nilaiFaseTeori: number // 0-100
  nilaiFasePraktikum: CompetencyStatus
  nilaiFaseUnjukDiri: CompetencyStatus
  hadirzoomSessionCount: number
  totalZoomSessionCount: number
}

export interface PenugasanAsesor {
  id: string
  asesorId: string
  asesiId: string
  skemaId: SkemaType
  unitId: string
  tipe: ExamType
  statusPenilaian: "BELUM_DINILAI" | "SEDANG_DINILAI" | "SELESAI"
  nilai?: number
  feedback?: string
}

export interface SesiUjianOffline {
  id: string
  skemaId: SkemaType
  tanggal: Date
  waktu: string
  tipeUjian: ExamType
  ruangan: string
  kapasitas: number
  asesorId?: string
}

export interface PlottingAsesi {
  id: string
  asesiId: string
  sesiUjianId: string
  ruangan: string
  nomorKursi?: string
}

export interface Linimasa {
  id: string
  skemaId?: SkemaType
  judul: string
  deskripsi: string
  tanggal: Date
  waktu?: string
  urlZoom?: string // opsional
  tipe: "PEMBELAJARAN" | "UJIAN" | "PENGUMUMAN" | "SESI_OFFLINE" | "LAINNYA"
  sesiUjianId?: string // link ke SesiUjianOffline jika ada
}

export interface HasilAkhir {
  asesiId: string
  skemaId: SkemaType
  nilaiTeori: number
  hasilPraktikum: CompetencyStatus
  hasilUnjukDiri: CompetencyStatus
  statusAkhir: CompetencyStatus
  tanggalPengumuman: Date
  nomorSertifikat?: string
  tanggalSertifikat?: Date
}

export interface AuthState {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null
}
*/