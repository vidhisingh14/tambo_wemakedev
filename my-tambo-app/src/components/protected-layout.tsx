"use client";

import { useAuth } from "@/components/auth-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/auth"];

  useEffect(() => {
    const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));
    
    if (!loading && !user && !isPublicRoute) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0df2a6]"></div>
      </div>
    );
  }

  // Render public routes without protection
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Render protected content only if authenticated
  if (user) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}
