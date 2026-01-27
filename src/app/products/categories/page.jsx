"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Tag,
  Plus,
  Edit,
  Trash,
  Package,
  ArrowUpRight,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createProductsCategory,
  deleteCategories,
  loadAllProductCategories,
  loadAllProducts,
  updateAllProductsInACategories,
  updateProductsCategories,
} from "@/lib/actions";
// import {
//   createProductsCategory,
//   deleteCategories,
//   loadAllProductCategories,
//   loadAllProducts,
//   updateAllProductsInACategories,
//   updateProductsCategories,
// } from "../../../lib/actions";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await loadAllProductCategories();
      setCategories(response || []);
      // const response = await axios.get("/products/categories/all");
      // setCategories(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await loadAllProducts();
      setProducts(response || []);
      // const response = await axios.get("/products");
      // setProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update existing category
        await updateProductsCategories(editingCategory._id, categoryData);

        // await axios.put(`/categories/${editingCategory._id}`, categoryData);
        toast.success("Category updated successfully");
      } else {
        // Create new category
        await createProductsCategory(categoryData);
        // await axios.post("/categories", categoryData);
        toast.success("Category created successfully");
      }

      setShowForm(false);
      setEditingCategory(null);
      setCategoryData({ name: "", description: "", isActive: true });
      fetchCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryData({
      name: category,
      description: "",
      isActive: true,
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryName) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${categoryName}"? This will affect all products in this category.`
      )
    ) {
      return;
    }

    try {
      // Check if category has products
      const productsInCategory = products.filter(
        (p) => p.category === categoryName
      );
      if (productsInCategory.length > 0) {
        if (
          !confirm(
            `This category has ${productsInCategory.length} products. They will be moved to "others" category. Continue?`
          )
        ) {
          return;
        }

        // Update all products in this category to "others"
        for (const product of productsInCategory) {
          await updateAllProductsInACategories(product._id, { category: "others" })
          // await axios.put(`/products/${product._id}`, { category: "others" });
        }
      }

      await deleteCategories(categoryName)
      // await axios.delete(`/categories/${categoryName}`);
      toast.success("Category deleted successfully");
      fetchCategories();
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    }
  };

  const getCategoryStats = (categoryName) => {
    const categoryProducts = products.filter(
      (p) => p.category === categoryName
    );
    const totalValue = categoryProducts.reduce(
      (sum, p) => sum + p.sellingPrice * (p.currentStock || 0),
      0
    );
    const lowStockCount = categoryProducts.filter(
      (p) => p.inventoryStatus === "low_stock"
    ).length;
    const outOfStockCount = categoryProducts.filter(
      (p) => p.inventoryStatus === "out_of_stock"
    ).length;

    return {
      productCount: categoryProducts.length,
      totalValue,
      lowStockCount,
      outOfStockCount,
      activeProducts: categoryProducts.filter((p) => p.isActive).length,
    };
  };

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
      case "others":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(search.toLowerCase())
  );

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
            Product Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your product categories and organization
          </p>
        </div>

        {user?.permissions?.manage_inventory && (
          <button
            onClick={() => {
              setEditingCategory(null);
              setCategoryData({ name: "", description: "", isActive: true });
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Category
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchCategories}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredCategories.map((category) => {
          const stats = getCategoryStats(category);

          return (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50 transition-all"
            >
              {/* Category Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                        category
                      )}`}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      {category.charAt(0).toUpperCase() +
                        category.slice(1).replace("_", " ")}
                    </span>
                  </div>

                  {user?.permissions?.manage_inventory && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Edit Category"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-1.5 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete Category"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Stats */}
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Products
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.productCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Active
                      </span>
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {stats.activeProducts}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ArrowUpRight className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Value
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ₦{stats.totalValue.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Low Stock
                      </span>
                    </div>
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      {stats.lowStockCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Out of Stock
                      </span>
                    </div>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {stats.outOfStockCount}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() =>
                      (window.location.href = `/products?category=${category}`)
                    }
                    className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View Products →
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Category Card */}
        {user?.permissions?.manage_inventory && (
          <button
            onClick={() => {
              setEditingCategory(null);
              setCategoryData({ name: "", description: "", isActive: true });
              setShowForm(true);
            }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center p-8 min-h-[200px]"
          >
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Add New Category
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Create a new product category
            </p>
          </button>
        )}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="sr-only">Close</span>✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryData.name}
                    onChange={(e) =>
                      setCategoryData({ ...categoryData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Luxury Mattress"
                    required
                    disabled={!!editingCategory}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={categoryData.description}
                    onChange={(e) =>
                      setCategoryData({
                        ...categoryData,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description for this category"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={categoryData.isActive}
                    onChange={(e) =>
                      setCategoryData({
                        ...categoryData,
                        isActive: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Category is active
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {editingCategory ? "Update" : "Create"} Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
