const SKEMA_ADS_UNITS = [
  { nomorUnit: 1, kodeUnit: "J.62DMI00.004.1", judul: "Mengumpulkan data", durasiTeori: 15 },
  { nomorUnit: 2, kodeUnit: "J.62DMI00.005.1", judul: "Menelaah Data", durasiTeori: 20 },
  { nomorUnit: 3, kodeUnit: "J.62DMI00.006.1", judul: "Memvalidasi Data", durasiTeori: 20 },
  { nomorUnit: 4, kodeUnit: "J.62DMI00.007.1", judul: "Menentukan Objek Data", durasiTeori: 20 },
  { nomorUnit: 5, kodeUnit: "J.62DMI00.008.1", judul: "Membersihkan Data", durasiTeori: 15 },
  { nomorUnit: 6, kodeUnit: "J.62DMI00.009.1", judul: "Mengkonstruksi Data", durasiTeori: 25 },
  { nomorUnit: 7, kodeUnit: "J.62DMI00.010.1", judul: "Menentukan Label Data", durasiTeori: 25 },
  { nomorUnit: 8, kodeUnit: "J.62DMI00.013.1", judul: "Membangun Model", durasiTeori: 15 },
  { nomorUnit: 9, kodeUnit: "J.62DMI00.014.1", judul: "Mengevaluasi Hasil Pemodelan", durasiTeori: 30 },
];

const SKEMA_DS_UNITS = [
  { nomorUnit: 1, kodeUnit: "J.62DMI00.001.1", judul: "Menentukan Objektif Bisnis", durasiTeori: 20 },
  { nomorUnit: 2, kodeUnit: "J.62DMI00.002.1", judul: "Menentukan Tujuan Teknis Data Science", durasiTeori: 25 },
  { nomorUnit: 3, kodeUnit: "J.62DMI00.005.1", judul: "Menelaah Data", durasiTeori: 25 },
  { nomorUnit: 4, kodeUnit: "J.62DMI00.006.1", judul: "Memvalidasi Data", durasiTeori: 20 },
  { nomorUnit: 5, kodeUnit: "J.62DMI00.007.1", judul: "Menentukan Objek Data", durasiTeori: 15 },
  { nomorUnit: 6, kodeUnit: "J.62DMI00.008.1", judul: "Membersihkan Data", durasiTeori: 30 },
  { nomorUnit: 7, kodeUnit: "J.62DMI00.009.1", judul: "Mengkonstruksi Data", durasiTeori: 30 },
  { nomorUnit: 8, kodeUnit: "J.62DMI00.012.1", judul: "Membangun Skenario Model", durasiTeori: 25 },
  { nomorUnit: 9, kodeUnit: "J.62DMI00.013.1", judul: "Membangun Model", durasiTeori: 25 },
  { nomorUnit: 10, kodeUnit: "J.62DMI00.014.1", judul: "Mengevaluasi Hasil Pemodelan", durasiTeori: 20 },
  { nomorUnit: 11, kodeUnit: "J.62DMI00.015.1", judul: "Melakukan Proses Review Pemodelan", durasiTeori: 35 },
];

// "Mock Database" untuk Skema dan Unit
const allSkemaDb = new Map();
allSkemaDb.set("ADS", {
  id: "ADS",
  judul: "Associate Data Scientist",
  deskripsi: "Skema sertifikasi profesi untuk D3 Statistika.",
  totalUnit: SKEMA_ADS_UNITS.length,
});
allSkemaDb.set("DS", {
  id: "DS",
  judul: "Data Scientist",
  deskripsi: "Skema sertifikasi profesi untuk D4 Statistika.",
  totalUnit: SKEMA_DS_UNITS.length,
});

const allUnitsDb = new Map();
// Inisialisasi data unit untuk ADS
allUnitsDb.set(
  "ADS",
  SKEMA_ADS_UNITS.map((unit, idx) => ({
    id: `ADS-${unit.nomorUnit}`,
    skemaId: "ADS",
    nomorUnit: unit.nomorUnit,
    kodeUnit: unit.kodeUnit, // Menambahkan kodeUnit
    judul: unit.judul,
    deskripsi: `Deskripsi lengkap untuk ${unit.judul}`,
    materiCount: 3, // mock count
    soalCount: 8, // mock count
    durasiTeori: unit.durasiTeori || 15,
    urutan: idx + 1,
  }))
);

// Inisialisasi data unit untuk DS
allUnitsDb.set(
  "DS",
  SKEMA_DS_UNITS.map((unit, idx) => ({
    id: `DS-${unit.nomorUnit}`,
    skemaId: "DS",
    nomorUnit: unit.nomorUnit,
    kodeUnit: unit.kodeUnit, // Menambahkan kodeUnit
    judul: unit.judul,
    deskripsi: `Deskripsi lengkap untuk ${unit.judul}`,
    materiCount: 3, // mock count
    soalCount: 8, // mock count
    durasiTeori: unit.durasiTeori || 15,
    urutan: idx + 1,
  }))
);

// DB Soal (harus didefinisikan setelah allUnitsDb)
const allSoalDb = new Map();
// Loop-nya sekarang pake data dinamis dari allUnitsDb
allUnitsDb.get("ADS").forEach((unit) => {
  const unitId = unit.id; // "ADS-1"
  allSoalDb.set(unitId, [
    { id: `${unitId}-tryout-1`, unitId, tipeSoal: "TRYOUT", tipeJawaban: "ESAI", teks: `[Tryout ADS] Jelaskan konsep utama dari ${unit.judul}?`, urutan: 1 },
    { id: `${unitId}-teori-1`, unitId, tipeSoal: "UJIAN_TEORI", tipeJawaban: "ESAI", teks: `[Ujian Teori ADS] Apa definisi dan aplikasi dari ${unit.judul}?`, kunciJawaban: "definisi|aplikasi", urutan: 1 },
    { id: `${unitId}-teori-2`, unitId, tipeSoal: "UJIAN_TEORI", tipeJawaban: "ESAI", teks: `[Ujian Teori ADS] Bagaimana ${unit.judul} berkontribusi pada proses bisnis?`, kunciJawaban: "bisnis|kontribusi", urutan: 2 },
    { id: `${unitId}-teori-3`, unitId, tipeSoal: "UJIAN_TEORI", tipeJawaban: "ESAI", teks: `[Ujian Teori ADS] Sebutkan 2 tantangan utama dalam implementasi ${unit.judul}?`, kunciJawaban: "tantangan", urutan: 3 },
    {
      id: `${unitId}-praktikum-1`,
      unitId,
      tipeSoal: "UJIAN_PRAKTIKUM",
      tipeJawaban: "UPLOAD_FILE",
      teks: `Kerjakan studi kasus praktikum ADS terkait ${unit.judul}.`,
      fileTemplateSoal: `https://example.com/soal-praktikum-${unitId}.zip`,
      urutan: 1,
    },
  ]);
});
allUnitsDb.get("DS").forEach((unit) => {
  const unitId = unit.id; // "DS-1"
  allSoalDb.set(unitId, [
    { id: `${unitId}-tryout-1`, unitId, tipeSoal: "TRYOUT", tipeJawaban: "ESAI", teks: `[Tryout DS] Jelaskan konsep utama dari ${unit.judul}?`, urutan: 1 },
    { id: `${unitId}-teori-1`, unitId, tipeSoal: "UJIAN_TEORI", tipeJawaban: "ESAI", teks: `[Ujian Teori DS] Apa perbedaan ${unit.judul} dengan metode konvensional?`, kunciJawaban: "definisi|aplikasi", urutan: 1 },
    { id: `${unitId}-teori-2`, unitId, tipeSoal: "UJIAN_TEORI", tipeJawaban: "ESAI", teks: `[Ujian Teori DS] Bagaimana ${unit.judul} berkontribusi pada proses bisnis skala besar?`, kunciJawaban: "bisnis|kontribusi", urutan: 2 },
    { id: `${unitId}-teori-3`, unitId, tipeSoal: "UJIAN_TEORI", tipeJawaban: "ESAI", teks: `[Ujian Teori DS] Sebutkan 2 tantangan utama dalam implementasi ${unit.judul}?`, kunciJawaban: "tantangan", urutan: 3 },
    {
      id: `${unitId}-praktikum-1`,
      unitId,
      tipeSoal: "UJIAN_PRAKTIKUM",
      tipeJawaban: "UPLOAD_FILE",
      teks: `Kerjakan studi kasus praktikum DS terkait ${unit.judul}.`,
      fileTemplateSoal: `https://example.com/soal-praktikum-${unitId}.zip`,
      urutan: 1,
    },
  ]);
});

// ==================== DATA GENERATORS ====================

const firstNames = ["Nadia", "Rezky", "Rani", "Galang", "Nailatur", "Meldiro", "Naila", "Budi", "Siti", "Ahmad", "Dewi", "Eko", "Fitri", "Hadi", "Indah", "Joko"];
const lastNames = ["Nisrina", "Kilwouw", "Kusumawati", "Nugroho", "Rajaa", "Ferreira", "Hanifa", "Santoso", "Nurhaliza", "Ridho", "Lestari", "Prasetyo", "Handayani", "Wijaya", "Permata", "Susanto"];
const getRandomName = () => `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

function generateAsesiData() {
  const asesiList = [];

  const dsKelasList = ["4SI1", "4SI2", "4SD1", "4SE1", "4SK1"]; // D4 (DS)
  const adsKelasList = ["3SD1", "3SD2", "3SD3"]; // D3 (ADS)

  // Generate 350 Asesi DS (D4)
  for (let i = 1; i <= 350; i++) {
    const nim = String(222310000 + i);
    let kelas = dsKelasList[i % dsKelasList.length];
    asesiList.push({
      id: `asesi-ds-${i}`,
      email: `${nim}@stis.ac.id`,
      nama: getRandomName(),
      role: "ASESI",
      nim,
      skemaId: "DS",
      kelas: kelas,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Generate 150 Asesi ADS (D3)
  for (let i = 1; i <= 150; i++) {
    const nim = String(222350000 + i);
    let kelas = adsKelasList[i % adsKelasList.length];
    asesiList.push({
      id: `asesi-ads-${i}`,
      email: `${nim}@stis.ac.id`,
      nama: getRandomName(),
      role: "ASESI",
      nim,
      skemaId: "ADS",
      kelas: kelas,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return asesiList;
}

function generateAsesorData() {
  const asesorList = [];
  const dosenNames = ["Dr. Ernawati P", "Nori Wilantika", "Dr. Erni T", "Dr. Novi H", "Ibnu Santoso", "Rini Rahani", "Budi Yuniarto", "Sukim", "Winih Budiarti", "Sri Herwanto"];
  for (let i = 1; i <= 10; i++) {
    const nama = `Asesor DS ${i}`;
    asesorList.push({ id: `asesor-ds-${i}`, email: `asesor.ds${i}@stis.ac.id`, nama: dosenNames[i - 1] || nama, role: "ASESOR", nip: String(198001010000000000 + i), skemaKeahlian: ["DS"], createdAt: new Date(), updatedAt: new Date() });
  }
  for (let i = 1; i <= 10; i++) {
    const nama = `Asesor ADS ${i}`;
    asesorList.push({ id: `asesor-ads-${i}`, email: `asesor.ads${i}@stis.ac.id`, nama: dosenNames[i] || nama, role: "ASESOR", nip: String(198001010000000100 + i), skemaKeahlian: ["ADS"], createdAt: new Date(), updatedAt: new Date() });
  }
  asesorList.push({ id: `asesor-all-1`, email: `asesor.all1@stis.ac.id`, nama: "Prof. Bimbingan", role: "ASESOR", nip: String(197001010000000100), skemaKeahlian: ["ADS", "DS"], createdAt: new Date(), updatedAt: new Date() });
  return asesorList;
}

const adminUsers = [
  { id: "admin-1", email: "admin@stis.ac.id", nama: "Admin LSP Polstat", role: "ADMIN_LSP", nip: "199001011990001001", createdAt: new Date(), updatedAt: new Date() },
  { id: "admin-2", email: "admin2@stis.ac.id", nama: "Super Admin", role: "ADMIN_LSP", nip: "199101011991001001", createdAt: new Date(), updatedAt: new Date() },
];

const asesiUsers = generateAsesiData();
const asesorUsers = generateAsesorData();
const allUsers = [...adminUsers, ...asesiUsers, ...asesorUsers];

// fungsi untuk MEMBACA dan MENYIMPAN progressMap
// Kita akan simpan data Map sebagai Array [key, value] di localStorage

const MOCK_DB_PROGRESS_KEY = "mockProgressMap";

function getProgressMapFromStorage() {
  // Cek apakah kita ada di browser (punya 'window')
  if (typeof window === "undefined") {
    return new Map();
  }

  const data = localStorage.getItem(MOCK_DB_PROGRESS_KEY);
  if (data) {
    try {
      const arr = JSON.parse(data);
      // Konversi data dari localStorage kembali ke Map
      const map = new Map(arr);

      // Penting: Ubah Array (dari JSON) kembali menjadi Set
      map.forEach((value) => {
        value.completedUnitIds = new Set(value.completedUnitIds);
        value.viewedMateriIds = new Set(value.viewedMateriIds || []);
      });
      return map;
    } catch (e) {
      console.error("Gagal memuat mock DB progress:", e);
      return new Map();
    }
  }
  return new Map();
}

function saveProgressMapToStorage(map) {
  if (typeof window === "undefined") return;

  // Konversi Map ke [key, value] array agar bisa di-JSON
  const arr = Array.from(map.entries()).map(([key, value]) => {
    // Penting: Ubah Set jadi Array agar bisa disimpan di JSON
    return [
      key,
      {
        ...value,
        completedUnitIds: Array.from(value.completedUnitIds),
        viewedMateriIds: Array.from(value.viewedMateriIds || new Set()),
      },
    ];
  });

  localStorage.setItem(MOCK_DB_PROGRESS_KEY, JSON.stringify(arr));
}

// Inisialisasi 'progressMap' dari localStorage
// `progressMap` sekarang adalah database "live" kita yang persistent
let progressMap = getProgressMapFromStorage();

// Fungsi 'calculateProgress' harus membaca dari 'progressMap' yang 'live') ---
function calculateProgress(asesiId) {
  const progress = progressMap.get(asesiId); // <-- Ini sudah 'let progressMap'
  if (!progress) return 0;
  const unitsInSkema = allUnitsDb.get(progress.skemaId) || [];
  if (unitsInSkema.length === 0) return 0;
  return Math.round((progress.completedUnitIds.size / unitsInSkema.length) * 100);
}

// Kita tidak lagi mengisi progressMap di sini. Kita akan mengisinya
// "on-the-fly" di dalam `mockGetProgressAsesi` jika datanya belum ada.

const penugasanMap = new Map();
function generatePenugasanData() {
  let penugasanId = 0;
  const selectedAsesi = asesiUsers.slice(0, 50);

  selectedAsesi.forEach((asesi) => {
    const skema = asesi.skemaId;
    const units = allUnitsDb.get(skema) || [];
    const asesorList = asesorUsers.filter((a) => a.skemaKeahlian.includes(skema));

    units.forEach((unit) => {
      const asesor = asesorList[Math.floor(Math.random() * asesorList.length)];
      const id = `penugasan-${penugasanId++}`;
      penugasanMap.set(id, {
        id: id,
        asesorId: asesor.id,
        asesiId: asesi.id,
        asesiNama: asesi.nama,
        skemaId: skema,
        unitId: unit.nomorUnit,
        unitJudul: unit.judul,
        tipe: "TEORI",
        statusPenilaian: "BELUM_DINILAI",
        nilai: null,
        feedback: null,
        nilaiKompetensi: "BELUM_DINILAI",
      });
    });

    const asesorPraktikum = asesorList[Math.floor(Math.random() * asesorList.length)];
    const idPraktikum = `penugasan-${penugasanId++}`;
    penugasanMap.set(idPraktikum, {
      id: idPraktikum,
      asesorId: asesorPraktikum.id,
      asesiId: asesi.id,
      asesiNama: asesi.nama,
      skemaId: skema,
      unitId: null,
      unitJudul: "Studi Kasus Praktikum (Gabungan)",
      tipe: "PRAKTIKUM",
      statusPenilaian: "BELUM_DINILAI",
      nilai: null,
      feedback: null,
      nilaiKompetensi: "BELUM_DINILAI",
    });

    const asesorUnjukDiri = asesorList[Math.floor(Math.random() * asesorList.length)];
    const idUnjukDiri = `penugasan-${penugasanId++}`;
    penugasanMap.set(idUnjukDiri, {
      id: idUnjukDiri,
      asesorId: asesorUnjukDiri.id,
      asesiId: asesi.id,
      asesiNama: asesi.nama,
      skemaId: skema,
      unitId: null,
      unitJudul: "Presentasi Unjuk Diri (Gabungan)",
      tipe: "UNJUK_DIRI",
      statusPenilaian: "BELUM_DINILAI",
      nilai: null,
      feedback: null,
      nilaiKompetensi: "BELUM_DINILAI",
    });
  });
}
generatePenugasanData();

const sesiUjianOfflineDb = new Map();
const plottingDb = new Map();

function generateSesiUjianData() {
  const today = new Date();
  const sesiDS = {
    id: "sesi-ds-1",
    skemaId: "DS",
    tanggal: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
    waktu: "09:00",
    tipeUjian: "UNJUK_DIRI",
    ruangan: "Auditorium STIS",
    kapasitas: 50,
  };
  const sesiADS = {
    id: "sesi-ads-1",
    skemaId: "ADS",
    tanggal: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
    waktu: "13:00",
    tipeUjian: "UNJUK_DIRI",
    ruangan: "Ruang 301",
    kapasitas: 30,
  };
  sesiUjianOfflineDb.set(sesiDS.id, sesiDS);
  plottingDb.set(sesiDS.id, ["asesi-ds-1", "asesi-ds-2"]);
  sesiUjianOfflineDb.set(sesiADS.id, sesiADS);
  plottingDb.set(sesiADS.id, []);
}
generateSesiUjianData();

// ==================== MOCK FUNCTIONS ====================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockGetAllSkema() {
  await delay(300);
  return Array.from(allSkemaDb.values());
}

export async function mockCreateSkema(skemaData) {
  await delay(500);
  if (!skemaData.id || !skemaData.judul) {
    throw new Error("ID Skema dan Judul Skema wajib diisi.");
  }
  const cleanId = skemaData.id.toUpperCase().replace(/\s+/g, "_");

  if (allSkemaDb.has(cleanId)) {
    throw new Error(`ID Skema '${cleanId}' sudah ada. Harap gunakan ID lain.`);
  }

  const newSkema = {
    id: cleanId,
    judul: skemaData.judul,
    deskripsi: skemaData.deskripsi || "",
    totalUnit: 0,
  };

  allSkemaDb.set(newSkema.id, newSkema);
  allUnitsDb.set(newSkema.id, []);
  return newSkema;
}

export async function mockLoginSSO(email, nama) {
  await delay(800);
  let user = allUsers.find((u) => u.email === email);
  if (!user) {
    const isNIM = /^\d{9}@stis\.ac\.id$/.test(email);

    let skemaId, kelas;
    const nimStr = email.split("@")[0];

    const dsKelasList = ["4SI1", "4SI2", "4SD1", "4SE1", "4SK1"];
    const adsKelasList = ["3SD1", "3SD2", "3SD3"];

    if (nimStr.startsWith("22235")) {
      skemaId = "ADS";
      kelas = adsKelasList[Math.floor(Math.random() * adsKelasList.length)];
    } else {
      skemaId = "DS";
      kelas = dsKelasList[Math.floor(Math.random() * dsKelasList.length)];
    }

    user = {
      id: `user-${Date.now()}`,
      email,
      nama,
      role: isNIM ? "ASESI" : "ASESOR",
      nim: isNIM ? nimStr : undefined,
      nip: !isNIM ? "199001010000001001" : undefined,
      skemaId: isNIM ? skemaId : undefined,
      kelas: isNIM ? kelas : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    allUsers.push(user);
    if (isNIM) {
      // Saat user baru login, kita TIDAK isi progressMap di sini.
      // Kita biarkan mockGetProgressAsesi yang membuatnya.
    }
  }
  return user;
}

export async function mockGetAllUsers() {
  await delay(600);
  return allUsers;
}
export async function mockGetAsesiUsers() {
  await delay(600);
  return allUsers.filter((u) => u.role === "ASESI");
}
export async function mockGetAsesorUsers() {
  await delay(600);
  return allUsers.filter((u) => u.role === "ASESOR");
}
export async function mockGetAdminUsers() {
  await delay(600);
  return allUsers.filter((u) => u.role === "ADMIN_LSP");
}

export async function mockUpdateUserRole(userId, newRole) {
  await delay(500);
  const user = allUsers.find((u) => u.id === userId);
  if (!user) throw new Error("User tidak ditemukan");
  if (user.role === "ASESI") throw new Error("Role Asesi tidak dapat diubah secara manual!");
  user.role = newRole;
  user.updatedAt = new Date();
  return user;
}

export async function mockGetUnitsForSkema(skemaId) {
  await delay(400);
  const units = allUnitsDb.get(skemaId) || [];
  return units;
}

export async function mockGetMateriForUnit(unitId) {
  await delay(300);
  return [
    { id: `${unitId}-m1`, unitId, judul: "Video: Pengenalan Unit", jenis: "VIDEO", urlKonten: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", urutan: 1 },
    { id: `${unitId}-m2`, unitId, judul: "Slide PDF: Konsep Inti", jenis: "PDF", urlKonten: "https://example.com/slide.pdf", urutan: 2 },
    { id: `${unitId}-m3`, unitId, judul: "Link: Bacaan Tambahan", jenis: "LINK", urlKonten: "https://en.wikipedia.org/wiki/Data_science", urutan: 3 },
  ];
}

export async function mockGetSoalForUnit(unitId, tipeSoal) {
  await delay(300);
  const allSoal = allSoalDb.get(unitId) || [];
  if (tipeSoal === "SEMUA" || !tipeSoal) return allSoal;
  return allSoal.filter((s) => s.tipeSoal === tipeSoal);
}

/*
  Simulasi GET /api/asesi/progress. Mengambil data progres Asesi yang sedang login.
*/
export async function mockGetProgressAsesi(asesiId) {
  await delay(400);

  // Baca 'progressMap' terbaru dari storage
  progressMap = getProgressMapFromStorage();
  let progress = progressMap.get(asesiId);

  // Jika progres untuk user ini BELUM ADA di storage...
  if (!progress) {
    const user = allUsers.find((u) => u.id === asesiId);
    const skemaId = user?.skemaId || "ADS";
    const unitsInSkema = allUnitsDb.get(skemaId) || [];

    // Inisialisasi data progres awal (contoh: 3 unit selesai)
    const completedIds = new Set(unitsInSkema.slice(0, 3).map((u) => u.id));

    progress = {
      asesiId,
      skemaId,
      fase: "PEMBELAJARAN",
      completedUnitIds: completedIds, // Ini adalah Set
      viewedMateriIds: new Set(), // Ini adalah Set
      progressPembelajaran: Math.round((completedIds.size / (unitsInSkema.length || 1)) * 100),
      statusPraAsesmen: "BELUM",
      tryoutSelesai: false,
      ujianTeoriSelesai: false,
    };

    progressMap.set(asesiId, progress);
    saveProgressMapToStorage(progressMap); // Langsung simpan progres baru
  }

  // Kembalikan progres sebagai Array (format JSON-safe)
  return {
    ...progress,
    completedUnitIds: Array.from(progress.completedUnitIds),
    viewedMateriIds: Array.from(progress.viewedMateriIds || new Set()),
  };
}

// untuk menyimpan materi 'dilihat'
export async function mockMarkMateriViewed(asesiId, materiId) {
  await delay(200);

  // Ambil data terbaru, mutasi, lalu simpan
  progressMap = getProgressMapFromStorage();
  const progress = progressMap.get(asesiId);

  if (progress) {
    progress.viewedMateriIds.add(materiId);
    saveProgressMapToStorage(progressMap); // <-- Simpan ke localStorage

    console.log(`[Mock] Asesi ${asesiId} melihat materi ${materiId}.`);

    // Kembalikan progress terbaru (ubah Set ke Array)
    return {
      ...progress,
      completedUnitIds: Array.from(progress.completedUnitIds),
      viewedMateriIds: Array.from(progress.viewedMateriIds),
    };
  }
  throw new Error("Progress Asesi tidak ditemukan saat menandai materi.");
}

/* simulasi dari POST /api/asesi/units/complete.
 */
export async function mockMarkUnitCompleted(asesiId, unitId) {
  await delay(500);

  progressMap = getProgressMapFromStorage();
  const progress = progressMap.get(asesiId);

  if (progress) {
    progress.completedUnitIds.add(unitId); // Mutasi Data
    progress.progressPembelajaran = calculateProgress(asesiId);
    saveProgressMapToStorage(progressMap); // <-- Simpan ke localStorage

    console.log(`[Mock] Asesi ${asesiId} menyelesaikan unit ${unitId}. Progress: ${progress.progressPembelajaran}%`);

    return {
      ...progress,
      completedUnitIds: Array.from(progress.completedUnitIds),
      viewedMateriIds: Array.from(progress.viewedMateriIds),
    };
  }
}

/*
  POST /api/asesi/.../submit.
*/
export async function mockSubmitTryout(asesiId, answers) {
  await delay(700);

  progressMap = getProgressMapFromStorage();
  const progress = progressMap.get(asesiId);

  if (progress) {
    progress.tryoutSelesai = true;
    progress.fase = "TRYOUT";
    saveProgressMapToStorage(progressMap); // Simpan ke localStorage
    console.log(`[Mock] Asesi ${asesiId} menyelesaikan tryout. Jawaban:`, answers);
  }
  return { success: true, message: "Tryout berhasil disubmit." };
}

export async function mockSubmitUjianTeori(asesiId, answers) {
  await delay(1000);

  progressMap = getProgressMapFromStorage();
  const progress = progressMap.get(asesiId);

  if (progress) {
    progress.ujianTeoriSelesai = true;
    progress.fase = "UJIAN_TEORI";
    saveProgressMapToStorage(progressMap); // <-- Simpan ke localStorage
    console.log(`[Mock] Asesi ${asesiId} menyelesaikan Ujian Teori. Jawaban:`, answers);
  }
  return { success: true, message: "Ujian Teori berhasil disubmit." };
}

export async function mockSubmitPraAsesmen(asesiId, data) {
  await delay(1000);

  progressMap = getProgressMapFromStorage();
  const progress = progressMap.get(asesiId);

  if (progress) {
    progress.statusPraAsesmen = "SELESAI";
    saveProgressMapToStorage(progressMap); // Simpan ke localStorage
    console.log(`[Mock] Asesi ${asesiId} menyelesaikan Pra-Asesmen. Data:`, data);
  }
  return { success: true, message: "Pra-Asesmen berhasil disubmit." };
}

/*
  Simulasi GET /api/asesor/penugasan. Mengambil daftar tugas penilaian untuk Asesor yang login.
  Memfilter penugasanMap (yang sudah dibuat acak saat load) berdasarkan asesorId
*/
export async function mockGetPenugasanAsesor(asesorId) {
  await delay(500);
  return Array.from(penugasanMap.values()).filter((p) => p.asesorId === asesorId);
}

/*
  Simulasi GET /api/asesor/penugasan/[id]. Mengambil detail satu tugas (misal: jawaban esai Asesi).
  Mengambil satu data dari penugasanMap.
*/
export async function mockGetPenugasanAsesi(asesiId) {
  await delay(500);
  return Array.from(penugasanMap.values()).filter((p) => p.asesiId === asesiId);
}

export async function mockGetPenugasanDetail(penugasanId) {
  await delay(300);
  const penugasan = penugasanMap.get(penugasanId);
  if (!penugasan) {
    throw new Error("Penugasan tidak ditemukan");
  }
  return penugasan;
}

/*
  Simulasi GET /api/asesi/schedule/offline. Mengambil jadwal ujian offline spesifik untuk Asesi yang login.
  Kebalikan dari mockGetAsesiBelumDiplot
  Mencari di plottingDb untuk melihat Asesi ini terdaftar di sesi mana saja, 
  lalu mengembalikan detail sesi tersebut.
*/
export async function mockGetPlottingAsesi(asesiId) {
  await delay(300);
  const myPlotting = [];
  for (const [sesiId, asesiIds] of plottingDb.entries()) {
    if (asesiIds.includes(asesiId)) {
      const sesiDetail = sesiUjianOfflineDb.get(sesiId);
      if (sesiDetail) {
        myPlotting.push(sesiDetail);
      }
    }
  }
  return myPlotting;
}

export async function mockGetPenugasanAsesiCount() {
  await delay(300);
  return penugasanMap.size;
}

export async function mockGetPendingGradingCount() {
  await delay(300);
  return Array.from(penugasanMap.values()).filter((p) => p.statusPenilaian === "BELUM_DINILAI").length;
}

/*
  Simulasi POST /api/asesor/penugasan/[id]/submit. Asesor mengirimkan hasil penilaian.
  fungsi mutasi untuk Asesor
  mengubah data di penugasanMap dengan statusPenilaian = "SELESAI" dan mengisi feedback
  Ini akan membuat tugas tersebut hilang dari daftar "Belum Dinilai" di dashboard Asesor.
*/
export async function mockSubmitNilai(penugasanId, nilai, status, feedback) {
  await delay(600);
  const penugasan = penugasanMap.get(penugasanId);
  if (!penugasan) throw new Error("Penugasan tidak ditemukan");
  penugasan.nilai = nilai;
  penugasan.statusPenilaian = "SELESAI";
  penugasan.nilaiKompetensi = status;
  penugasan.feedback = feedback;
  penugasan.tanggalPenilaian = new Date();

  // TODO: Simpan penugasanMap ke localStorage jika diperlukan

  return penugasan;
}

/*
  Simulasi GET /api/asesi/schedule atau GET /api/admin/timeline. Mengambil jadwal kalender.
  mengembalikan data jadwal hardcoded. Ini dipakai oleh Asesi, Asesor, dan Admin.
*/
export async function mockGetLinimasa(skemaId) {
  await delay(400);
  const today = new Date();
  const linimasa = [
    {
      id: "lin-1",
      skemaId: "ADS",
      judul: "Sosialisasi & Pembukaan Sertifikasi ADS",
      deskripsi: "Penjelasan detail tentang ujian kompetensi ADS.",
      tanggal: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      waktu: "13:00",
      urlZoom: "https://zoom.us/j/12345678901",
      tipe: "PEMBELAJARAN",
    },
    {
      id: "lin-2",
      skemaId: "DS",
      judul: "Sosialisasi & Pembukaan Sertifikasi DS",
      deskripsi: "Penjelasan detail tentang ujian kompetensi DS.",
      tanggal: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      waktu: "15:00",
      urlZoom: "https://zoom.us/j/12345678902",
      tipe: "PEMBELAJARAN",
    },
    {
      id: "lin-3",
      skemaId: skemaId,
      judul: "Sesi Q&A Pembelajaran",
      deskripsi: "Tanya jawab dengan asesor terkait materi.",
      tanggal: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      waktu: "14:00",
      urlZoom: "https://zoom.us/j/12345678903",
      tipe: "PEMBELAJARAN",
    },
    { id: "lin-4", skemaId: skemaId, judul: "Pengumuman: Jadwal Ujian Teori", deskripsi: "Jadwal ujian teori offline telah ditentukan.", tanggal: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), tipe: "PENGUMUMAN" },
  ];
  // Filter skema yang relevan
  const skemaExists = allSkemaDb.has(skemaId);
  return linimasa.filter((l) => l.skemaId === skemaId || !l.skemaId || !skemaExists);
}

/*
  Simulasi GET dan POST untuk app/admin/timeline/page.jsx.
  Fungsi CRUD (Create, Read) standar untuk mengelola "Sesi Ujian Offline" (misal: "Unjuk Diri di Auditorium").
  mockCreateSesiUjianOffline adalah mutator yang menambahkan data baru ke sesiUjianOfflineDb.
*/
export async function mockGetSesiUjianOffline(skemaId) {
  await delay(400);
  const allSesi = Array.from(sesiUjianOfflineDb.values());
  return allSesi.filter((s) => s.skemaId === skemaId);
}

export async function mockGetSesiUjianDetail(sesiId) {
  await delay(300);
  const sesi = sesiUjianOfflineDb.get(sesiId);
  if (!sesi) throw new Error("Sesi tidak ditemukan");
  const asesiTerplot = plottingDb.get(sesiId) || [];
  const asesiDetails = allUsers.filter((u) => asesiTerplot.includes(u.id));
  return { ...sesi, asesiTerplot: asesiDetails };
}

export async function mockCreateSesiUjianOffline(sesi) {
  await delay(600);
  const id = `sesi-${Date.now()}`;
  const newSesi = { ...sesi, id };
  sesiUjianOfflineDb.set(id, newSesi);
  plottingDb.set(id, []);
  // TODO: Simpan sesiUjianOfflineDb dan plottingDb ke localStorage jika perlu
  return newSesi;
}

/*
  Simulasi GET /api/admin/asesi-available. Mengambil daftar Asesi yang "bebas" untuk dimasukkan ke sesi ujian.
  tidak hanya mencari Asesi di skema yang sama, 
  tapi juga mengecek ke semua sesi lain (plottingDb.entries()) 
  untuk memastikan Asesi tersebut tidak di-plot di dua tempat sekaligus.
*/
export async function mockGetAsesiBelumDiplot(skemaId, sesiId) {
  await delay(400);

  const allAsesiSkema = allUsers.filter((u) => u.role === "ASESI" && u.skemaId === skemaId);

  let asesiSudahDiplotDiSesiLain = [];
  for (const [key, asesiList] of plottingDb.entries()) {
    if (key !== sesiId) {
      asesiSudahDiplotDiSesiLain.push(...asesiList);
    }
  }

  const asesiAvailable = allAsesiSkema.filter((u) => !asesiSudahDiplotDiSesiLain.includes(u.id));

  const grupKelas = new Map();
  asesiAvailable.forEach((asesi) => {
    const namaKelas = asesi.kelas || "Lainnya";

    if (!grupKelas.has(namaKelas)) {
      grupKelas.set(namaKelas, []);
    }
    grupKelas.get(namaKelas).push(asesi);
  });

  const hasilGrup = Array.from(grupKelas.entries()).map(([namaKelas, asesi]) => ({
    namaKelas,
    asesi,
  }));

  hasilGrup.sort((a, b) => a.namaKelas.localeCompare(b.namaKelas));

  return hasilGrup;
}

/*
  Simulasi POST /api/admin/offline-exam-sesi/[id]/plotting. Menyimpan daftar peserta ke sebuah sesi.
  Fungsi mutasi untuk Admin
  Menerima daftar ID Asesi dan menyimpannya ke plottingDb
  Mensimulasikan validasi (asesiIds.length > sesi.kapasitas) yang melempar Error jika kapasitas ruangan penuh.
*/
export async function mockUpdatePlottingSesi(sesiId, asesiIds) {
  await delay(500);
  const sesi = sesiUjianOfflineDb.get(sesiId);
  if (!sesi) throw new Error("Sesi tidak ditemukan");
  if (asesiIds.length > sesi.kapasitas) {
    throw new Error("Kapasitas ruangan terlampaui!");
  }
  plottingDb.set(sesiId, asesiIds);
  // TODO: Simpan plottingDb ke localStorage jika perlu
  return { success: true, count: asesiIds.length };
}

/*
  Simulasi GET /api/admin/stats. Mengambil angka-angka untuk dashboard Admin.
  Menghitung jumlah data (.length atau .size) dari berbagai "tabel" Map kita
  Mensimulasikan query SELECT COUNT(*) di SQL.
*/
export async function mockGetStatistics() {
  await delay(500);

  // Baca progressMap terbaru dari storage untuk statistik yang akurat
  progressMap = getProgressMapFromStorage();

  const pendingCount = Array.from(penugasanMap.values()).filter((p) => p.statusPenilaian === "BELUM_DINILAI").length;
  const readyForExam = Array.from(progressMap.values()).filter((p) => p.fase === "TRYOUT" || p.fase === "UJIAN_TEORI").length;
  return {
    totalAsesi: asesiUsers.length,
    totalAsesor: asesorUsers.length,
    totalPenugasan: penugasanMap.size,
    pendingGrading: pendingCount,
    readyForExam: readyForExam,
  };
}

/*
  Simulasi POST /api/admin/assignments. Admin menugaskan asesor ke asesi.
  menerima daftar penugasan dan membuat data baru di penugasanMap
  ensimulasikan logika bulk assign (penugasan massal) yang rumit.
*/
export async function mockAssignAsesorPerUnit(asesiId, assignments) {
  await delay(800);
  console.log(`[Mock] Menugaskan asesor untuk asesi ${asesiId}:`, assignments);
  const asesi = allUsers.find((u) => u.id === asesiId);
  if (!asesi) throw new Error("Asesi tidak ditemukan");

  assignments.forEach((assign) => {
    let id;
    let unitJudul;
    const units = allUnitsDb.get(asesi.skemaId) || []; // Ambil dari DB dinamis

    if (assign.tipe === "TEORI") {
      id = `penugasan-${asesiId}-${assign.unitId}-${assign.tipe}`;
      const unit = units.find((u) => u.nomorUnit == assign.unitId);
      unitJudul = unit?.judul || "Unit tidak ditemukan"; // Handle jika unit tidak ada
    } else {
      id = `penugasan-${asesiId}-${assign.tipe}`;
      unitJudul = assign.tipe === "PRAKTIKUM" ? "Studi Kasus Praktikum (Gabungan)" : "Presentasi Unjuk Diri (Gabungan)";
    }

    penugasanMap.set(id, {
      id: id,
      asesorId: assign.asesorId,
      asesiId: asesiId,
      asesiNama: asesi.nama,
      skemaId: asesi.skemaId,
      unitId: assign.unitId,
      unitJudul: unitJudul,
      tipe: assign.tipe,
      statusPenilaian: "BELUM_DINILAI",
      nilai: null,
      feedback: null,
      nilaiKompetensi: "BELUM_DINILAI",
    });
  });

  // TODO: Simpan penugasanMap ke localStorage jika perlu

  return { success: true, count: assignments.length };
}

/*
  Simulasi GET /api/asesi/results. Mengambil rapor akhir Asesi.
  1. Mengambil semua data nilai Asesi.
  2. Melakukan akumulasi nilai teori (menghitung totalUnitLulus).
  3. Menerapkan aturan kelulusan (totalUnitLulus / totalUnitSkema >= 0.75).
  4. Menggabungkan semua hasil (Teori, Praktikum, Unjuk Diri) untuk menentukan statusAkhir ("KOMPETEN" atau "BELUM_KOMPETEN"). 
*/
export async function mockGetHasilAkhir(asesiId) {
  await delay(700);

  // Baca progressMap terbaru dari storage untuk data yang akurat
  progressMap = getProgressMapFromStorage();
  const progress = progressMap.get(asesiId);
  const skemaId = progress?.skemaId || "DS";
  const units = allUnitsDb.get(skemaId) || []; // Ambil dari DB dinamis
  const totalUnitSkema = units.length;

  if (totalUnitSkema === 0) {
    // Handle skema baru yang belum punya unit
    return {
      asesiId,
      skemaId,
      statusAkhir: "BELUM_KOMPETEN",
      hasilPraktikum: "BELUM_KOMPETEN",
      hasilUnjukDiri: "BELUM_KOMPETEN",
      hasilTeori: { statusAkumulasi: "BELUM_KOMPETEN", totalUnitLulus: 0, totalUnitSkema: 0, rincianUnit: [] },
    };
  }

  // NOTE: Logika hasil akhir ini masih statis (random),
  // idealnya dia membaca 'penugasanMap' yang sudah dinilai asesor
  // Tapi untuk mock, ini sudah cukup.
  let totalUnitLulus = 0;
  const rincianUnit = units.map((unit) => {
    const soalTotal = 4;
    const soalSesuai = Math.floor(Math.random() * 3) + 2;
    const status = soalSesuai / soalTotal >= 0.75 ? "KOMPETEN" : "BELUM_KOMPETEN";
    if (status === "KOMPETEN") totalUnitLulus++;
    return { unitId: unit.id, judul: unit.judul, status: status, soalSesuai: soalSesuai, soalTotal: soalTotal };
  });

  const statusAkumulasiTeori = totalUnitLulus / totalUnitSkema >= 0.75 ? "KOMPETEN" : "BELUM_KOMPETEN";
  const hasilPraktikum = "KOMPETEN";
  const hasilUnjukDiri = "KOMPETEN";
  const statusAkhir = statusAkumulasiTeori === "KOMPETEN" && hasilPraktikum === "KOMPETEN" && hasilUnjukDiri === "KOMPETEN" ? "KOMPETEN" : "BELUM_KOMPETEN";

  if (skemaId === "DS") {
    // Pastikan index-nya ada
    if (rincianUnit[8]) {
      rincianUnit[8].status = "BELUM_KOMPETEN";
      rincianUnit[8].soalSesuai = 2;
    }
    if (rincianUnit[9]) {
      rincianUnit[9].status = "BELUM_KOMPETEN";
      rincianUnit[9].soalSesuai = 1;
    }

    totalUnitLulus = rincianUnit.filter((r) => r.status === "KOMPETEN").length;
    const statusTeoriBaru = totalUnitLulus / totalUnitSkema >= 0.75 ? "KOMPETEN" : "BELUM_KOMPETEN";
    const statusAkhirBaru = statusTeoriBaru === "KOMPETEN" && hasilPraktikum === "KOMPETEN" && hasilUnjukDiri === "KOMPETEN" ? "KOMPETEN" : "BELUM_KOMPETEN";

    return {
      asesiId,
      skemaId,
      statusAkhir: statusAkhirBaru,
      hasilPraktikum,
      hasilUnjukDiri,
      hasilTeori: { statusAkumulasi: statusTeoriBaru, totalUnitLulus, totalUnitSkema, rincianUnit },
    };
  }

  return {
    asesiId,
    skemaId,
    statusAkhir,
    hasilPraktikum,
    hasilUnjukDiri,
    hasilTeori: { statusAkumulasi: statusAkumulasiTeori, totalUnitLulus, totalUnitSkema, rincianUnit },
  };
}
