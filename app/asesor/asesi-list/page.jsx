"use client"

import React, { useEffect, useState, useMemo } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockGetPenugasanAsesor } from "@/lib/api-mock"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, User } from "lucide-react"

export default function AsesiListPage() {
  const { user } = useAuth()
  const [asesiList, setAsesiList] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)
      // 1. Ambil SEMUA penugasan untuk asesor ini
      const penugasanData = await mockGetPenugasanAsesor(user.id)
      
      // 2. Buat daftar asesi yang unik dari data penugasan
      const asesiMap = new Map()
      penugasanData.forEach(p => {
        if (!asesiMap.has(p.asesiId)) {
          asesiMap.set(p.asesiId, {
            id: p.asesiId,
            nama: p.asesiNama,
            skemaId: p.skemaId,
            // Kita bisa tambahin NIM/Email jika ada di data penugasan
          })
        }
      })
      
      setAsesiList(Array.from(asesiMap.values()))

    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter list
  const filteredAsesi = useMemo(() => {
    return asesiList.filter((a) => 
        a.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [asesiList, searchTerm])

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Daftar Asesi</h1>
          <p className="text-muted-foreground mt-1">Daftar semua peserta (asesi) yang ditugaskan kepada Anda.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cari Asesi</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Cari nama asesi..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10 h-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : filteredAsesi.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2" />
                <p>Tidak ada asesi yang ditugaskan kepada Anda.</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[40%]">Nama Asesi</TableHead>
                    <TableHead className="w-[30%]">Skema</TableHead>
                    <TableHead className="w-[30%]">Status Penilaian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAsesi.map(asesi => (
                    <TableRow key={asesi.id} className="hover:bg-gray-50">
                      <TableCell>
                        <p className="font-medium text-gray-900">{asesi.nama}</p>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          asesi.skemaId === 'DS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {asesi.skemaId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-500">Menunggu Penilaian</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>
    </MainLayout>
  )
}