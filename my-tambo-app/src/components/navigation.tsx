"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Briefcase,
  Map,
  ClipboardCheck,
  Menu,
  X,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyzer", label: "Analyzer", icon: Target },
  { href: "/tracker", label: "Applications", icon: Briefcase },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/assessment", label: "Assessment", icon: ClipboardCheck },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-[#101413] border-b border-[#22493c]/50">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between w-full gap-1 py-3">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 mr-6">
              <div className="w-8 h-8 bg-[#0df2a6] rounded-lg flex items-center justify-center">
                <span className="text-[#101413] font-bold text-sm">T</span>
              </div>
              <span className="text-white font-bold text-lg">Tambo Platform</span>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#0df2a6]/10 text-[#0df2a6] border border-[#0df2a6]/20"
                      : "text-slate-400 hover:text-white hover:bg-[#22493c]/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#0df2a6]/10 border border-[#0df2a6]/20 flex items-center justify-center">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-full" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-[#0df2a6]" />
                  )}
                </div>
                <span className="text-slate-300">{user.user_metadata?.full_name || user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#22493c]/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0df2a6] rounded-lg flex items-center justify-center">
                <span className="text-[#101413] font-bold text-sm">T</span>
              </div>
              <span className="text-white font-bold">Tambo</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-[#22493c]/30 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#0df2a6]/10 text-[#0df2a6] border border-[#0df2a6]/20"
                        : "text-slate-400 hover:text-white hover:bg-[#22493c]/30"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
