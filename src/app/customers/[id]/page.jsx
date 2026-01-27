"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Clock,
  TrendingUp,
  Edit,
  Save,
  X,
  Printer,
  Download,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import CustomerPurchaseHistory from "@/components/customers/CustomerPurchaseHistory";
import {
  loadCustomer,
  loadCustomersPurchases,
  updateCustomersDetails,
} from "@/lib/actions";
// import { updateCustomersDetails } from "../../../lib/actions";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalPurchases: 0,
    avgPurchase: 0,
    lastPurchase: null,
    thirtyDaySpent: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const [customerRes, purchasesRes] = await Promise.all([
        loadCustomer(),
        loadCustomersPurchases(),
      ]);

      const customerData = customerRes;
      setCustomer(customerData);
      setCustomerData(customerData);
      setPurchases(purchasesRes || []);

      // Calculate statistics
      calculateStats(customerData, purchasesRes || []);
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
      toast.error("Failed to load customer details");
      router.push("/customers");
    } finally {
      setLoading(false);
    }
  };

  // const fetchCustomerDetails = async () => {
  //   try {
  //     setLoading(true);
  //     const [customerRes, purchasesRes] = await Promise.all([
  //       axios.get(`/customers/${customerId}`),
  //       axios.get(`/customers/${customerId}/purchases`),
  //     ]);

  //     const customerData = customerRes.data.data;
  //     setCustomer(customerData);
  //     setCustomerData(customerData);
  //     setPurchases(purchasesRes.data.data || []);

  //     // Calculate statistics
  //     calculateStats(customerData, purchasesRes.data.data || []);
  //   } catch (error) {
  //     console.error("Failed to fetch customer details:", error);
  //     toast.error("Failed to load customer details");
  //     router.push("/customers");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const calculateStats = (customerData, purchases) => {
    const totalSpent = customerData.totalSpent || 0;
    const totalPurchases = customerData.totalPurchases || 0;
    const avgPurchase = totalPurchases > 0 ? totalSpent / totalPurchases : 0;

    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentPurchases = purchases.filter(
      (p) => new Date(p.createdAt) >= thirtyDaysAgo
    );
    const thirtyDaySpent = recentPurchases.reduce(
      (sum, purchase) => sum + (purchase.totalAmount || 0),
      0
    );

    setStats({
      totalSpent,
      totalPurchases,
      avgPurchase,
      lastPurchase: customerData.lastPurchaseDate || null,
      thirtyDaySpent,
    });
  };

  const handleSave = async () => {
    try {
      const response = await updateCustomersDetails(customerId, customerData);
      setCustomer(response);
      setEditing(false);
      toast.success("Customer updated successfully");
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error("Failed to update customer");
    }
  };

  // const handleSave = async () => {
  //   try {
  //     const response = await axios.put(
  //       `/customers/${customerId}`,
  //       customerData
  //     );
  //     setCustomer(response.data.data);
  //     setEditing(false);
  //     toast.success("Customer updated successfully");
  //   } catch (error) {
  //     console.error("Failed to update customer:", error);
  //     toast.error("Failed to update customer");
  //   }
  // };

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Customer Not Found
          </h2>
          <button
            onClick={() => router.push("/customers")}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Return to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/customers")}
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {customer.name}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(
                  customer.customerType
                )}`}
              >
                {customer.customerType?.charAt(0).toUpperCase() +
                  customer.customerType?.slice(1)}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  customer.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {customer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user?.permissions?.manage_customers && (
            <>
              {editing ? (
                <>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setCustomerData(customer);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4 mr-2 inline" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2 inline" />
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2 inline" />
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={customerData.name || ""}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          name: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">
                      {customer.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={customerData.phone || ""}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">
                      {customer.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={customerData.email || ""}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          email: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">
                      {customer.email || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      value={customerData.address?.street || ""}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          address: {
                            ...customerData.address,
                            street: e.target.value,
                          },
                        })
                      }
                      rows="3"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">
                      {customer.address?.street || "Not provided"}
                      {customer.address?.city && `, ${customer.address.city}`}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer Type
                  </label>
                  {editing ? (
                    <select
                      value={customerData.customerType || "retail"}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          customerType: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="retail">Retail</option>
                      <option value="regular">Regular</option>
                      <option value="wholesale">Wholesale</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(
                        customer.customerType
                      )}`}
                    >
                      {customer.customerType?.charAt(0).toUpperCase() +
                        customer.customerType?.slice(1)}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Member Since
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {format(new Date(customer.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              {editing ? (
                <textarea
                  value={customerData.notes || ""}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, notes: e.target.value })
                  }
                  rows="3"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-sm text-gray-900 dark:text-white">
                  {customer.notes || "No notes"}
                </p>
              )}
            </div>
          </div>

          {/* Purchase History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Purchase History
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.totalPurchases} purchases
              </span>
            </div>

            <CustomerPurchaseHistory
              customerId={customerId}
              purchases={purchases}
            />
          </div>
        </div>

        {/* Right Column - Stats & Credit */}
        <div className="space-y-6">
          {/* Purchase Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Purchase Statistics
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Total Spent
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ₦{stats.totalSpent.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Total Purchases
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats.totalPurchases}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Avg. Purchase
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ₦
                    {stats.avgPurchase.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Last Purchase
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {stats.lastPurchase
                      ? format(new Date(stats.lastPurchase), "MMM dd, yyyy")
                      : "Never"}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Last 30 Days
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ₦{stats.thirtyDaySpent.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Credit Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Credit Limit
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={customerData.creditLimit || 0}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        creditLimit: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ₦{customer.creditLimit?.toLocaleString() || "0"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Credit
                </label>
                <p
                  className={`text-lg font-bold ${
                    customer.currentCredit > 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  ₦{customer.currentCredit?.toLocaleString() || "0"}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Credit
                </label>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ₦
                  {Math.max(
                    0,
                    customer.creditLimit - customer.currentCredit
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => router.push(`/sales/new?customer=${customerId}`)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                New Sale
              </button>

              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Summary
              </button>

              <button
                onClick={() => {
                  // Export customer data as CSV
                  const csvData = [
                    [
                      "Customer",
                      "Total Spent",
                      "Total Purchases",
                      "Last Purchase",
                    ],
                    [
                      customer.name,
                      `₦${stats.totalSpent}`,
                      stats.totalPurchases,
                      stats.lastPurchase
                        ? format(new Date(stats.lastPurchase), "yyyy-MM-dd")
                        : "Never",
                    ],
                  ]
                    .map((row) => row.join(","))
                    .join("\n");

                  const blob = new Blob([csvData], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `customer-${customer.name}-${format(
                    new Date(),
                    "yyyy-MM-dd"
                  )}.csv`;
                  a.click();

                  toast.success("Customer data exported");
                }}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
