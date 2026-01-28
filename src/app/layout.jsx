"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// const inter = Inter({ subsets: ["latin"] });
// Load Inter font with preconnect hints and local fallback
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  // Optional: preload the font
  preload: true,
});


// Pages that don't need sidebar/header
const noLayoutPages = ["/login", "/register", "/forgot-password"];

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const hideLayout = noLayoutPages.includes(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
            {hideLayout ? (
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {children}
              </div>
            ) : (
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Fixed Sidebar */}
                <div className="fixed inset-y-0 left-0 z-50 hidden lg:block w-64">
                  <Sidebar />
                </div>

                {/* Mobile Sidebar (handled inside Sidebar component) */}
                <div className="lg:hidden">
                  <Sidebar />
                </div>

                {/* Main Content Area */}
                <div className="lg:pl-64">
                  <Header />
                  <main className="py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
                    {children}
                  </main>
                </div>
              </div>
            )}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#1F2937",
                  color: "#fff",
                  border: "1px solid #374151",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
