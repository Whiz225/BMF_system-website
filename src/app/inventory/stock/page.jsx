"use client";

import { useState, useEffect } from "react";
// import axios from "axios";
import toast from "react-hot-toast";
import {
  Package,
  Plus,
  Minus,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { loadInventory, updateStockInventory } from "@/lib/actions";
// import { loadInventory, updateStockInventory } from "../../../lib/actions";

export default function InventoryStockPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await loadInventory();
      setInventory(response || []);

      // const response = await axios.get("/inventory");
      // setInventory(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (itemId, newStock) => {
    try {
      await updateStockInventory(itemId, newStock, user._id);
      // await axios.patch(`/inventory/${itemId}/stock`, {
      //   currentStock: newStock,
      //   updatedBy: user._id,
      // });

      toast.success("Stock updated successfully");
      fetchInventory();
      setEditingItem(null);
      setStockAdjustment(0);
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const adjustStock = (itemId, adjustment) => {
    const item = inventory.find((i) => i._id === itemId);
    if (!item) return;

    const newStock = Math.max(0, item.currentStock + adjustment);
    updateStock(itemId, newStock);
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

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.product?.sku?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || item.product?.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    ...new Set(inventory.map((item) => item.product?.category).filter(Boolean)),
  ];

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
            Inventory Stock
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your inventory levels
          </p>
        </div>
        <button
          onClick={fetchInventory}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Items
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inventory.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                In Stock
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inventory.filter((i) => i.status === "in_stock").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Low Stock
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inventory.filter((i) => i.status === "low_stock").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Out of Stock
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inventory.filter((i) => i.status === "out_of_stock").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() +
                    category.slice(1).replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
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
                  Available
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
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No inventory items found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
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
                      {editingItem === item._id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={stockAdjustment}
                            onChange={(e) =>
                              setStockAdjustment(parseInt(e.target.value) || 0)
                            }
                            className="w-20 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={() =>
                              updateStock(item._id, stockAdjustment)
                            }
                            className="p-1 text-green-600 hover:text-green-800"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(null);
                              setStockAdjustment(0);
                            }}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.currentStock}
                          </span>
                          {user?.permissions?.manage_inventory && (
                            <button
                              onClick={() => {
                                setEditingItem(item._id);
                                setStockAdjustment(item.currentStock);
                              }}
                              className="p-1 text-gray-600 hover:text-gray-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
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
                          onClick={() => adjustStock(item._id, 1)}
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="Add 1"
                          disabled={!user?.permissions?.manage_inventory}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => adjustStock(item._id, -1)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Remove 1"
                          disabled={!user?.permissions?.manage_inventory}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
