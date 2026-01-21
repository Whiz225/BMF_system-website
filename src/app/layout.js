"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// Pages that don't need sidebar/header
const noLayoutPages = ["/login", "/register", "/forgot-password"];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = noLayoutPages.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {hideLayout ? (
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {children}
              </div>
            ) : (
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <div className="lg:pl-64">
                  <Header />
                  <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
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
