"use client";

import { useState, useEffect, Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
  TruckIcon,
  ChartBarIcon,
  CogIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Sales",
    icon: ShoppingCartIcon,
    children: [
      { name: "All Sales", href: "/sales" },
      { name: "New Sale", href: "/sales/new" },
    ],
  },
  {
    name: "Products",
    icon: CubeIcon,
    children: [
      { name: "All Products", href: "/products" },
      { name: "Categories", href: "/products/categories" },
    ],
  },
  {
    name: "Inventory",
    icon: CubeIcon,
    children: [
      { name: "Stock Management", href: "/inventory/stock" },
      { name: "Inventory Analysis", href: "/inventory/analysis" },
      { name: "Stock Alerts", href: "/inventory/alerts" },
    ],
  },
  {
    name: "Customers",
    href: "/customers",
    icon: UsersIcon,
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: TruckIcon,
  },
  {
    name: "Reports",
    icon: ChartBarIcon,
    children: [
      { name: "Sales Reports", href: "/reports?sort=sales" },
      { name: "Inventory Reports", href: "/reports?sort=inventory" },
      { name: "Customer Reports", href: "/reports?sort=customers" },
    ],
  },
  {
    name: "Users",
    href: "/users",
    icon: UsersIcon,
    permission: "manage_users",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: CogIcon,
  },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Initialize open dropdowns based on current path
  useEffect(() => {
    const initialOpen = {};
    navigation.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (
            pathname === child.href ||
            pathname.startsWith(child.href + "/")
          ) {
            initialOpen[item.name] = true;
          }
        });
      }
    });
    setOpenDropdowns(initialOpen);
  }, [pathname]);

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleNavigation = (href) => {
    router.push(href);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  // Check if user has permission for an item
  const hasPermission = (item) => {
    if (!item.permission) return true;
    if (!user || !user.permissions) return false;
    return (
      user.permissions[item.permission] || user.role === "business_owner"
      // user.permissions.get(item.permission) || user.role === "business_owner"
    );
  };

  // Filter navigation based on user permissions
  const filteredNavigation = navigation.filter(hasPermission);

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 mb-5">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Foam Business
              </h1>
            </div>

            {/* Navigation */}
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <Fragment key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg
                          hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                          ${
                            openDropdowns[item.name]
                              ? "bg-gray-100 dark:bg-gray-700"
                              : ""
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {item.name}
                          </span>
                        </div>
                        {openDropdowns[item.name] ? (
                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </button>

                      {/* Dropdown Children */}
                      {openDropdowns[item.name] && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.name}
                              onClick={() => handleNavigation(child.href)}
                              className={`
                                w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
                                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                                ${
                                  pathname === child.href ||
                                  pathname.startsWith(child.href + "/")
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                    : "text-gray-700 dark:text-gray-300"
                                }
                              `}
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
                        hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                        ${
                          pathname === item.href ||
                          pathname.startsWith(item.href + "/")
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }
                      `}
                    >
                      <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                      {item.name}
                    </button>
                  )}
                </Fragment>
              ))}
            </nav>

            {/* User Info & Theme Toggle */}
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Toggle theme"
                >
                  {theme === "dark" ? (
                    <SunIcon className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <MoonIcon className="h-5 w-5 text-gray-700" />
                  )}
                </button>

                {user && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs capitalize">
                      {user.role?.replace("_", " ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden transition-opacity duration-300
          ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar Panel */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 px-4">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Foam Business
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {filteredNavigation.map((item) => (
                <Fragment key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg
                          hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                          ${
                            openDropdowns[item.name]
                              ? "bg-gray-100 dark:bg-gray-700"
                              : ""
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {item.name}
                          </span>
                        </div>
                        {openDropdowns[item.name] ? (
                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </button>

                      {/* Dropdown Children */}
                      {openDropdowns[item.name] && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.name}
                              onClick={() => {
                                handleNavigation(child.href);
                                setSidebarOpen(false);
                              }}
                              className={`
                                w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
                                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                                ${
                                  pathname === child.href ||
                                  pathname.startsWith(child.href + "/")
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                    : "text-gray-700 dark:text-gray-300"
                                }
                              `}
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleNavigation(item.href);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
                        hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                        ${
                          pathname === item.href ||
                          pathname.startsWith(item.href + "/")
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }
                      `}
                    >
                      <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                      {item.name}
                    </button>
                  )}
                </Fragment>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

// "use client";

// import { useState, useEffect, Fragment } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   HomeIcon,
//   ShoppingCartIcon,
//   UsersIcon,
//   CubeIcon,
//   TruckIcon,
//   ChartBarIcon,
//   CogIcon,
//   ChevronDownIcon,
//   ChevronRightIcon,
//   XMarkIcon,
//   Bars3Icon,
// } from "@heroicons/react/24/outline";
// import { useAuth } from "@/contexts/AuthContext";
// import { useTheme } from "@/contexts/ThemeContext";
// import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/dashboard",
//     icon: HomeIcon,
//   },
//   {
//     name: "Sales",
//     icon: ShoppingCartIcon,
//     children: [
//       { name: "All Sales", href: "/sales" },
//       { name: "New Sale", href: "/sales/new" },
//     ],
//   },
//   {
//     name: "Products",
//     icon: CubeIcon,
//     children: [
//       { name: "All Products", href: "/products" },
//       { name: "Categories", href: "/products/categories" },
//     ],
//   },
//   {
//     name: "Inventory",
//     icon: CubeIcon,
//     children: [
//       { name: "Stock Management", href: "/inventory/stock" },
//       { name: "Inventory Analysis", href: "/inventory/analysis" },
//       { name: "Stock Alerts", href: "/inventory/alerts" },
//     ],
//   },
//   {
//     name: "Customers",
//     href: "/customers",
//     icon: UsersIcon,
//   },
//   {
//     name: "Suppliers",
//     href: "/suppliers",
//     icon: TruckIcon,
//   },
//   {
//     name: "Reports",
//     icon: ChartBarIcon,
//     children: [
//       { name: "Sales Reports", href: "/reports?sort=sales" },
//       { name: "Inventory Reports", href: "/reports?sort=inventory" },
//       { name: "Customer Reports", href: "/reports?sort=customers" },
//     ],
//   },
//   {
//     name: "Users",
//     href: "/users",
//     icon: UsersIcon,
//     permission: "manage_users",
//   },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: CogIcon,
//   },
// ];

// export default function Sidebar() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [openDropdowns, setOpenDropdowns] = useState({});
//   const pathname = usePathname();
//   const router = useRouter();
//   const { user } = useAuth();
//   const { theme, toggleTheme } = useTheme();

//   // Initialize open dropdowns based on current path
//   useEffect(() => {
//     const initialOpen = {};
//     navigation.forEach((item) => {
//       if (item.children) {
//         item.children.forEach((child) => {
//           if (
//             pathname === child.href ||
//             pathname.startsWith(child.href + "/")
//           ) {
//             initialOpen[item.name] = true;
//           }
//         });
//       }
//     });
//     setOpenDropdowns(initialOpen);
//   }, [pathname]);

//   const toggleDropdown = (name) => {
//     setOpenDropdowns((prev) => ({
//       ...prev,
//       [name]: !prev[name],
//     }));
//   };

//   const handleNavigation = (href) => {
//     router.push(href);
//     setSidebarOpen(false); // Close sidebar on mobile after navigation
//   };

//   // Check if user has permission for an item
//   const hasPermission = (item) => {
//     if (!item.permission) return true;
//     if (!user || !user.permissions) return false;
//     console.log("user", user);
//     console.log("permission", item.permission);
//     return (
//       user.permissions[item.permission] || user.role === "business_owner"
//       // user.permissions.get(item.permission) || user.role === "business_owner"
//     );
//   };

//   // Filter navigation based on user permissions
//   const filteredNavigation = navigation.filter(hasPermission);

//   return (
//     <>
//       {/* Mobile sidebar toggle */}
//       <button
//         type="button"
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 shadow"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         {sidebarOpen ? (
//           <XMarkIcon className="h-6 w-6" />
//         ) : (
//           <Bars3Icon className="h-6 w-6" />
//         )}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed inset-y-0 left-0 z-40 w-64 transform bg-white dark:bg-gray-800 shadow-lg
//           lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >
//         {/* Logo */}
//         <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
//           <h1 className="text-xl font-bold text-gray-800 dark:text-white">
//             Foam Business
//           </h1>
//         </div>

//         {/* Navigation */}
//         <nav className="mt-5 px-2 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
//           {filteredNavigation.map((item) => (
//             <Fragment key={item.name}>
//               {item.children ? (
//                 <div>
//                   <button
//                     onClick={() => toggleDropdown(item.name)}
//                     className={`
//                       w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg
//                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
//                       ${
//                         openDropdowns[item.name]
//                           ? "bg-gray-100 dark:bg-gray-700"
//                           : ""
//                       }
//                     `}
//                   >
//                     <div className="flex items-center">
//                       <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
//                       <span className="text-gray-700 dark:text-gray-300">
//                         {item.name}
//                       </span>
//                     </div>
//                     {openDropdowns[item.name] ? (
//                       <ChevronDownIcon className="h-4 w-4 text-gray-500" />
//                     ) : (
//                       <ChevronRightIcon className="h-4 w-4 text-gray-500" />
//                     )}
//                   </button>

//                   {/* Dropdown Children */}
//                   {openDropdowns[item.name] && (
//                     <div className="ml-8 mt-1 space-y-1">
//                       {item.children.map((child) => (
//                         <button
//                           key={child.name}
//                           onClick={() => handleNavigation(child.href)}
//                           className={`
//                             w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
//                             hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
//                             ${
//                               pathname === child.href ||
//                               pathname.startsWith(child.href + "/")
//                                 ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
//                                 : "text-gray-700 dark:text-gray-300"
//                             }
//                           `}
//                         >
//                           {child.name}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => handleNavigation(item.href)}
//                   className={`
//                     w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
//                     hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
//                     ${
//                       pathname === item.href ||
//                       pathname.startsWith(item.href + "/")
//                         ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
//                         : "text-gray-700 dark:text-gray-300"
//                     }
//                   `}
//                 >
//                   <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
//                   {item.name}
//                 </button>
//               )}
//             </Fragment>
//           ))}
//         </nav>

//         {/* Theme Toggle and User Info */}
//         <div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//               title="Toggle theme"
//             >
//               {theme === "dark" ? (
//                 <SunIcon className="h-5 w-5 text-yellow-500" />
//               ) : (
//                 <MoonIcon className="h-5 w-5 text-gray-700" />
//               )}
//             </button>

//             {user && (
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 <p className="font-medium">
//                   {user.firstName} {user.lastName}
//                 </p>
//                 <p className="text-xs capitalize">
//                   {user.role?.replace("_", " ")}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </>
//   );
// }
