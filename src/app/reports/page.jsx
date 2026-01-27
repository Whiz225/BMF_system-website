"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  Box,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { loadAllCustomers, loadInventory, loadSales } from "@/lib/actions";
// import { loadAllCustomers, loadInventory, loadSales } from "../../lib/actions";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("month");
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Get date range
      let startDate, endDate;
      const now = new Date();

      switch (dateRange) {
        case "week":
          startDate = subDays(now, 7);
          endDate = now;
          break;
        case "month":
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case "quarter":
          startDate = subDays(now, 90);
          endDate = now;
          break;
        case "year":
          startDate = subDays(now, 365);
          endDate = now;
          break;
        default:
          startDate = subDays(now, 30);
          endDate = now;
      }

      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      // Fetch based on report type
      switch (reportType) {
        case "sales":
          const salesRes = await loadSales(params);
          setSalesData(salesRes || []);
          // const salesRes = await axios.get("/sales", { params });
          // setSalesData(salesRes.data.data || []);
          break;
        case "inventory":
          const inventoryRes = await loadInventory();
          setInventoryData(inventoryRes || []);
          // const inventoryRes = await axios.get("/inventory");
          // setInventoryData(inventoryRes.data.data || []);
          break;
        case "customers":
          const customersRes = await loadAllCustomers();
          setCustomerData(customersRes || []);
          // const customersRes = await axios.get("/customers");
          // setCustomerData(customersRes.data.data || []);
          break;
      }
    } catch (error) {
      console.error("Failed to fetch report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const calculateSalesMetrics = () => {
    const totalRevenue = salesData.reduce(
      (sum, sale) => sum + (sale.totalAmount || 0),
      0
    );
    const totalProfit = salesData.reduce((sum, sale) => {
      return (
        sum +
        (sale.items?.reduce(
          (itemSum, item) => itemSum + (item.profit || 0),
          0
        ) || 0)
      );
    }, 0);

    return {
      totalRevenue,
      totalProfit,
      averageSale: salesData.length > 0 ? totalRevenue / salesData.length : 0,
      totalSales: salesData.length,
    };
  };

  const exportReport = async () => {
    try {
      // Create CSV data
      let csvContent = "";

      switch (reportType) {
        case "sales":
          csvContent = "Date,Sale Number,Customer,Items,Total Amount,Profit\n";
          salesData.forEach((sale) => {
            const date = format(new Date(sale.createdAt), "yyyy-MM-dd");
            const customer = sale.customer?.name || "Walk-in";
            const items = sale.items?.length || 0;
            const profit =
              sale.items?.reduce((sum, item) => sum + (item.profit || 0), 0) ||
              0;
            csvContent += `${date},${sale.saleNumber},${customer},${items},${sale.totalAmount},${profit}\n`;
          });
          break;
        case "inventory":
          csvContent =
            "Product,SKU,Category,Current Stock,Available Stock,Status\n";
          inventoryData.forEach((item) => {
            csvContent += `${item.product?.name},${item.product?.sku},${item.product?.category},${item.currentStock},${item.availableStock},${item.status}\n`;
          });
          break;
        case "customers":
          csvContent =
            "Name,Email,Phone,Total Purchases,Total Spent,Last Purchase\n";
          customerData.forEach((customer) => {
            const lastPurchase = customer.lastPurchaseDate
              ? format(new Date(customer.lastPurchaseDate), "yyyy-MM-dd")
              : "Never";
            csvContent += `${customer.name},${customer.email},${customer.phone},${customer.totalPurchases},${customer.totalSpent},${lastPurchase}\n`;
          });
          break;
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}_report_${format(
        new Date(),
        "yyyy-MM-dd"
      )}.csv`;
      a.click();

      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export report");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const metrics = calculateSalesMetrics();

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Business insights and performance metrics
          </p>
        </div>
        <button
          onClick={exportReport}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Export Report
        </button>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setReportType("sales")}
            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
              reportType === "sales"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-gray-700 dark:text-gray-300 mr-3" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Sales Reports
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Revenue & profit analysis
              </p>
            </div>
          </button>

          <button
            onClick={() => setReportType("inventory")}
            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
              reportType === "inventory"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <Box className="h-6 w-6 sm:h-7 sm:w-7 text-gray-700 dark:text-gray-300 mr-3" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Inventory Reports
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stock levels & tracking
              </p>
            </div>
          </button>

          <button
            onClick={() => setReportType("customers")}
            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
              reportType === "customers"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <Users className="h-6 w-6 sm:h-7 sm:w-7 text-gray-700 dark:text-gray-300 mr-3" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Customer Reports
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Purchase patterns & trends
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Date Range & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                More Filters
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {reportType === "sales" &&
              `${salesData.length} sales in selected period`}
            {reportType === "inventory" &&
              `${inventoryData.length} inventory items`}
            {reportType === "customers" && `${customerData.length} customers`}
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metrics Cards */}
        <div className="lg:col-span-1 space-y-4">
          {reportType === "sales" && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦{metrics.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {user?.permissions?.view_profits && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 mr-4" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Profit
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₦{metrics.totalProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Sales
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metrics.totalSales}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Average Sale
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦
                      {metrics.averageSale.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Report Data Table */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {reportType === "sales" && "Sales Report"}
                {reportType === "inventory" && "Inventory Report"}
                {reportType === "customers" && "Customer Report"}
              </h3>
            </div>

            <div className="overflow-x-auto">
              {reportType === "sales" && (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Sale #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Amount
                      </th>
                      {user?.permissions?.view_profits && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Profit
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {salesData.slice(0, 10).map((sale) => (
                      <tr key={sale._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {format(new Date(sale.createdAt), "MMM dd")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {sale.saleNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {sale.customer?.name || "Walk-in"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₦{sale.totalAmount?.toLocaleString()}
                        </td>
                        {user?.permissions?.view_profits && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                            ₦
                            {sale.items
                              ?.reduce(
                                (sum, item) => sum + (item.profit || 0),
                                0
                              )
                              .toLocaleString()}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {reportType === "inventory" && (
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {inventoryData.slice(0, 10).map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.product?.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.product?.sku}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.product?.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.currentStock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === "low_stock"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : item.status === "out_of_stock"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            }`}
                          >
                            {item.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {reportType === "customers" && (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Purchases
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Total Spent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {customerData.slice(0, 10).map((customer) => (
                      <tr key={customer._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {customer.phone}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {customer.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {customer.totalPurchases || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ₦{(customer.totalSpent || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {reportType === "sales" && salesData.length > 10 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  View all {salesData.length} sales
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
