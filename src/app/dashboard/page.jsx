"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentSales from "@/components/dashboard/RecentSales";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import TopProducts from "@/components/dashboard/TopProducts";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, salesRes] = await Promise.all([
        axios.get("/api/dashboard/stats"),
        axios.get("/api/dashboard/sales-chart?period=7d"),
      ]);

      setStats(statsRes.data.data);
      setSalesData(salesRes.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8">
        <StatsCards stats={stats} />
      </div>

      {/* Charts and Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Sales Overview
            </h2>
            <SalesChart data={salesData} />
          </div>
        </div>

        {/* Top Products */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Top Selling Products
            </h2>
            <TopProducts products={stats?.topSellingProducts} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Sales
            </h2>
            <RecentSales sales={stats?.recentSales} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Low Stock Alerts
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {stats?.inventory?.lowStock || 0} items
              </span>
            </div>
            <LowStockAlert items={stats?.lowStockItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
