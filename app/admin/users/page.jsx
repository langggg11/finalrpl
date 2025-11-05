"use client"

import React, { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  mockGetAllUsers,
  mockGetAsesiUsers,
  mockGetAsesorUsers,
  mockGetAdminUsers,
  mockUpdateUserRole,
} from "@/lib/api-mock"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, AlertCircle } from "lucide-react"

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState([])
  const [asesiUsers, setAsesiUsers] = useState([])
  const [asesorUsers, setAsesorUsers] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("asesi") // Default ke asesi
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true) // Set loading di awal
      const [all, asesi, asesor, admin] = await Promise.all([
        mockGetAllUsers(),
        mockGetAsesiUsers(),
        mockGetAsesorUsers(),
        mockGetAdminUsers(),
      ])
      setAllUsers(all)
      setAsesiUsers(asesi)
      setAsesorUsers(asesor)
      setAdminUsers(admin)
    } catch (error) {
      console.error("[v0] Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditRole = (user) => {
    // INI LOGIKA PENTING: LINDUNGI ASESI
    if (user.role === "ASESI") {
      alert("Role Asesi tidak dapat diubah. Role ini diatur otomatis oleh sistem.")
      return
    }
    setSelectedUser(user)
    setNewRole(user.role)
    setIsDialogOpen(true)
  }

  const handleSaveRole = async () => {
    if (!selectedUser || !newRole) return
    setIsSaving(true)
    try {
      await mockUpdateUserRole(selectedUser.id, newRole)
      await loadUsers() // Refresh data setelah save
      setIsDialogOpen(false)
      setSelectedUser(null)
      setNewRole("")
    } catch (error) {
      console.error("[v0] Error updating role:", error)
      alert(`Gagal mengubah role: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const getFilteredUsers = (users) => {
    if (!searchTerm) return users
    return users.filter(
      (user) =>
        user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.nim && user.nim.includes(searchTerm)) ||
        (user.nip && user.nip.includes(searchTerm)),
    )
  }
  
  const getRoleBadge = (role) => {
     switch (role) {
      case "ADMIN_LSP":
        return "bg-purple-100 text-purple-800"
      case "ASESOR":
        return "bg-green-100 text-green-800"
      case "ASESI":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const UserTable = ({ users, isLoading }) => {
    const filteredUsers = getFilteredUsers(users)

    if (isLoading) {
      return (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )
    }

    if (filteredUsers.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada pengguna yang ditemukan</p>
        </div>
      )
    }

    return (
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">Nama</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Identitas (NIM/NIP)</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{user.nama}</td>
                <td className="px-4 py-3 text-gray-600">{user.nim || user.nip || "-"}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRole(user)}
                    className="text-xs"
                    // LOGIKA PENTING: Disable tombol jika role-nya ASESI
                    disabled={user.role === "ASESI"}
                  >
                    Ubah Role
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const stats = [
    { label: "Total Asesi", value: asesiUsers.length, tab: "asesi" },
    { label: "Total Asesor", value: asesorUsers.length, tab: "asesor" },
    { label: "Total Admin", value: adminUsers.length, tab: "admin" },
  ]

  return (
    <MainLayout>
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-gray-600 mt-1">Kelola akun dan peran pengguna (Asesor & Admin) dalam sistem LMS</p>
        </div>
        
        {/* Info Box - Menjelaskan Logika Baru */}
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-900">
                <strong>Catatan:</strong> Role <strong>Asesi</strong> diatur otomatis dari sistem Sipadu/Siakad saat login pertama kali. Anda tidak dapat mengubah role Asesi. Anda hanya dapat mempromosikan Dosen/Staff (yang defaultnya menjadi Asesor) ke role <strong>Admin LSP</strong>.
            </p>
        </div>

        {/* Tabs (Navigasi Sesuai Figma) */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg">
            {stats.map(stat => (
                 <TabsTrigger key={stat.tab} value={stat.tab} className="py-3">
                    {stat.label}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === stat.tab ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                        {loading ? '...' : stat.value}
                    </span>
                 </TabsTrigger>
            ))}
          </TabsList>
          
           {/* Search Bar di atas konten tab */}
           <div className="mt-4 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama, email, NIM, atau NIP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

          <TabsContent value="asesi" className="mt-4">
            <UserTable users={asesiUsers} isLoading={loading} />
          </TabsContent>
          <TabsContent value="asesor" className="mt-4">
             <UserTable users={asesorUsers} isLoading={loading} />
          </TabsContent>
           <TabsContent value="admin" className="mt-4">
             <UserTable users={adminUsers} isLoading={loading} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Ubah Role Pengguna</DialogTitle>
            <DialogDescription className="text-sm">
              Atur ulang peran untuk {selectedUser?.nama}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Role Baru</label>
                <Select value={newRole} onValueChange={(value) => setNewRole(value)}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Pilih role baru..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASESOR">Asesor (Penilai)</SelectItem>
                    <SelectItem value="ADMIN_LSP">Admin LSP (Administrator)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  Role saat ini: <span className="font-medium">{selectedUser.role}</span>
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button
              onClick={handleSaveRole}
              disabled={!newRole || isSaving || newRole === selectedUser?.role}
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}