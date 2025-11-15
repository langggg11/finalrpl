import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AsesiDashboard from './page'
import { useAuth } from '@/lib/auth-context'
import * as apiMock from '@/lib/api-mock'

// 1. Mock 'next/navigation' (untuk router.push)
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// 2. Mock 'useAuth'
vi.mock('@/lib/auth-context', () => ({
  useAuth: vi.fn(),
}))

// 3. Mock 'api-mock' (untuk fetching progress)
vi.mock('@/lib/api-mock', () => ({
  mockGetProgressAsesi: vi.fn(),
}))

// Data mock user
const mockUser = {
  id: 'asesi-test',
  nama: 'Asesi Test',
  skemaId: 'ADS',
  role: 'ASESI'
}

// --- FIX HELPER: Menggunakan getAllByText untuk mengatasi duplikasi rendering di JSDOM ---
const findFaseCardByPhaseLabel = (faseLabelText) => {
    // getByText gagal karena ada 2 hasil (mobile dan desktop viewports)
    // Kita gunakan getAllByText dan ambil elemen pertama.
    // Elemen Fase Label adalah <p> di dalam FaseCard.
    const allLabels = screen.getAllByText(faseLabelText); 
    
    // Ambil elemen pertama. class .shadow-sm adalah class Card terluar.
    return allLabels[0].closest('.shadow-sm'); 
};
// -----------------------------------------------------------------------------------------


describe('AsesiDashboard (Logika Fase)', () => {
  beforeEach(() => {
    // Setup environment
    vi.mocked(useAuth).mockReturnValue({ user: mockUser, isLoggedIn: true })
    vi.mocked(apiMock.mockGetProgressAsesi).mockClear()
    mockPush.mockClear()
  })

  // --- TEST CASE 1: Pra-Asesmen Belum Selesai (PASSING) ---
  it('should redirect to Pra-Asesmen page if statusPraAsesmen is BELUM', async () => {
    vi.mocked(apiMock.mockGetProgressAsesi).mockResolvedValue({ 
      statusPraAsesmen: 'BELUM' 
    })
    
    render(<AsesiDashboard />)
    
    await waitFor(() => {
      expect(apiMock.mockGetProgressAsesi).toHaveBeenCalledWith(mockUser.id)
      expect(mockPush).toHaveBeenCalledWith('/asesi/pra-asesmen')
    })
  })

  // --- TEST CASE 2: Fase Awal (Hanya Pembelajaran yang AKTIF) ---
  it('should show Pembelajaran as ACTIVE and others as TERKUNCI when progress is 0%', async () => {
    vi.mocked(apiMock.mockGetProgressAsesi).mockResolvedValue({ 
      statusPraAsesmen: 'SELESAI',
      progressPembelajaran: 0,
      tryoutSelesai: false,
      ujianTeoriSelesai: false,
    })
    
    render(<AsesiDashboard />)
    
    await waitFor(() => {
        // 1. Fase 1: Pembelajaran -> Harus AKTIF (tombol "Mulai")
        const pembelajaranCard = findFaseCardByPhaseLabel('Fase 1: Pembelajaran');
        // Cari role="link" (karena pakai <Link>) dengan nama "Mulai" di dalam scope card ini
        expect(within(pembelajaranCard).getByRole('link', { name: 'Mulai' })).toBeInTheDocument();
        
        // 2. Fase 2: Tryout -> Harus TERKUNCI (tombol "Terkunci")
        const tryoutCard = findFaseCardByPhaseLabel('Fase 2: Tryout');
        expect(within(tryoutCard).getByRole('button', { name: 'Terkunci' })).toBeInTheDocument();
        
        // Cek deskripsi progress Pembelajaran
        expect(within(pembelajaranCard).getByText('0%')).toBeInTheDocument();
    })
  })
  
  // --- TEST CASE 3: Fase Tryout AKTIF (Pembelajaran SELESAI) ---
  it('should show Tryout as ACTIVE when Pembelajaran is 100%', async () => {
    vi.mocked(apiMock.mockGetProgressAsesi).mockResolvedValue({ 
      statusPraAsesmen: 'SELESAI',
      progressPembelajaran: 100, 
      tryoutSelesai: false, 
      ujianTeoriSelesai: false,
    })
    
    render(<AsesiDashboard />)
    
    await waitFor(() => {
        // 1. Fase 1: Pembelajaran -> Harus SELESAI (teks "Selesai")
        const pembelajaranCard = findFaseCardByPhaseLabel('Fase 1: Pembelajaran');
        // Mencari teks "Selesai" di dalam scope card Pembelajaran
        expect(within(pembelajaranCard).getByText('Selesai')).toBeInTheDocument();
        
        // 2. Fase 2: Tryout -> Harus AKTIF (tombol "Mulai")
        const tryoutCard = findFaseCardByPhaseLabel('Fase 2: Tryout');
        expect(within(tryoutCard).getByRole('link', { name: 'Mulai' })).toBeInTheDocument();
        
        // 3. Fase 3: Ujian Teori -> Harus TERKUNCI
        const teoriCard = findFaseCardByPhaseLabel('Fase 3: Ujian Teori');
        expect(within(teoriCard).getByRole('button', { name: 'Terkunci' })).toBeInTheDocument();
    })
  })
})