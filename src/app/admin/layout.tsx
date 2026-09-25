"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading) {
      if (!user && !isLoginPage) {
        router.push("/admin/login");
      }
    }
  }, [user, loading, isLoginPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="text-sm font-mono text-gray-400">Authenticating admin session...</span>
        </div>
      </div>
    );
  }

  // If on login page, don't show the sidebar
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#030712]">{children}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
