# LMS LSP Polstat STIS - Frontend

Learning Management System untuk Lembaga Sertifikasi Profesi (LSP) Politeknik Statistika STIS.  
Sistem pembelajaran dan sertifikasi komprehensif untuk Skema **Associate Data Scientist (ADS - 9 Unit)** dan **Data Scientist (DS - 11 Unit)**.

---

## Daftar Isi
- [Fitur Utama](#fitur-utama)
- [Struktur Proyek](#struktur-proyek)
- [Setup & Instalasi](#setup--instalasi)
- [Panduan Handoff ke Backend](#panduan-handoff-ke-backend)
- [Dokumentasi API](#dokumentasi-api)
- [User Roles & Access](#user-roles--access)
- [Panduan Development](#panduan-development)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Project Status](#project-status)
- [Support & Dokumentasi](#support--dokumentasi)

---

## Fitur Utama

### 1. Authentication & Authorization
- SSO Google menggunakan `@stis.ac.id` (disimulasikan)
- Auto-role assignment berdasarkan format email
- Session management & persistent login (via LocalStorage)
- Role-based access control (RBAC)

### 2. Admin LSP Dashboard
- Manajemen pengguna (ASESI, ASESOR, ADMIN_LSP)
- Manajemen skema sertifikasi (CRUD Skema, Unit, Materi, Soal)
- Penugasan asesor per unit per asesi
- Manajemen linimasa & jadwal kegiatan
- Manajemen Sesi Ujian Offline & Plotting Peserta
- Dashboard analitik & laporan

### 3. Asesi (Peserta) Portal
- **Dashboard:** Progress tracking 4 fase, upcoming events
- **Learning Path:** Lock/unlock, materi video/PDF, auto progress
- **Pra-Asesmen:** Form data diri & upload dokumen
- **Tryout:** Ujian mandiri (esai) prasyarat teori
- **Ujian Teori:** Gabungan semua unit, timer, navigator, auto save
- **Ujian Praktikum:** Download soal, upload hasil
- **Unjuk Diri:** Info jadwal & asesmen langsung
- **Hasil Penilaian:** Breakdown, status akhir, sertifikat mock
- **Jadwal:** Calendar view dengan filter event

### 4. Asesor (Penilai) Portal
- **Dashboard:** Statistik & daftar tugas
- **Grading Interface:** Penilaian status-based (Kompeten/Belum)
- **Asesi List:** Daftar asesi ditugaskan
- **Jadwal:** Calendar view

### 5. System Features
- Real-time exam timer (auto-submit)
- Progress tracking & analytics
- Responsive UI (mobile/tablet/desktop)
- TailwindCSS + semantic HTML (aksesibilitas)
- Role-based dashboard routing

---

## Struktur Proyek
```plaintext
app/
├── layout.jsx                 # Root layout dengan AuthProvider
├── globals.css                # TailwindCSS global styles
├── page.jsx                   # Home - redirect login/dashboard
├── login/page.jsx             # Login page
├── dashboard/page.jsx         # Role-based dashboard router
├── admin/
│   ├── dashboard/page.jsx     # Admin dashboard
│   ├── users/page.jsx         # User management
│   ├── schema/page.jsx        # Skema management
│   ├── assignments/page.jsx   # Asesor assignment
│   ├── timeline/page.jsx      # Linimasa
│   └── offline-exam/[sesiId]/page.jsx # Plotting sesi offline
├── asesi/
│   ├── dashboard/page.jsx
│   ├── pra-asesmen/page.jsx
│   ├── learning/page.jsx
│   ├── tryout/page.jsx
│   ├── exams/
│   │   ├── page.jsx
│   │   ├── teori/run/page.jsx
│   │   └── praktikum/upload/page.jsx
│   ├── results/page.jsx
│   ├── certificate/page.jsx
│   └── schedule/page.jsx
├── asesor/
│   ├── dashboard/page.jsx
│   ├── grading/[penugasanId]/page.jsx
│   ├── asesi-list/page.jsx
│   └── schedule/page.jsx
└── components/, lib/, hooks/
```

---

## Setup & Instalasi

### Prerequisites
- Node.js 18+
- pnpm

### Installation
```bash
pnpm install
```

### Environment Variables
Buat file `.env.local` di root, sesuaikan URL backend (Express.js):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Jalankan Development Server
```bash
pnpm dev
```
Lalu buka **http://localhost:3000**

### Test Credentials
Gunakan **Mock SSO** (klik *Masuk dengan Akun STIS*):
- `222310001@stis.ac.id` → Asesi (Nadia Nisrina)
- `asesor1@stis.ac.id` → Asesor
- `admin@stis.ac.id` → Admin LSP

Atau login manual dengan email di atas dan password/nama bebas karena akan di random.

---

## Panduan Handoff ke Backend

Proyek ini saat ini memakai **Mock API** (`lib/api-mock.js`).  
Backend hanya perlu mengganti isi fungsi mock dengan **real API call** ke endpoint Express.js.

Selama struktur JSON mengikuti `lib/api-contract.jsx`, frontend akan tetap berjalan tanpa modifikasi.

### Contoh:
**Sebelum (mock):**
```javascript
export async function mockGetUnitsForSkema(skemaId) {
  await delay(400);
  const units = allUnitsDb.get(skemaId) || [];
  return units;
}
```

**Sesudah (real API):**
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUnitsForSkema() {
  const res = await fetch(`${API_URL}/asesi/units`);
  if (!res.ok) throw new Error("Gagal mengambil data unit");
  const result = await res.json();
  return result.data;
}
```

---

## Dokumentasi API
Semua kontrak dan struktur data ada di:
```
lib/api-contract.jsx
```
File ini sebagai acuan untuk backend endpoint.

---

## User Roles & Access

### ASESI
- Dashboard pribadi
- Pembelajaran & ujian
- Hasil penilaian & sertifikat
- Jadwal kegiatan

### ASESOR
- Daftar asesi ditugaskan
- Penilaian semua ujian
- Feedback & rekomendasi

### ADMIN_LSP
- Manajemen user & skema
- Penugasan asesor
- Linimasa, laporan, analitik

---

## Panduan Development

### Menambah Fitur Baru
```javascript
// 1. Tambahkan tipe di lib/types.js
/*
export interface NewFeature {
  id: string;
  name: string;
}
*/

// 2. Tambahkan mock API
export async function mockGetNewFeature() {
  await new Promise(r => setTimeout(r, 500));
  return [...];
}

// 3. Gunakan di komponen
const [data, setData] = useState([]);
useEffect(() => {
  mockGetNewFeature().then(setData);
}, []);
```

### API Integration
```javascript
// Before (mock)
const data = await mockGetUsers();

// After (real)
const res = await fetch("/api/admin/users");
const data = await res.json();
```

### Style & Theme
- Gunakan Tailwind tokens (`globals.css`)
- Prefer `flexbox` > `grid`
- Gunakan prefix responsif: `md:`, `lg:`, `xl:`

### Component Reusability
- Gunakan `shadcn/ui`
- Tangani loading & error state dengan baik

---

## Production Deployment

### Checklist 
- Fiksasi tampilan UI
- Mock API → diganti real backend
- `.env` lengkap
- Security & performance review
- Testing (unit/E2E)
- Accessibility & SEO pass

### Env Example
```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_URL=https://app.example.com
DATABASE_URL=postgresql://...
```


---

## Troubleshooting
| Masalah & Solusi
| Mock API tidak respond : Cek async/await 
| Auth loop: Hapus `authUser` di localStorage 
| Styling error: Jalankan `rm -rf .next && pnpm dev` 

---

## Project Status
Draft: 
- Fitur utama masih dalam tahap pengembangan  
- Mock API aktif  
- UI responsif  
- Error/loading state handled  

---

## Support & Dokumentasi
- **API Docs:** `lib/api-contract.jsx`  
- **Use Case:** Dokumen Milestone 2 LSP STIS  
- **Testing:** lihat `*.test.jsx` (belum lengkap)

---

**Developed for:** LSP Politeknik Statistika STIS  
**Version:** 1.0.0  
