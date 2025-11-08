"use client";

import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { mockGetPenugasanAsesor } from "@/lib/api-mock";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, AlertCircle, Clock, FileText, Mic, CheckSquare } from "lucide-react";
import Link from "next/link";

// --- KODE INI DIPINDAHKAN DARI DASHBOARD ---

export default function GradingListPage() {
  const { user } = useAuth();
  const [penugasan, setPenugasan] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk filter (Default: "Belum Dinilai")
  const [filterStatus, setFilterStatus] = useState("BELUM_DINILAI");

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const penugasanData = await mockGetPenugasanAsesor(user.id);
      setPenugasan(penugasanData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi filter
  const getFilteredPenugasan = (tipe) => {
    if (filterStatus === "SEMUA") {
      return penugasan.filter((p) => p.tipe === tipe);
    }
    return penugasan.filter((p) => p.tipe === tipe && p.statusPenilaian === filterStatus);
  };

  // Komponen list tugas
  const PenugasanList = ({ list }) => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );
    }
    
    if (list.length === 0) {
      let message = "Tidak ada tugas penilaian.";
      if (filterStatus === "BELUM_DINILAI") message = "Tidak ada tugas yang perlu dinilai untuk tipe ini.";
      if (filterStatus === "SELESAI") message = "Tidak ada tugas yang sudah selesai untuk tipe ini.";
      if (filterStatus === "SEMUA") message = "Tidak ada tugas untuk tipe ini.";
      
      return <p className="text-center text-muted-foreground py-8">{message}</p>;
    }
    
    return (
      <div className="space-y-2">
        {list.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
            <div>
              <p className="font-medium">{p.asesiNama}</p>
              <p className="text-sm text-muted-foreground">
                {p.unitId ? `Unit ${p.unitId}: ${p.unitJudul}` : p.unitJudul}
              </p>
            </div>
            <Link href={`/asesor/grading/${p.id}`}>
              <Button size="sm" variant={p.statusPenilaian === 'SELESAI' ? 'outline' : 'default'}>
                {p.statusPenilaian === 'SELESAI' ? 'Lihat' : 'Nilai'}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          {/* Judul Halaman Diubah */}
          <h1 className="text-3xl font-bold">Tugas Penilaian</h1>
          <p className="text-muted-foreground mt-1">Filter dan kelola semua tugas penilaian Anda.</p>
        </div>

        {/* Stats Grid (Filter) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className={`hover:shadow-md transition-all cursor-pointer h-full ${filterStatus === "SEMUA" ? "border-primary ring-2 ring-primary/50" : "border-transparent"}`}
            onClick={() => setFilterStatus("SEMUA")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Semua Tugas</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : penugasan.length}</div>
            </CardContent>
          </Card>
          
          <Card 
            className={`hover:shadow-md transition-all cursor-pointer h-full ${filterStatus === "BELUM_DINILAI" ? "border-primary ring-2 ring-primary/50" : "border-transparent"}`}
            onClick={() => setFilterStatus("BELUM_DINILAI")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Dinilai</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : penugasan.filter((p) => p.statusPenilaian === "BELUM_DINILAI").length}</div>
            </CardContent>
          </Card>

          <Card 
            className={`hover:shadow-md transition-all cursor-pointer h-full ${filterStatus === "SELESAI" ? "border-primary ring-2 ring-primary/50" : "border-transparent"}`}
            onClick={() => setFilterStatus("SELESAI")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sudah Selesai</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : penugasan.filter((p) => p.statusPenilaian === "SELESAI").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs dan Daftar Tugas */}
        <Tabs defaultValue="teori" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teori">
              <FileText className="w-4 h-4 mr-2" /> Ujian Teori
            </TabsTrigger>
            <TabsTrigger value="praktikum">
              <FileText className="w-4 h-4 mr-2" /> Ujian Praktikum
            </TabsTrigger>
            <TabsTrigger value="unjuk-diri">
              <Mic className="w-4 h-4 mr-2" /> Unjuk Diri
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teori" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tugas Penilaian Ujian Teori (Esai)</CardTitle>
              </CardHeader>
              <CardContent>
                <PenugasanList list={getFilteredPenugasan("TEORI")} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="praktikum">
            <Card>
              <CardHeader>
                <CardTitle>Tugas Penilaian Ujian Praktikum (Upload)</CardTitle>
              </CardHeader>
              <CardContent>
                <PenugasanList list={getFilteredPenugasan("PRAKTIKUM")} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unjuk-diri">
            <Card>
              <CardHeader>
                <CardTitle>Tugas Penilaian Unjuk Diri</CardTitle>
              </CardHeader>
              <CardContent>
                <PenugasanList list={getFilteredPenugasan("UNJUK_DIRI")} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
      </div>
    </MainLayout>
  );
}