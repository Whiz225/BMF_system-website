"use client";

import { useState, useEffect } from "react";
// import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash,
  Eye,
  Filter,
  Search,
  Box,
  DollarSign,
  Tag,
} from "lucide-react";
import ProductForm from "@/components/inventory/ProductForm";
import { useAuth } from "@/contexts/AuthContext";
import {
  deleteProduct,
  loadAllProducts,
  updateStockInevtory,
} from "@/lib/actions";
// import { deleteProduct, loadAllProducts, updateStockInevtory } from "../../../lib/actions";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingStock, setEditingStock] = useState(null);
  const [stockData, setStockData] = useState({});
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [categories] = useState([
    "mattress",
    "pillow",
    "foot_mat",
    "bedsheet",
    "others",
  ]);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await loadAllProducts();
      setProducts(response || []);

      // const response = await axios.get("/products");
      // setProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleEditStock = (product) => {
    setEditingStock(product._id);
    setStockData({
      currentStock: product.currentStock || 0,
      minStockLevel: product.minStockLevel || 5,
      maxStockLevel: product.maxStockLevel || 100,
      reorderPoint: product.reorderPoint || 10,
    });
  };

  const updateStock = async (productId) => {
    try {
      await updateStockInevtory(productId, stockData);
      // await axios.patch(`/products/${productId}/inventory`, stockData);
      toast.success("Stock updated successfully");
      setEditingStock(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Failed to update stock");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to deactivate this product?")) return;

    try {
      await deleteProduct(productId);
      // await axios.delete(`/products/${productId}`);
      toast.success("Product deactivated successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to deactivate product");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const filteredProducts = products.filter((product) => {
    console.log(
      "product",
      product,
      "search",
      search,
      "categoryFilter",
      categoryFilter
    );
    const matchesSearch =
      search === "" ||
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.supplier.name?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case "mattress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pillow":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "foot_mat":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "bedsheet":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
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
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your foam and mattress products
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
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

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or Supplier's name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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

          {/* Status Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                <option>All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchProducts}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="sr-only">Close</span>✕
                </button>
              </div>
              <ProductForm
                product={editingProduct}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {/* Products Display */}
      {viewMode === "grid" ? (
        /* Grid View for Mobile/Tablet */
        /* Grid View for Mobile/Tablet */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Box className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or add a new product.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Product
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow flex flex-col h-full"
              >
                {/* Product Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {product.supplier?.name || "No supplier"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                        product.category
                      )}`}
                    >
                      {product.category.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4 flex-1">
                  {/* Dimensions for Mattress */}
                  {product.category === "mattress" && product.dimensions && (
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">Dimensions:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.dimensions.thickness && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                            {product.dimensions.thickness}"
                          </span>
                        )}
                        {product.dimensions.density && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs">
                            {product.dimensions.density} density
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pricing Information */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Selling Price
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₦{product.sellingPrice?.toLocaleString()}
                        </p>
                      </div>
                      {user?.permissions?.view_profits && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Profit Margin
                          </p>
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {product.profitMargin?.toFixed(1)}%
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Cost Price:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₦{product.unitCost?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-center text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          product.isActive
                        )}`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>

                      {/* Add stock indicator if you have inventory data */}
                      {product.inventory && (
                        <span
                          className={`text-xs font-medium ${
                            product.inventory.availableStock <= 0
                              ? "text-red-600 dark:text-red-400"
                              : product.inventory.availableStock < 10
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          Stock: {product.inventory.availableStock || 0}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    {user?.role === "business_owner" && (
                      <button
                        onClick={() => handleDelete(product._id)}
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
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dimensions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pricing
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Box className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No products found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          {/* <div className="text-sm text-gray-500 dark:text-gray-400">
                            SKU: {product.sku}
                          </div> */}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            product.category
                          )}`}
                        >
                          {product.category.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {product.category === "mattress" &&
                        product.dimensions ? (
                          <>
                            {product.dimensions.thickness}" •{" "}
                            {product.dimensions.density} density
                          </>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ₦{product.sellingPrice?.toLocaleString()}
                        </div>
                        {/* <div className="text-sm text-green-600 dark:text-green-400">
                          {product.profitMargin?.toFixed(1)}% margin
                        </div> */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            product.isActive
                          )}`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          {user?.role === "business_owner" && (
                            <button
                              onClick={() => handleDelete(product._id)}
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

          {/* Pagination (Optional) */}
          {filteredProducts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredProducts.length}</span>{" "}
                  of <span className="font-medium">{products.length}</span>{" "}
                  results
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
