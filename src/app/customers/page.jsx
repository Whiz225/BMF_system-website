"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  User,
  Phone,
  Mail,
  DollarSign,
  Search,
  Filter,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { deleteCustomer, loadAllCustomers } from "@/lib/actions";
// import { deleteCustomer, loadAllCustomers } from "../../lib/actions";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await loadAllCustomers();
      setCustomers(response || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    if (!confirm("Are you sure you want to deactivate this customer?")) return;

    try {
      await deleteCustomer(customerId);
      // await axios.delete(`/customers/${customerId}`);
      toast.success("Customer deactivated successfully");
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error("Failed to deactivate customer");
    }
  };

  // const fetchCustomers = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get("/customers");
  //     setCustomers(response.data.data || []);
  //   } catch (error) {
  //     console.error("Failed to fetch customers:", error);
  //     toast.error("Failed to load customers");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDelete = async (customerId) => {
  //   if (!confirm("Are you sure you want to deactivate this customer?")) return;

  //   try {
  //     await axios.delete(`/customers/${customerId}`);
  //     toast.success("Customer deactivated successfully");
  //     fetchCustomers();
  //   } catch (error) {
  //     console.error("Failed to delete customer:", error);
  //     toast.error("Failed to deactivate customer");
  //   }
  // };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      search === "" ||
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search);

    const matchesType =
      customerTypeFilter === "" || customer.customerType === customerTypeFilter;

    return matchesSearch && matchesType;
  });

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case "wholesale":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "corporate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "regular":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
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
            Customers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your customer relationships
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-4 w-4 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Customers
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {customers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₦
                {customers
                  .reduce((sum, c) => sum + (c.totalSpent || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-4 w-4 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Wholesale
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {customers.filter((c) => c.customerType === "wholesale").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Corporate
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {customers.filter((c) => c.customerType === "corporate").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={customerTypeFilter}
                onChange={(e) => setCustomerTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
                <option value="corporate">Corporate</option>
                <option value="regular">Regular</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Table
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        </div>
      </div>

      {/* Customers Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <User className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No customers found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or add a new customer.
              </p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div
                key={customer._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {customer.name}
                      </h3>
                      <span
                        className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(
                          customer.customerType
                        )}`}
                      >
                        {customer.customerType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">
                        {customer.phone}
                      </span>
                    </div>

                    {customer.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900 dark:text-white truncate">
                          {customer.email}
                        </span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Purchases
                          </p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {customer.totalPurchases || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Total Spent
                          </p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            ₦{(customer.totalSpent || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <button
                      onClick={() =>
                        (window.location.href = `/customers/${customer._id}`)
                      }
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      View Details
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          /* Edit customer */
                        }}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Purchases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Purchase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {customer.phone}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(
                          customer.customerType
                        )}`}
                      >
                        {customer.customerType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {customer.totalPurchases || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₦{(customer.totalSpent || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {customer.lastPurchaseDate
                          ? format(new Date(customer.lastPurchaseDate), "PP")
                          : "Never"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            (window.location.href = `/customers/${customer._id}`)
                          }
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            /* Edit */
                          }}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
