"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
// import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Truck,
  Phone,
  Mail,
  Building2,
  User,
  MapPin,
  DollarSign,
  Star,
  Pencil,
  Printer,
  Box,
  Calendar,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { loadProductsSuppliers, loadSuppliers } from "@/lib/actions";
// import { loadProductsSuppliers, loadSuppliers } from "../../../lib/actions";

export default function SupplierDetailPage() {
  const params = useParams();
  const supplierId = params.id;
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  useEffect(() => {
    if (supplierId) {
      fetchSupplierDetails();
    }
  }, [supplierId]);

  const fetchSupplierDetails = async () => {
    try {
      setLoading(true);

      const [supplierRes, productsRes] = await Promise.all([
        loadSuppliers(supplierId),
        loadProductsSuppliers(supplierId),
        // axios.get(`/api/suppliers/${supplierId}`),
        // axios.get(`/api/suppliers/${supplierId}/products`),
      ]);

      setSupplier(supplierRes);
      setProducts(productsRes || []);

      // Mock orders data (replace with actual API)
      const mockOrders = [
        {
          id: 1,
          orderNumber: "ORD-001",
          date: new Date(),
          amount: 150000,
          status: "completed",
        },
        {
          id: 2,
          orderNumber: "ORD-002",
          date: new Date(),
          amount: 200000,
          status: "pending",
        },
        {
          id: 3,
          orderNumber: "ORD-003",
          date: new Date(),
          amount: 75000,
          status: "completed",
        },
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error("Failed to fetch supplier details:", error);
      toast.error("Failed to load supplier details");
    } finally {
      setLoading(false);
    }
  };

  const printSupplierInfo = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Supplier Report - ${supplier?.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Supplier Report</h1>
          <h2>${supplier?.name}</h2>
          <p>Generated on ${format(new Date(), "PPpp")}</p>
        </div>
        
        <div class="section">
          <h3>Contact Information</h3>
          <p><strong>Company:</strong> ${supplier?.company}</p>
          <p><strong>Contact Person:</strong> ${supplier?.contactPerson}</p>
          <p><strong>Email:</strong> ${supplier?.email}</p>
          <p><strong>Phone:</strong> ${supplier?.phone}</p>
          <p><strong>Rating:</strong> ${supplier?.rating}/5</p>
        </div>
        
        <div class="section">
          <h3>Products Supplied (${products.length})</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (product) => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.sku}</td>
                  <td>${product.category}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>Foam Business Manager - Supplier Report</p>
        </div>
        <script>window.print(); setTimeout(() => window.close(), 1000);</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Supplier Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The requested supplier does not exist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {supplier.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {supplier.company}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={printSupplierInfo}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Printer className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Print
          </button>
          <button
            onClick={() => {
              /* Edit supplier */
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            disabled={!user?.permissions?.manage_suppliers}
          >
            <Pencil className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Edit Supplier
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {["overview", "products", "orders", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Supplier Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Supplier Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Company
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {supplier.company}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Contact Person
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {supplier.contactPerson}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {supplier.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {supplier.email}
                  </p>
                </div>
              </div>

              {supplier.address && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Address
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {supplier.address.street}, {supplier.address.city}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <Star className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Rating
                  </p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(supplier.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {supplier.rating?.toFixed(1)}/5
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Payment Terms
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {supplier.paymentTerms?.replace("_", " ").toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    supplier.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {supplier.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Content based on active tab */}
        <div className="lg:col-span-2">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center">
                    <Box className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Products
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {products.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {orders.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last Order
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {orders.length > 0
                          ? format(new Date(orders[0].date), "MMM dd")
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Products Supplied
                  </h3>
                </div>
                <div className="p-6">
                  {products.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No products supplied
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                              <Box className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SKU: {product.sku} • {product.category}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ₦{product.sellingPrice?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {products.length > 5 && (
                    <button className="w-full mt-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      View all {products.length} products
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All Products ({products.length})
                </h3>
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
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            SKU: {product.sku}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            ₦{product.sellingPrice?.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order History
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.orderNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {format(new Date(order.date), "PP")}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            ₦{order.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
