"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Settings,
  Bell,
  ShieldCheck,
  CreditCard,
  Globe,
  Printer,
  BarChart3,
  Database,
  CloudUpload,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "integrations", label: "Integrations", icon: Globe },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    toast.success("Data export started. You will receive an email shortly.");
  };

  const backupData = () => {
    toast.success("Backup process initiated");
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure your business preferences
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Settings
              </h3>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* System Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                System
              </h3>
              <div className="space-y-2">
                <button
                  onClick={exportData}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <span className="flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Export Data
                  </span>
                  <CloudUpload className="h-4 w-4" />
                </button>
                <button
                  onClick={backupData}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <span className="flex items-center">
                    <CloudUpload className="h-4 w-4 mr-2" />
                    Backup
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  General Settings
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      {...register("businessName")}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      {...register("currency")}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="NGN">Nigerian Naira (₦)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time Zone
                    </label>
                    <select
                      {...register("timezone")}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Africa/Lagos">
                        West Africa Time (WAT)
                      </option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="Europe/London">London</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("autoBackup")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Enable automatic daily backup
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  Notification Settings
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      label: "Low stock alerts",
                      description: "Get notified when inventory is running low",
                    },
                    {
                      label: "New sales notifications",
                      description: "Receive alerts for new sales",
                    },
                    {
                      label: "Daily sales report",
                      description: "Receive daily summary via email",
                    },
                    {
                      label: "Payment reminders",
                      description: "Get reminded of pending payments",
                    },
                    {
                      label: "System updates",
                      description: "Receive notifications about system updates",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <div className="ml-3">
                        <label className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  Security Settings
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Two-Factor Authentication
                    </label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Enable 2FA
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        Enable
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Session Timeout
                    </label>
                    <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                          Security Recommendations
                        </h4>
                        <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Change your password every 90 days</li>
                            <li>Use strong, unique passwords</li>
                            <li>Enable two-factor authentication</li>
                            <li>Regularly review user access permissions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
