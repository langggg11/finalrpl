"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation"; // redirecting
import { MainLayout } from "@/components/layout/main-layout";
import { useEffect } from "react";

export default function DashboardPage() {
 const { user, isLoggedIn } = useAuth();
 const router = useRouter();

// redirecting logic
useEffect(() => {
 // 1. Guard Clause 1: Cek Autentikasi
 if (!isLoggedIn) {
 router.push("/login");
 return;
 }

 // 2. Guard Clause 2: Cek Otorisasi (Role)
 if (user?.role === "ASESI") {
 router.push("/asesi/dashboard");
 } else if (user?.role === "ASESOR") {
 router.push("/asesor/dashboard");
 } else if (user?.role === "ADMIN_LSP") {
 router.push("/admin/dashboard");
 }
 }, [isLoggedIn, user?.role, router]);

return (
 <MainLayout>
 <div className="flex items-center justify-center h-full">
 <p className="text-muted-foreground">Redirecting...</p>
 </div>
 </MainLayout>
 );
}