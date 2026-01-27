"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Building,
  ArrowRight,
  CheckCircle,
  Shield
} from "lucide-react";
import Logo, { businessConfig } from "@/components/Logo";
import Link from "next/link";

export default function RegisterPage() {
  const { register: registerUser, user } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (result.success) {
        toast.success("Registration successful!");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column - Business Image/Info */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 relative hidden md:block">
        {/* Business Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${businessConfig.aboutImage || businessConfig.heroImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
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
              Join Our Growing Community
            </h2>
            
            <p className="text-lg text-white/90 mb-8">
              Start managing your foam business efficiently with our comprehensive platform. 
              Join hundreds of satisfied business owners.
            </p>
            
            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>24/7 customer support</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>Mobile app access</span>
              </div>
            </div>
            
            {/* Testimonial */}
            <div className="mt-8 p-4 bg-white/10 rounded-lg">
              <p className="italic text-white/90 mb-2">
                "This platform transformed how we manage our foam business. Highly recommended!"
              </p>
              <p className="text-sm text-white/70">- Sarah Johnson, Business Owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
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
              Create Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Start your free 14-day trial
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register("firstName", { required: "First name is required" })}
                    type="text"
                    className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register("lastName", { required: "Last name is required" })}
                    type="text"
                    className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "business_owner", label: "Owner", icon: "🏢" },
                  { value: "sales_manager", label: "Manager", icon: "👔" },
                  { value: "salesperson", label: "Sales", icon: "👤" },
                ].map((role) => (
                  <div key={role.value} className="relative">
                    <input
                      type="radio"
                      id={role.value}
                      value={role.value}
                      {...register("role", { required: "Select a role" })}
                      className="sr-only peer"
                    />
                    <label
                      htmlFor={role.value}
                      className="flex flex-col items-center p-3 border rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span className="text-lg mb-1">{role.icon}</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {role.label}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match"
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-10 pr-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", { required: "You must accept the terms and conditions" })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.terms.message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Try Demo Accounts:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  // Fill form with demo business owner data
                  const demoData = {
                    firstName: "Admin",
                    lastName: "User",
                    email: "admin@foambusiness.com",
                    password: "admin123",
                    confirmPassword: "admin123",
                    role: "business_owner"
                  };
                  
                  // You would need to populate the form fields here
                  // This is a simplified example
                  onSubmit(demoData);
                }}
                className="w-full text-left p-3 text-sm bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <Shield className="h-4 w-4 mr-2 text-blue-500" />
                <div>
                  <span className="font-medium">Business Owner:</span> admin@foambusiness.com
                </div>
              </button>
              <button
                onClick={() => {
                  // Fill form with demo salesperson data
                  const demoData = {
                    firstName: "John",
                    lastName: "Sales",
                    email: "sales@foambusiness.com",
                    password: "sales123",
                    confirmPassword: "sales123",
                    role: "salesperson"
                  };
                  
                  onSubmit(demoData);
                }}
                className="w-full text-left p-3 text-sm bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
              >
                <Shield className="h-4 w-4 mr-2 text-blue-500" />
                <div>
                  <span className="font-medium">Salesperson:</span> sales@foambusiness.com
                </div>
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Sign in
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

// export default function RegisterPage() {
//   const { register: registerUser, user } = useAuth();
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm();
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (data) => {
//     if (data.password !== data.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await registerUser({
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         password: data.password,
//         role: data.role,
//       });

//       if (result.success) {
//         toast.success("Registration successful!");
//         router.push("/dashboard");
//       } else {
//         toast.error(result.message || "Registration failed");
//       }
//     } catch (error) {
//       toast.error("An error occurred during registration");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (user) {
//     router.push("/dashboard");
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
//           {/* Header */}
//           <div className="px-6 pt-8 pb-6 text-center">
//             <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg mb-4">
//               <svg
//                 className="w-6 h-6 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                 />
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//               Create Account
//             </h2>
//             <p className="mt-2 text-gray-600 dark:text-gray-400">
//               Join Foam Business Manager
//             </p>
//           </div>

//           {/* Form */}
//           <div className="px-6 pb-8">
//             <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//               {/* Names */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     First Name *
//                   </label>
//                   <input
//                     type="text"
//                     {...register("firstName", { required: "Required" })}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="John"
//                   />
//                   {errors.firstName && (
//                     <p className="mt-1 text-xs text-red-600">
//                       {errors.firstName.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Last Name *
//                   </label>
//                   <input
//                     type="text"
//                     {...register("lastName", { required: "Required" })}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Doe"
//                   />
//                   {errors.lastName && (
//                     <p className="mt-1 text-xs text-red-600">
//                       {errors.lastName.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   {...register("email", {
//                     required: "Required",
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: "Invalid email",
//                     },
//                   })}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="email@example.com"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Role */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Role *
//                 </label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {[
//                     { value: "business_owner", label: "Owner", icon: "🏢" },
//                     { value: "sales_manager", label: "Manager", icon: "👔" },
//                     { value: "salesperson", label: "Sales", icon: "👤" },
//                   ].map((role) => (
//                     <div key={role.value} className="relative">
//                       <input
//                         type="radio"
//                         id={role.value}
//                         value={role.value}
//                         {...register("role", { required: "Select a role" })}
//                         className="sr-only peer"
//                       />
//                       <label
//                         htmlFor={role.value}
//                         className="flex flex-col items-center p-3 border rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 border-gray-300 dark:border-gray-600"
//                       >
//                         <span className="text-lg mb-1">{role.icon}</span>
//                         <span className="text-xs font-medium">
//                           {role.label}
//                         </span>
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//                 {errors.role && (
//                   <p className="mt-1 text-xs text-red-600">
//                     {errors.role.message}
//                   </p>
//                 )}
//               </div>

//               {/* Passwords */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Password *
//                   </label>
//                   <input
//                     type="password"
//                     {...register("password", {
//                       required: "Required",
//                       minLength: { value: 6, message: "Min 6 chars" },
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="••••••"
//                   />
//                   {errors.password && (
//                     <p className="mt-1 text-xs text-red-600">
//                       {errors.password.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Confirm *
//                   </label>
//                   <input
//                     type="password"
//                     {...register("confirmPassword", {
//                       required: "Required",
//                       validate: (value) =>
//                         value === watch("password") || "No match",
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="••••••"
//                   />
//                   {errors.confirmPassword && (
//                     <p className="mt-1 text-xs text-red-600">
//                       {errors.confirmPassword.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
//               >
//                 {loading ? "Creating..." : "Create Account"}
//               </button>
//             </form>

//             {/* Demo Accounts */}
//             <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
//               <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                 Demo Accounts:
//               </p>
//               <div className="space-y-2">
//                 <button
//                   onClick={() => {
//                     document.getElementById("email").value =
//                       "admin@foambusiness.com";
//                     document.getElementById("password").value = "admin123";
//                     document.getElementById("confirmPassword").value =
//                       "admin123";
//                     document.getElementById("firstName").value = "Admin";
//                     document.getElementById("lastName").value = "User";
//                     document.getElementById("business_owner").checked = true;
//                   }}
//                   className="w-full text-left p-2 text-sm bg-white dark:bg-gray-800 rounded border hover:bg-gray-50 dark:hover:bg-gray-700"
//                 >
//                   <span className="font-medium">Business Owner:</span>{" "}
//                   admin@foambusiness.com
//                 </button>
//                 <button
//                   onClick={() => {
//                     document.getElementById("email").value =
//                       "sales@foambusiness.com";
//                     document.getElementById("password").value = "sales123";
//                     document.getElementById("confirmPassword").value =
//                       "sales123";
//                     document.getElementById("firstName").value = "John";
//                     document.getElementById("lastName").value = "Sales";
//                     document.getElementById("salesperson").checked = true;
//                   }}
//                   className="w-full text-left p-2 text-sm bg-white dark:bg-gray-800 rounded border hover:bg-gray-50 dark:hover:bg-gray-700"
//                 >
//                   <span className="font-medium">Salesperson:</span>{" "}
//                   sales@foambusiness.com
//                 </button>
//               </div>
//             </div>

//             {/* Login Link */}
//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 Have an account?{" "}
//                 <Link
//                   href="/login"
//                   className="text-blue-600 dark:text-blue-400 hover:underline"
//                 >
//                   Sign in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
