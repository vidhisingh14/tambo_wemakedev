"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { TamboSidebar } from "@/components/tambo-sidebar";
import { Navigation } from "@/components/navigation";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { AuthProvider } from "@/components/auth-provider";
import { ProtectedLayout } from "@/components/protected-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mcpServers = useMcpServers();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0f0d] min-h-screen`}
      >
        <AuthProvider>
          <TamboProvider
            apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
            components={components}
            tools={tools}
            tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
            mcpServers={mcpServers}
          >
            <ProtectedLayout>
              <Navigation />
              <main className="min-h-[calc(100vh-64px)]">
                {children}
              </main>
              <TamboSidebar />
            </ProtectedLayout>
          </TamboProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
