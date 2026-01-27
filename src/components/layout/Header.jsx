"use client";

import { useState, Fragment, useEffect } from "react"; // Add useEffect
import { Menu, Transition } from "@headlessui/react";
import { Bell, UserCircle, Sun, Moon, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Logo, { businessConfig } from "@/components/Logo";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [mounted, setMounted] = useState(false); // Add mounted state
  const [notifications] = useState([
    {
      id: 1,
      title: "Low stock alert",
      message: "Premium Mattress is running low",
      time: "5 min ago",
    },
    {
      id: 2,
      title: "New sale",
      message: "Sale #SALE-20231215-ABCD completed",
      time: "1 hour ago",
    },
  ]);

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Set mounted to true only on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering until mounted
  if (!mounted) {
    return (
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Placeholder content */}
            <div className="flex items-center">
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {!businessConfig.logo ? (
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                BMF
              </h1>
            ) : (
              <div
                className="relative"
                style={{ width: "64px", height: "38px" }}
              >
                <Link href="/">
                  {/* small: { width: 32, height: 32, textSize: "text-lg" }, */}

                  <Image
                    src="/img/BMF_logo.png"
                    alt="BMF logo"
                    fill
                    className="object-contain"
                    onError={() => setImageError(true)}
                    sizes="(max-width: 768px) 32px, (max-width: 1200px) 48px, 64px"
                  />
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <Menu as="div" className="relative">
              <Menu.Button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>

                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <div
                            className={`px-4 py-3 ${
                              active ? "bg-gray-50 dark:bg-gray-700" : ""
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        )}
                      </Menu.Item>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <Menu.Item>
                      <button className="w-full px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                        View all notifications
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName?.length > 10
                      ? `${user?.firstName?.slice(0, 10)}...`
                      : user?.firstName}{" "}
                    {user?.firstName?.length < 10
                      ? `${user?.lastName.slice(
                          0,
                          10 - user?.firstName?.length
                        )}...`
                      : ""}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role?.replace("_", " ")}
                  </span>
                </div>
                <UserCircle className="h-8 w-8 text-gray-400" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        <UserCircle className="mr-3 h-5 w-5" />
                        Your Profile
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100 dark:bg-gray-700" : ""
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                      </button>
                    )}
                  </Menu.Item>

                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${
                            active ? "bg-gray-100 dark:bg-gray-700" : ""
                          } flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}
