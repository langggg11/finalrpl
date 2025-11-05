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

export default function AsesorDashboard() {
  const { user } = useAuth();
  const [penugasan, setPenugasan] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getFilteredPenugasan = (tipe, status) => {
    return penugasan.filter((p) => p.tipe === tipe && p.statusPenilaian === status);
  };

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
      return <p className="text-center text-muted-foreground py-8">Tidak ada tugas penilaian.</p>;
    }
    return (
      <div className="space-y-2">
        {list.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
            <div>
              <p className="font-medium">{p.asesiNama}</p>
              <p className="text-sm text-muted-foreground">
                Unit {p.unitId}: {p.unitJudul}
              </p>
            </div>
            <Link href={`/asesor/grading/${p.id}`}>
              <Button size="sm">Nilai</Button>
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
          <h1 className="text-3xl font-bold">Dashboard Asesor</h1>
          <p className="text-muted-foreground mt-1">Selamat datang, {user?.nama}. Berikut adalah tugas penilaian Anda.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : penugasan.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Dinilai</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : penugasan.filter((p) => p.statusPenilaian === "BELUM_DINILAI").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sudah Selesai</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : penugasan.filter((p) => p.statusPenilaian === "SELESAI").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Dipisah per jenis ujian */}
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

          {/* Tab Ujian Teori */}
          <TabsContent value="teori" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tugas Penilaian Ujian Teori (Esai)</CardTitle>
              </CardHeader>
              <CardContent>
                <PenugasanList list={getFilteredPenugasan("TEORI", "BELUM_DINILAI")} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Ujian Praktikum */}
          <TabsContent value="praktikum">
            <Card>
              <CardHeader>
                <CardTitle>Tugas Penilaian Ujian Praktikum (Upload)</CardTitle>
              </CardHeader>
              <CardContent>
                <PenugasanList list={getFilteredPenugasan("PRAKTIKUM", "BELUM_DINILAI")} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Unjuk Diri */}
          <TabsContent value="unjuk-diri">
            <Card>
              <CardHeader>
                <CardTitle>Tugas Penilaian Unjuk Diri</CardTitle>
              </CardHeader>
              <CardContent>
                <PenugasanList list={getFilteredPenugasan("UNJUK_DIRI", "BELUM_DINILAI")} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
