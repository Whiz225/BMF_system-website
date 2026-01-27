"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  UsersIcon,
  TruckIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  BellIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, permission: null },
  {
    name: "Sales",
    href: "/sales",
    icon: ShoppingCartIcon,
    permission: "manage_sales",
    children: [
      { name: "New Sale", href: "/sales/new" },
      { name: "Sales History", href: "/sales/history" },
      { name: "Invoices", href: "/sales/invoices" },
    ],
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: CubeIcon,
    permission: "manage_inventory",
    children: [
      { name: "Products", href: "/inventory/products" },
      { name: "Stock Levels", href: "/inventory/stock" },
      { name: "Categories", href: "/inventory/categories" },
    ],
  },
  {
    name: "Customers",
    href: "/customers",
    icon: UsersIcon,
    permission: "manage_customers",
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: TruckIcon,
    permission: "manage_suppliers",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: ChartBarIcon,
    permission: "view_reports",
    children: [
      { name: "Sales Report", href: "/reports/sales" },
      { name: "Inventory Report", href: "/reports/inventory" },
      {
        name: "Profit & Loss",
        href: "/reports/profit",
        permission: "view_profits",
      },
    ],
  },
  {
    name: "Users",
    href: "/users",
    icon: UserGroupIcon,
    permission: "manage_users",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: CogIcon,
    permission: null,
  },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const pathname = usePathname();
  const { user } = useAuth();

  const toggleItem = (name) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const hasPermission = (permission) => {
    if (!permission) return true;
    if (!user) return false;
    return user.permissions[permission];
  };

  const filteredNavigation = navigation.filter((item) =>
    hasPermission(item.permission)
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white"
        >
          Menu
        </button>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 flex w-64 max-w-xs">
              <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 pt-5 pb-4">
                {/* Close button */}
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 text-white"
                >
                  ×
                </button>

                {/* Navigation */}
                <nav className="mt-8 space-y-1 px-2">
                  {filteredNavigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => !item.children && setSidebarOpen(false)}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          pathname === item.href
                            ? "bg-gray-800 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                        {item.children && <span className="ml-auto">▼</span>}
                      </Link>

                      {item.children && expandedItems[item.name] && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children
                            .filter((child) => hasPermission(child.permission))
                            .map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`block px-2 py-1 text-sm rounded ${
                                  pathname === child.href
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                              >
                                {child.name}
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-900">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-white">
                Foam Business Manager
              </h1>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {filteredNavigation.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={`group flex flex-1 items-center px-2 py-2 text-sm font-medium rounded-md ${
                        pathname === item.href ||
                        (item.children &&
                          item.children.some(
                            (child) => pathname === child.href
                          ))
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>

                    {item.children && (
                      <button
                        onClick={() => toggleItem(item.name)}
                        className="px-2 text-gray-400 hover:text-white"
                      >
                        {expandedItems[item.name] ? "▲" : "▼"}
                      </button>
                    )}
                  </div>

                  {item.children && expandedItems[item.name] && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children
                        .filter((child) => hasPermission(child.permission))
                        .map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`block px-2 py-1 text-sm rounded ${
                              pathname === child.href
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* User profile */}
          {user && (
            <div className="flex flex-shrink-0 border-t border-gray-700 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-300 capitalize">
                    {user.role.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
