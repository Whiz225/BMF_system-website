"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Phone,
  Shield,
} from "lucide-react";
import Logo, { businessConfig } from "@/components/Logo";
import Link from "next/link";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Logo and Welcome */}
          <div className="text-center mb-8">
            <Logo
              size="large"
              customLogo={businessConfig.logo}
              businessName={businessConfig.name}
              tagline={businessConfig.tagline}
              className="justify-center mb-4"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-4">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to manage your business
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Demo Login (Optional) */}
          <div className="mt-6">
            <button
              onClick={() => {
                // Demo login credentials
                onSubmit({
                  email: "demo@foambusiness.com",
                  password: "demo123",
                });
              }}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
            >
              <Shield className="h-4 w-4 mr-2" />
              Try Demo Account
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Sign up now
              </Link>
            </p>
          </div>

          {/* Contact Support */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need help? Contact us:
              </p>
              <div className="flex items-center justify-center mt-2 space-x-4">
                <a
                  href={`tel:${businessConfig.phone}`}
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  {businessConfig.phone}
                </a>
                <a
                  href={`mailto:${businessConfig.email}`}
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Business Image/Info */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 relative hidden md:block">
        {/* Business Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${businessConfig.heroImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>

        <div className="relative h-full flex items-center justify-center p-8">
          <div className="text-center text-white max-w-lg">
            <div className="mb-8">
              <Logo
                size="xlarge"
                customLogo={businessConfig.logo}
                businessName={businessConfig.name}
                tagline={businessConfig.tagline}
                className="justify-center"
              />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Manage Your Business Efficiently
            </h2>

            <p className="text-lg text-white/90 mb-8">
              Our platform helps foam business owners streamline operations,
              track inventory, and grow sales with ease.
            </p>

            {/* Features List */}
            <div className="space-y-4 text-left">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span>Real-time inventory tracking</span>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span>Customer management system</span>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span>Sales analytics & reporting</span>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span>Mobile-responsive design</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useAuth } from "@/contexts/AuthContext";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import Link from "next/link";

// export default function LoginPage() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   const { login } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       const result = await login(data.email, data.password);

//       if (result.success) {
//         toast.success("Login successful!");
//         router.push("/dashboard");
//       } else {
//         toast.error(result.message);
//       }
//     } catch (error) {
//       toast.error("An error occurred during login");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
//             Foam Business Manager
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
//             Sign in to your account
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div className="rounded-md shadow-sm space-y-4">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: "Invalid email address",
//                   },
//                 })}
//                 className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Enter your email"
//               />
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 autoComplete="current-password"
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: {
//                     value: 6,
//                     message: "Password must be at least 6 characters",
//                   },
//                 })}
//                 className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Enter your password"
//               />
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label
//                 htmlFor="remember-me"
//                 className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
//               >
//                 Remember me
//               </label>
//             </div>

//             <div className="text-sm">
//               <Link
//                 href="/forgot-password"
//                 className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
//               >
//                 Forgot your password?
//               </Link>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Signing in...
//                 </span>
//               ) : (
//                 "Sign in"
//               )}
//             </button>
//           </div>
//         </form>

//         <div className="text-center">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Demo credentials:{" "}
//             <button
//               onClick={() => {
//                 document.getElementById("email").value =
//                   "admin@foambusiness.com";
//                 document.getElementById("password").value = "admin123";
//               }}
//               className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
//             >
//               Load admin
//             </button>
//           </p>
//         </div>
//         <div className="text-center mt-6">
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Don't have an account?{" "}
//             <Link
//               href="/register"
//               className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
//             >
//               Register here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
