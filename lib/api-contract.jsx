/**
 * ========================================
 * KONTRAK API LMS LSP (Versi .jsx)
 * ========================================
 *
 * Dokumen ini adalah referensi TUNGGAL untuk Frontend dan Backend (Kak Adit).
 * Semua endpoint dan struktur data yang disepakati ada di sini.
 *
 * - Frontend: Gunakan ini untuk mengetahui data apa yang akan diterima
 * - Backend: Gunakan ini untuk mengetahui data apa yang harus dikirim.
 *
 * Status: Draft
 */

// ========================================
//   TIPOLOGI DATA
// ========================================

/* // ----- Standar Wrapper API -----
// Semua response dari Backend WAJIB dibungkus seperti ini
const ApiResponse = {
  success: true, // boolean
  message: "Data berhasil diambil", // string
  data: { ... } // atau [ ... ]
}

// Jika error
const ApiErrorResponse = {
  success: false,
  message: "Terjadi kesalahan", // string
  error: "Detail error teknis" // string, opsional
}
*/

/* // ----- Data User (Hasil Login / GET User) -----
const User = {
  id: "user-123",
  email: "222310001@stis.ac.id",
  nama: "Nadia Nisrina",
  role: "ASESI", // "ASESI" | "ASESOR" | "ADMIN_LSP"
  nim: "222310001", // opsional, null kalo bukan asesi
  nip: "19900101...", // opsional, null kalo bukan asesor/admin
  skemaId: "DS", // "ADS" | "DS", opsional, null kalo bukan asesi
  kelas: "4SI1", // opsional, null kalo bukan asesi
}
*/

/* // ----- Data Skema (buat list dropdown/tabs dinamis) -----
const Skema = {
  id: "DS", // Ini ID unik (singkatan), e.g., "ADS", "DS", "AI_OPS"
  judul: "Data Scientist",
  deskripsi: "Skema sertifikasi profesi untuk D4 Statistika.",
  totalUnit: 11
}
*/

/* // ----- Data Unit Kompetensi (buat halaman Learning & Admin Skema) -----
const Unit = {
  id: "DS-1", // Format: "{skemaId}-{nomorUnit}"
  skemaId: "DS",
  nomorUnit: 1,
  judul: "Pengenalan Data Science Advanced",
  deskripsi: "Deskripsi singkat unit...",
  materiCount: 3, // Jumlah materi di dalemnya
  durasiTeori: 20, // Durasi ujian teori untuk unit ini (dalam menit)
  urutan: 1
}
*/

/* // ----- Data Materi (di dalam Unit Learning) -----
const Materi = {
  id: "materi-1",
  unitId: "DS-1",
  judul: "Video: Pengenalan Unit",
  jenis: "VIDEO", // "VIDEO" | "PDF" | "LINK"
  urlKonten: "https://www.youtube.com/watch?v=...",
  urutan: 1
}
*/

/* // ----- Data Soal (buat Ujian Teori, Tryout, Praktikum) -----
const Soal = {
  id: "soal-1",
  unitId: "DS-1", // null kalo ini soal Tryout atau Praktikum skema
  tipeSoal: "UJIAN_TEORI", // "UJIAN_TEORI" | "TRYOUT" | "UJIAN_PRAKTIKUM"
  tipeJawaban: "ESAI", // "ESAI" | "PILIHAN_GANDA" | "UPLOAD_FILE"
  teks: "Jelaskan konsep utama dari Data Science?",
  pilihan: ["A. ...", "B. ..."], // opsional, cuma buat Pilihan Ganda
  kunciJawaban: "A", // opsional, cuma buat Pilihan Ganda
  fileTemplateSoal: "https://.../soal.zip" // opsional, cuma buat Praktikum
}
*/

/* // ----- Data Progress Asesi (buat Dashboard & Cek Prasyarat) -----
const ProgressAsesi = {
  asesiId: "user-123",
  skemaId: "DS",
  fase: "PEMBELAJARAN", // "PEMBELAJARAN" | "TRYOUT" | "UJIAN_TEORI" | "UJIAN_PRAKTIKUM" | "SELESAI"
  
  // Buat Halaman Learning
  completedUnitIds: ["DS-1", "DS-2"], // Set/Array ID unit yang selesai
  progressPembelajaran: 18, // persentase (2 dari 11 unit)

  // Buat Cek Prasyarat
  statusPraAsesmen: "SELESAI", // "BELUM" | "SELESAI"
  tryoutSelesai: true, // boolean
  ujianTeoriSelesai: false // boolean
}
*/

/* // ----- Data Penugasan (buat Asesor & Admin) -----
const Penugasan = {
  id: "penugasan-1",
  asesorId: "asesor-1",
  asesiId: "user-123",
  asesiNama: "Nadia Nisrina",
  skemaId: "DS",
  
  // Ini yang penting
  tipe: "TEORI", // "TEORI" | "PRAKTIKUM" | "UNJUK_DIRI"
  
  // Kalo tipenya "TEORI", ini diisi
  unitId: 1, 
  unitJudul: "Pengenalan Data Science Advanced",
  
  // Kalo "PRAKTIKUM" atau "UNJUK_DIRI", ini diisi
  // unitId: null,
  // unitJudul: "Studi Kasus Praktikum (Gabungan)", 
  
  statusPenilaian: "BELUM_DINILAI", // "BELUM_DINILAI" | "SELESAI"
  nilai: null, // (kita putuskan pake status, jadi ini di-deprecate/null)
  feedback: null, // string
  status: null // (kita ganti jadi 'nilaiKompetensi')
  
  // Revisi: Nilai pake status
  nilaiKompetensi: "BELUM_DINILAI" // "BELUM_DINILAI" | "KOMPETEN" | "BELUM_KOMPETEN"
}
*/

/* // ----- Data Sesi Ujian Offline (buat Admin Timeline & Asesi Schedule) -----
const SesiUjianOffline = {
  id: "sesi-ds-1",
  skemaId: "DS",
  tanggal: "2025-11-10T09:00:00Z", // (ISO Date String)
  waktu: "09:00", // (string "HH:mm")
  tipeUjian: "UNJUK_DIRI", // "TEORI" | "PRAKTIKUM" | "UNJUK_DIRI"
  ruangan: "Auditorium STIS",
  kapasitas: 50,
  asesiTerplot: [User, User, ...] // (Array objek User, didapet dari GET /:id)
}
*/

/* // ----- Data Hasil Akhir (buat Halaman Hasil Asesi) -----
const HasilAkhir = {
  asesiId: "user-123",
  skemaId: "DS",
  statusAkhir: "BELUM_KOMPETEN", // "KOMPETEN" | "BELUM_KOMPETEN"
  
  // Penilaian tunggal
  hasilPraktikum: "KOMPETEN", // "KOMPETEN" | "BELUM_KOMPETEN"
  hasilUnjukDiri: "KOMPETEN", // "KOMPETEN" | "BELUM_KOMPETEN"
  
  // Penilaian Teori (Akumulasi)
  hasilTeori: {
    statusAkumulasi: "BELUM_KOMPETEN", // "KOMPETEN" | "BELUM_KOMPETEN"
    totalUnitLulus: 8,
    totalUnitSkema: 11,
    // Rincian per unit-nya
    rincianUnit: [
      {
        unitId: "DS-1",
        judul: "Pengenalan Data Science Advanced",
        status: "KOMPETEN", // "KOMPETEN" | "BELUM_KOMPETEN"
        soalSesuai: 3, // (jumlah soal yg dijawab "SESUAI")
        soalTotal: 4
      },
      // ... (unit lainnya)
    ]
  }
}
*/

// ========================================
//   ENDPOINT MAPPING
// ========================================

/**
 * ----- 1. AUTHENTICATION -----
 *
 * POST /api/auth/login
 * Body: { email: string, nama: string }
 * Response: ApiResponse<User>
 * (Mock: mockLoginSSO)
 */

/**
 * ----- 2. ASESI (ROLE: ASESI) -----
 *
 * GET /api/asesi/progress
 * (Otomatis ambil Asesi ID dari token)
 * Response: ApiResponse<ProgressAsesi>
 * (Mock: mockGetProgressAsesi)
 *
 * POST /api/asesi/pra-asesmen
 * (Otomatis ambil Asesi ID dari token)
 * Body: { telepon: string, tempatLahir: string, ...dll }
 * Response: ApiResponse<{ success: boolean }>
 * (Mock: mockSubmitPraAsesmen)
 *
 * GET /api/asesi/units
 * (Otomatis ambil Skema ID dari token user)
 * Response: ApiResponse<Unit[]>
 * (Mock: mockGetUnitsForSkema)
 *
 * GET /api/asesi/materi
 * Query: ?unitId=DS-1
 * Response: ApiResponse<Materi[]>
 * (Mock: mockGetMateriForUnit)
 *
 * POST /api/asesi/units/complete
 * (Otomatis ambil Asesi ID dari token)
 * Body: { unitId: string }
 * Response: ApiResponse<ProgressAsesi> (progress baru)
 * (Mock: mockMarkUnitCompleted)
 *
 * GET /api/asesi/soal
 * Query: ?tipeSoal=TRYOUT (atau UJIAN_TEORI, UJIAN_PRAKTIKUM)
 * (Otomatis ambil Skema ID dari token user)
 * Response: ApiResponse<Soal[]>
 * (Mock: mockGetSoalForUnit - diakali pake unitId)
 *
 * POST /api/asesi/tryout/submit
 * Body: { answers: { ... } }
 * Response: ApiResponse<{ success: boolean }>
 * (Mock: mockSubmitTryout)
 *
 * POST /api/asesi/exams/teori/submit
 * Body: { answers: { ... } }
 * Response: ApiResponse<{ success: boolean }>
 * (Mock: mockSubmitUjianTeori)
 *
 * GET /api/asesi/results
 * (Otomatis ambil Asesi ID dari token)
 * Response: ApiResponse<HasilAkhir>
 * (Mock: mockGetHasilAkhir)
 *
 * GET /api/asesi/schedule
 * (Otomatis ambil Skema ID dari token user)
 * (NOTE: Halaman Asesi Schedule memanggil ini DAN /api/asesi/schedule/offline)
 * Response: ApiResponse<Linimasa[]>
 * (Mock: mockGetLinimasa)
 *
 * (--- INI ENDPOINT YANG DITAMBAHKAN ---)
 * GET /api/asesi/schedule/offline
 * (Otomatis ambil Asesi ID dari token)
 * Response: ApiResponse<SesiUjianOffline[]>
 * (Mock: mockGetPlottingAsesi)
 * (--- BATAS PENAMBAHAN ---)
 */

/**
 * ----- 3. ASESOR (ROLE: ASESOR) -----
 *
 * GET /api/asesor/penugasan
 * (Otomatis ambil Asesor ID dari token)
 * Response: ApiResponse<Penugasan[]>
 * (Mock: mockGetPenugasanAsesor)
 *
 * GET /api/asesor/penugasan/:id
 * Param: id (ID penugasan, BUKAN asesi)
 * Response: ApiResponse<Penugasan>
 * (Mock: mockGetPenugasanDetail)
 *
 * POST /api/asesor/penugasan/:id/submit
 * Param: id (ID penugasan)
 * Body: { nilaiKompetensi: "KOMPETEN" | "BELUM_KOMPETEN", feedback: string }
 * Response: ApiResponse<{ success: boolean }>
 * (Mock: mockSubmitNilai)
 *
 * GET /api/asesor/asesi-list
 * (Otomatis ambil Asesor ID dari token)
 * (Backend logic: cari semua penugasan, ambil asesi unik)
 * Response: ApiResponse<{ id, nama, skemaId }[]>
 * (Mock: mockGetPenugasanAsesor, lalu di-filter di frontend)
 *
 * GET /api/asesor/schedule
 * (Otomatis ambil Skema ID dari token user)
 * Response: ApiResponse<Linimasa[]>
 * (Mock: mockGetLinimasa)
 */

/**
 * ----- 4. ADMIN LSP (ROLE: ADMIN_LSP) -----
 *
 * GET /api/admin/stats
 * Response: ApiResponse<{ totalAsesi, totalAsesor, pendingGrading, ...dll }>
 * (Mock: mockGetStatistics)
 *
 * GET /api/admin/users
 * Query: ?role=ASESI (atau ASESOR, ADMIN_LSP)
 * Response: ApiResponse<User[]>
 * (Mock: mockGetAsesiUsers, mockGetAsesorUsers, dll)
 *
 * POST /api/admin/users/:id/role
 * Body: { role: "ASESOR" | "ADMIN_LSP" }
 * Response: ApiResponse<User>
 * (Mock: mockUpdateUserRole)
 *
 * (--- TAMBAHAN ENDPOINT BARU ---)
 *
 * GET /api/admin/skema
 * Response: ApiResponse<Skema[]>
 * (Mock: mockGetAllSkema)
 *
 * POST /api/admin/skema
 * Body: { id: string (e.g., "AI_OPS"), judul: string, deskripsi: string }
 * Response: ApiResponse<Skema> (data skema baru)
 * (Mock: mockCreateSkema)
 *
 * (--- BATAS TAMBAHAN ENDPOINT BARU ---)
 *
 * GET /api/admin/units
 * Query: ?skemaId=DS
 * Response: ApiResponse<Unit[]>
 * (Mock: mockGetUnitsForSkema)
 *
 * GET /api/admin/soal
 * Query: ?skemaId=DS&tipeSoal=TRYOUT (atau UJIAN_PRAKTIKUM)
 * Query: ?unitId=DS-1&tipeSoal=UJIAN_TEORI (kalo teori pake unitId)
 * Response: ApiResponse<Soal[]>
 * (Mock: mockGetSoalForUnit)
 *
 * (CRUD Unit, Materi, Soal belum di-mock, asumsi:
 * POST /api/admin/units (Body: { skemaId, nomorUnit, judul, ... })
 * POST /api/admin/materi (Body: { unitId, judul, jenis, urlKonten })
 * POST /api/admin/soal (Body: { unitId, tipeSoal, teks, ... })
 * )
 *
 * POST /api/admin/assignments
 * Body: { asesiId: string, assignments: [{ tipe, unitId, asesorId }, ...] }
 * Response: ApiResponse<{ success: boolean }>
 * (Mock: mockAssignAsesorPerUnit)
 *
 * GET /api/admin/timeline
 * Query: ?skemaId=DS
 * Response: ApiResponse<Linimasa[]>
 * (Mock: mockGetLinimasa)
 *
 * GET /api/admin/offline-exam-sesi
 * Query: ?skemaId=DS
 * Response: ApiResponse<SesiUjianOffline[]>
 * (Mock: mockGetSesiUjianOffline)
 *
 * POST /api/admin/offline-exam-sesi
 * Body: { skemaId, tanggal, waktu, tipeUjian, ruangan, kapasitas }
 * Response: ApiResponse<SesiUjianOffline> (data baru)
 * (Mock: mockCreateSesiUjianOffline)
 *
 * GET /api/admin/offline-exam-sesi/:id
 * Param: id (Sesi ID)
 * Response: ApiResponse<SesiUjianOffline> (termasuk asesiTerplot)
 * (Mock: mockGetSesiUjianDetail)
 *
 * GET /api/admin/asesi-available
 * Query: ?skemaId=DS&sesiId=sesi-ds-1
 * Response: ApiResponse<GrupKelas[]>
 * // GrupKelas = { namaKelas: "4SI1", asesi: [User, User, ...] }
 * (Mock: mockGetAsesiBelumDiplot)
 *
 * POST /api/admin/offline-exam-sesi/:id/plotting
 * Param: id (Sesi ID)
 * Body: { asesiIds: ["user-1", "user-2", ...] }
 * Response: ApiResponse<{ success: boolean, count: number }>
 * (Mock: mockUpdatePlottingSesi)
 */

// Placeholder
const ApiContract = () => null;
