"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
// import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Calendar,
  Filter,
  DollarSign,
  User,
  FileText,
  RefreshCw,
  Eye,
  Pencil,
  Trash,
  Printer,
  Search,
} from "lucide-react";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { loadSalesByUrl, updateSalesStatus } from "@/lib/actions";
import { handlePrint } from "@/components/printer";
// import { loadSalesByUrl, updateSalesStatus } from "../../lib/actions";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("today"); // today, week, month, year, custom
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    averageSale: 0,
    totalProfit: 0,
  });
  const { user } = useAuth();

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      let url = "/sales";
      // let url = "/api/sales";
      const params = new URLSearchParams();

      // Apply date filter
      const now = new Date();
      let startDate, endDate;

      switch (dateFilter) {
        case "today":
          startDate = startOfDay(now);
          endDate = endOfDay(now);
          break;
        case "week":
          startDate = startOfWeek(now);
          endDate = endOfWeek(now);
          break;
        case "month":
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case "year":
          startDate = startOfYear(now);
          endDate = endOfYear(now);
          break;
        case "all":
        default:
          break;
      }

      if (startDate && endDate) {
        params.append("startDate", startDate.toISOString());
        params.append("endDate", endDate.toISOString());
      }

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await loadSalesByUrl(url);
      // const response = await axios.get(url);
      const salesData = response || [];
      console.log("salesData".salesData);
      setSales(salesData);

      // Calculate stats
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

      setStats({
        totalRevenue,
        totalSales: salesData.length,
        averageSale: salesData.length > 0 ? totalRevenue / salesData.length : 0,
        totalProfit,
      });
    } catch (error) {
      console.error("Failed to fetch sales:", error);
      toast.error("Failed to load sales");
    } finally {
      setLoading(false);
    }
  }, [dateFilter, statusFilter]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleDateFilterChange = useCallback((e) => {
    setDateFilter(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  const handleDelete = useCallback(
    async (saleId) => {
      if (!confirm("Are you sure you want to delete this sale?")) return;

      try {
        await updateSalesStatus(saleId, { status: "cancelled" });
        // await axios.patch(`/api/sales/${saleId}/status`, { status: "cancelled" });
        toast.success("Sale cancelled successfully");
        fetchSales();
      } catch (error) {
        console.error("Failed to cancel sale:", error);
        toast.error("Failed to cancel sale");
      }
    },
    [fetchSales]
  );

  const printReceipt = useCallback((sale) => {
    // Simple receipt printing
    handlePrint(sale);
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }, []);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        search === "" ||
        sale.saleNumber?.toLowerCase().includes(search.toLowerCase()) ||
        sale.customer?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "" || sale.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sales, search, statusFilter]);

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
            Sales
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all sales transactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => (window.location.href = "/sales/new")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Sale
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₦{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Sales
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalSales}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-5 w-5 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Sale
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₦
                {stats.averageSale.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>
        </div>

        {user?.permissions?.view_profits && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Profit
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ₦
                  {stats.totalProfit.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <div className="flex space-x-2">
              <select
                value={dateFilter}
                onChange={handleDateFilterChange}
                // onChange={(e) => setDateFilter(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              // onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by sale number or customer..."
                value={search}
                onChange={handleSearchChange}
                // onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* View Toggle and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={handleViewModeChange}
                // onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Grid
              </button>
              <button
                onClick={handleViewModeChange}
                // onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Table
              </button>
            </div>

            <button
              onClick={fetchSales}
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredSales.length} sales
          </div>
        </div>
      </div>

      {/* Sales Display */}
      {viewMode === "grid" ? (
        /* Grid View for Mobile/Tablet */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSales.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No sales found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your filters or make your first sale.
              </p>
              <button
                onClick={() => (window.location.href = "/sales/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Sale
              </button>
            </div>
          ) : (
            filteredSales.map((sale) => (
              <div
                key={sale._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50 transition-all"
              >
                {/* Sale Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {sale.saleNumber}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {format(new Date(sale.createdAt), "PPp")}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        sale.status
                      )}`}
                    >
                      {sale.status}
                    </span>
                  </div>
                </div>

                {/* Sale Details */}
                <div className="p-4">
                  {/* Customer */}
                  <div className="mb-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <User className="h-4 w-4 mr-2" />
                      Customer
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {sale.customer?.name || "Walk-in Customer"}
                    </p>
                  </div>

                  {/* Items Summary */}
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Items
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {sale.items?.length || 0} item(s)
                    </p>
                  </div>

                  {/* Payment */}
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Payment
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {sale.paymentMethod?.toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        ₦{sale.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Balance: ₦{sale.balance?.toLocaleString()}
                    </div>
                  </div>

                  {/* Sold By */}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Sold by: {sale.soldBy?.firstName || "N/A"}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => printReceipt(sale)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `/sales/${sale._id}`)
                      }
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {user?.role === "business_owner" && (
                      <button
                        onClick={() => handleDelete(sale._id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Table View for Desktop */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sale #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No sales found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr
                      key={sale._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {sale.saleNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {format(new Date(sale.createdAt), "PP")}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(sale.createdAt), "p")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {sale.customer?.name || "Walk-in"}
                        </div>
                        {sale.customer?.phone && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {sale.customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {sale.items?.length || 0} items
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ₦{sale.totalAmount?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {sale.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            sale.status
                          )}`}
                        >
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => printReceipt(sale)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            title="Print"
                          >
                            <Printer className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              (window.location.href = `/sales/${sale._id}`)
                            }
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          {user?.role === "business_owner" && (
                            <button
                              onClick={() => handleDelete(sale._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
