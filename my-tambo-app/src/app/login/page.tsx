"use client";

import { useAuth } from "@/components/auth-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0df2a6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f0d] p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#0df2a6] rounded-2xl flex items-center justify-center">
              <span className="text-[#101413] font-bold text-2xl">T</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Tambo Platform
          </h1>
          <p className="text-slate-400">
            Your personalized interview preparation assistant
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-[#101413] border border-[#22493c]/50 rounded-xl p-8 shadow-2xl">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Chrome className="w-5 h-5" />
            Sign in with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl">📊</div>
            <p className="text-xs text-slate-400">Track Progress</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl">🎯</div>
            <p className="text-xs text-slate-400">Set Goals</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl">🚀</div>
            <p className="text-xs text-slate-400">Get Hired</p>
          </div>
        </div>
      </div>
    </div>
  );
}
