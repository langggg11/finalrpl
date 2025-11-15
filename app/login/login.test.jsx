import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from './page'
import { AuthProvider, useAuth } from '@/lib/auth-context' // Kita butuh Provider aslinya

// Mock 'next/navigation' karena Vitest gak ngerti router Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(), // Bikin fungsi push() palsu
  }),
}))

// Mock 'useAuth' biar kita bisa kontrol output-nya
vi.mock('@/lib/auth-context', async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod, // impor semua aslinya
    useAuth: vi.fn(), // tapi 'useAuth' kita palsuin (mock)
  }
})

// Bikin mock function 'login'
const mockLogin = vi.fn()

describe('LoginPage (Integration Test)', () => {
  
  // Setup mock 'useAuth' sebelum tiap tes jalan
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
    })
    mockLogin.mockClear() // Bersihin history panggilan tes sebelumnya
  })

  it('should render login form correctly', () => {
    render(<LoginPage />) // Gak perlu <AuthProvider> karena kita mock hook-nya

    // Cek apakah elemen-elemen penting ada di layar
    expect(screen.getByText('Selamat Datang!')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Nama / Password (untuk testing)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Masuk dengan Akun STIS' })).toBeInTheDocument()
  })
  
  it('should allow user to type in manual login form', async () => {
    const user = userEvent.setup() // Inisialisasi user-event
    render(<LoginPage />)

    const emailInput = screen.getByLabelText('Email')
    const namaInput = screen.getByLabelText('Nama / Password (untuk testing)')

    // Simulasi user ngetik
    await user.type(emailInput, 'admin@stis.ac.id')
    await user.type(namaInput, 'Admin Ganteng')

    // Cek hasilnya
    expect(emailInput.value).toBe('admin@stis.ac.id')
    expect(namaInput.value).toBe('Admin Ganteng')
  })

  it('should call manual login function on submit', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    // Isi form
    await user.type(screen.getByLabelText('Email'), 'admin@stis.ac.id')
    await user.type(screen.getByLabelText('Nama / Password (untuk testing)'), 'Admin Ganteng')
    
    // Klik tombol "Masuk"
    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    // Cek apakah fungsi 'login' dari context kita dipanggil
    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledWith('admin@stis.ac.id', 'Admin Ganteng')
  })

  it('should call SSO login function on button click', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    // Klik tombol SSO
    await user.click(screen.getByRole('button', { name: 'Masuk dengan Akun STIS' }))

    // Cek apakah fungsi 'login' dipanggil dengan data mock SSO
    expect(mockLogin).toHaveBeenCalledTimes(1)
    expect(mockLogin).toHaveBeenCalledWith('222310001@stis.ac.id', 'Nadia Nisrina')
  })
})