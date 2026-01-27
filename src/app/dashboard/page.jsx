"use client";

import { useState, useEffect } from "react";
// import axios from "axios";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentSales from "@/components/dashboard/RecentSales";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import TopProducts from "@/components/dashboard/TopProducts";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChartBarIcon,
  ArrowPathIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { loadDashboardSales, loadDashboardStats } from "@/lib/actions";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState("7d");
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, [chartPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, salesRes] = await Promise.all([
        loadDashboardStats(),
        loadDashboardSales(),
      ]);

      console.log("statsRes", statsRes);
      console.log("salesRes", salesRes);
      setStats(statsRes);
      setSalesData(salesRes);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of your business performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Chart Period Selector */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setChartPeriod("7d")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                chartPeriod === "7d"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setChartPeriod("30d")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                chartPeriod === "30d"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setChartPeriod("90d")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                chartPeriod === "90d"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              90D
            </button>
          </div>

          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="mb-6">
        <StatsCards stats={stats} />
      </div>

      {/* Charts and Grid - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-0">
                Sales Overview
              </h2>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Last{" "}
                {chartPeriod === "7d"
                  ? "7 days"
                  : chartPeriod === "30d"
                  ? "30 days"
                  : "90 days"}
              </div>
            </div>
            <div className="h-64 md:h-80">
              <SalesChart data={salesData} />
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Top Products
              </h2>
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <TopProducts products={stats?.topSellingProducts} />
          </div>
        </div>
      </div>

      {/* Bottom Row - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Sales */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Recent Sales
            </h2>
            <div className="overflow-hidden">
              <RecentSales sales={stats?.recentSales} />
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Low Stock Alerts
              </h2>
              {stats?.inventory?.lowStock > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  {stats.inventory.lowStock} items
                </span>
              )}
            </div>
            <LowStockAlert items={stats?.lowStockItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// // import axios from "axios";
// import StatsCards from "@/components/dashboard/StatsCards";
// import SalesChart from "@/components/dashboard/SalesChart";
// import RecentSales from "@/components/dashboard/RecentSales";
// import LowStockAlert from "@/components/dashboard/LowStockAlert";
// import TopProducts from "@/components/dashboard/TopProducts";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   ChartBarIcon,
//   ArrowPathIcon,
//   CalendarIcon,
// } from "@heroicons/react/24/outline";
// import api from "@/lib/api";

// export default function Dashboard() {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [salesData, setSalesData] = useState([]);
//   const [chartPeriod, setChartPeriod] = useState("7d");
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchDashboardData();
//   }, [chartPeriod]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const [statsRes, salesRes] = await Promise.all([
//         api.get("/api/dashboard/stats"),
//         api.get(`/api/dashboard/sales-chart?period=${chartPeriod}`),
//       ]);

//       console.log("statsRes", statsRes.data);
//       console.log("salesRes", salesRes.data);
//       setStats(statsRes.data.data);
//       setSalesData(salesRes.data.data);
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
//             Dashboard
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Overview of your business performance
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           {/* Chart Period Selector */}
//           <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
//             <button
//               onClick={() => setChartPeriod("7d")}
//               className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
//                 chartPeriod === "7d"
//                   ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
//                   : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//               }`}
//             >
//               7D
//             </button>
//             <button
//               onClick={() => setChartPeriod("30d")}
//               className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
//                 chartPeriod === "30d"
//                   ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
//                   : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//               }`}
//             >
//               30D
//             </button>
//             <button
//               onClick={() => setChartPeriod("90d")}
//               className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
//                 chartPeriod === "90d"
//                   ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
//                   : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//               }`}
//             >
//               90D
//             </button>
//           </div>

//           <button
//             onClick={fetchDashboardData}
//             className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
//           >
//             <ArrowPathIcon className="h-4 w-4 mr-2" />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards - Responsive Grid */}
//       <div className="mb-6">
//         <StatsCards stats={stats} />
//       </div>

//       {/* Charts and Grid - Responsive Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
//         {/* Sales Chart */}
//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//               <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-0">
//                 Sales Overview
//               </h2>
//               <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
//                 <CalendarIcon className="h-4 w-4 mr-1" />
//                 Last{" "}
//                 {chartPeriod === "7d"
//                   ? "7 days"
//                   : chartPeriod === "30d"
//                   ? "30 days"
//                   : "90 days"}
//               </div>
//             </div>
//             <div className="h-64 md:h-80">
//               <SalesChart data={salesData} />
//             </div>
//           </div>
//         </div>

//         {/* Top Products */}
//         <div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 h-full">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-medium text-gray-900 dark:text-white">
//                 Top Products
//               </h2>
//               <ChartBarIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <TopProducts products={stats?.topSellingProducts} />
//           </div>
//         </div>
//       </div>

//       {/* Bottom Row - Responsive Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
//         {/* Recent Sales */}
//         <div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
//             <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//               Recent Sales
//             </h2>
//             <div className="overflow-hidden">
//               <RecentSales sales={stats?.recentSales} />
//             </div>
//           </div>
//         </div>

//         {/* Low Stock Alerts */}
//         <div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-medium text-gray-900 dark:text-white">
//                 Low Stock Alerts
//               </h2>
//               {stats?.inventory?.lowStock > 0 && (
//                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
//                   {stats.inventory.lowStock} items
//                 </span>
//               )}
//             </div>
//             <LowStockAlert items={stats?.lowStockItems} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
