"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Logo, { businessConfig } from "@/components/Logo";
import Image from "next/image";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Star,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Logo
            size="large"
            customLogo={businessConfig.logo}
            businessName={businessConfig.name}
            tagline={businessConfig.tagline}
          />
          <div className="flex items-center space-x-4">
            <a
              href="#features"
              className="hidden sm:inline px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="hidden sm:inline px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Testimonials
            </a>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Streamline Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Foam Business
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Complete solution for managing your mattress and foam business.
              Track inventory, process sales, manage customers, and analyze
              performance—all in one place.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  {businessConfig.phone}
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  {businessConfig.email}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  {businessConfig.address}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/register")}
                className="px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500"
              >
                View Demo
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-20 sm:mt-24 lg:mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform provides all the tools you need to manage your foam
              business efficiently
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo
              size="medium"
              customLogo={businessConfig.logo}
              businessName={businessConfig.name}
              tagline={businessConfig.tagline}
              className="mb-6 md:mb-0"
            />
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} {businessConfig.name}. All rights
                reserved.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {businessConfig.address} • {businessConfig.phone}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
