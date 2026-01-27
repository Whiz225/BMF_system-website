"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  PieChart,
  DollarSign,
  Download,
  RefreshCw,
  Eye,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { loadInventory, loadSalesInventory } from "@/lib/actions";
// import { loadInventory, loadSalesInventory } from "../../../lib/actions";

export default function InventoryAnalysisPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalValue: 0,
    totalItems: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    needReorderCount: 0,
  });
  const [categoryStats, setCategoryStats] = useState([]);
  const [timeFilter, setTimeFilter] = useState("30d");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchInventoryAnalysis();
  }, [timeFilter]);

  const fetchInventoryAnalysis = async () => {
    try {
      setLoading(true);
      const [inventoryRes, salesRes] = await Promise.all([
        loadInventory(),
        loadSalesInventory(),
      ]);
      // const [inventoryRes, salesRes] = await Promise.all([
      //   axios.get("/inventory"),
      //   axios.get("/sales?status=completed"),
      // ]);

      // const inventoryData = inventoryRes.data.data || [];
      // const salesData = salesRes.data.data || [];
      const inventoryData = inventoryRes || [];
      const salesData = salesRes || [];

      // Calculate inventory statistics
      const totalValue = inventoryData.reduce((sum, item) => {
        const productValue =
          (item.product?.sellingPrice || 0) * item.currentStock;
        return sum + productValue;
      }, 0);

      const lowStockItems = inventoryData.filter(
        (item) =>
          item.status === "low_stock" ||
          (item.availableStock > 0 && item.availableStock < 10)
      );

      const outOfStockItems = inventoryData.filter(
        (item) => item.status === "out_of_stock" || item.availableStock <= 0
      );

      // Calculate category statistics
      const categoryMap = {};
      inventoryData.forEach((item) => {
        const category = item.product?.category || "uncategorized";
        if (!categoryMap[category]) {
          categoryMap[category] = {
            category,
            totalItems: 0,
            totalValue: 0,
            lowStock: 0,
            outOfStock: 0,
          };
        }
        categoryMap[category].totalItems++;
        categoryMap[category].totalValue +=
          (item.product?.sellingPrice || 0) * item.currentStock;
        if (
          item.status === "low_stock" ||
          (item.availableStock > 0 && item.availableStock < 10)
        ) {
          categoryMap[category].lowStock++;
        }
        if (item.status === "out_of_stock" || item.availableStock <= 0) {
          categoryMap[category].outOfStock++;
        }
      });

      setInventory(inventoryData);
      setStats({
        totalValue,
        totalItems: inventoryData.length,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        needReorderCount: lowStockItems.length + outOfStockItems.length,
      });
      setCategoryStats(Object.values(categoryMap));
    } catch (error) {
      console.error("Failed to fetch inventory analysis:", error);
      toast.error("Failed to load inventory analysis");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "low_stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "out_of_stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "in_stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Inventory Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive inventory insights and analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={fetchInventoryAnalysis}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Inventory Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₦{stats.totalValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Low Stock Items
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.lowStockCount}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Out of Stock
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.outOfStockCount}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need Reorder
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.needReorderCount}
              </p>
            </div>
            <Package className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Category Distribution
          </h3>

          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div
                key={cat.category}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {cat.category.replace("_", " ")}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {cat.totalItems} items • ₦{cat.totalValue.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {cat.lowStock > 0 && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                      {cat.lowStock} low
                    </span>
                  )}
                  {cat.outOfStock > 0 && (
                    <span className="text-xs text-red-600 dark:text-red-400">
                      {cat.outOfStock} out
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Status Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Stock Status
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                In Stock
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.totalItems -
                    stats.lowStockCount -
                    stats.outOfStockCount}
                </span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Low Stock
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  {stats.lowStockCount}
                </span>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Out of Stock
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {stats.outOfStockCount}
                </span>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Stock Items */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Critical Stock Items ({stats.lowStockCount + stats.outOfStockCount})
          </h3>
          <button
            onClick={() => router.push("/inventory/stock")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Manage Stock →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {inventory
                .filter((item) => item.status !== "in_stock")
                .slice(0, 10)
                .map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SKU: {item.product?.sku || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {item.product?.category?.replace("_", " ") || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-medium ${
                            item.availableStock <= 0
                              ? "text-red-600 dark:text-red-400"
                              : item.availableStock < 10
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {item.availableStock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status?.replace("_", " ") || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/inventory/stock?edit=${item._id}`)
                          }
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit Stock"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/products/${item.product?._id}`)
                          }
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
