"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Truck,
  Phone,
  Mail,
  Building2,
  DollarSign,
  Star,
  Pencil,
  Trash,
  Eye,
  User,
  Search,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { deleteSupplier, loadAllSuppliers } from "@/lib/actions";
// import { deleteSupplier, loadAllSuppliers } from "../../lib/actions";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await loadAllSuppliers();
      setSuppliers(response || []);
      // const response = await axios.get("/suppliers");
      // setSuppliers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (supplierId) => {
    if (!confirm("Are you sure you want to deactivate this supplier?")) return;

    try {
      await deleteSupplier(supplierId);
      // await axios.delete(`/suppliers/${supplierId}`);
      toast.success("Supplier deactivated successfully");
      fetchSuppliers();
    } catch (error) {
      console.error("Failed to delete supplier:", error);
      toast.error("Failed to deactivate supplier");
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    return (
      search === "" ||
      supplier.name?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.company?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.contactPerson?.toLowerCase().includes(search.toLowerCase())
    );
  });

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
            Suppliers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your foam and mattress suppliers
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          disabled={!user?.permissions?.manage_suppliers}
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Add Supplier
        </button>
      </div>

      {/* Search & Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">
                {suppliers.length} Suppliers
              </span>
            </div>
            <div className="flex items-center">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">
                {suppliers.filter((s) => s.isActive).length} Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Grid/Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No suppliers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {search
                ? "Try a different search"
                : "Add your first supplier to get started"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {supplier.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {supplier.company}
                        </p>
                      </div>
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
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {supplier.phone}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300 truncate">
                          {supplier.email}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {supplier.contactPerson}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                      <button
                        onClick={() =>
                          (window.location.href = `/suppliers/${supplier._id}`)
                        }
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        View Details
                      </button>
                      <div className="flex space-x-2">
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </button>
                        {user?.permissions?.manage_suppliers && (
                          <button
                            onClick={() => handleDelete(supplier._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Rating
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
                  {filteredSuppliers.map((supplier) => (
                    <tr
                      key={supplier._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                            <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {supplier.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {supplier.company}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {supplier.contactPerson}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {supplier.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {supplier.productsSupplied?.length || 0} products
                        </div>
                      </td>
                      <td className="px-6 py-4">
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
                            {supplier.rating?.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            supplier.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {supplier.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              (window.location.href = `/suppliers/${supplier._id}`)
                            }
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          {user?.permissions?.manage_suppliers && (
                            <button
                              onClick={() => handleDelete(supplier._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
