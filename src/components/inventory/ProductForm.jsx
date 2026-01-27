"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import {loadAllSuppliers, createProduct, updateProduct} from "@/lib/actions"
import { X, Package, DollarSign, Tag, BarChart3 } from "lucide-react";

export default function ProductForm({ product, onSuccess }) {
  const {
    register,
    handleSubmit,

    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: product || {
      name: "",
      category: "mattress",
      dimensions: { thickness: 6, density: 32 },
      supplier: "",
      unitCost: 0,
      sellingPrice: 0,
      minStockLevel: 5,
      maxStockLevel: 100,
      // reorderPoint: 10,
      // currentStock: 0,
      description: "",
      isActive: true,
    },
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories] = useState([
    "mattress",
    "pillow",
    "foot_mat",
    "bedsheet",
    "others",
  ]);

  const category = watch("category");
  const unitCost = watch("unitCost");
  const sellingPrice = watch("sellingPrice");
  const profitMargin =
    sellingPrice && unitCost ? ((sellingPrice - unitCost) / unitCost) * 100 : 0;

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await loadAllSuppliers(true)
      // const response = await axios.get("/suppliers?isActive=true");
      setSuppliers(response || []);
      // setSuppliers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Calculate profit margin
      data.profitMargin = profitMargin;

      if (product?._id) {
        // Update existing product
        await updateProduct(product._id, data)
        // await axios.put(`/products/${product._id}`, data);
        toast.success("Product updated successfully");
      } else {
        // Create new product
        await createProduct(data)
        // await axios.post("/products", data);
        toast.success("Product created successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleInventoryUpdate = async () => {
    // const currentStock = watch("currentStock");
    const minStockLevel = watch("minStockLevel");
    const maxStockLevel = watch("maxStockLevel");
    // const reorderPoint = watch("reorderPoint");

    try {
      await axios.patch(`/products/${product._id}/inventory`, {
        // currentStock,
        minStockLevel,
        maxStockLevel,
        // reorderPoint,
      });
      toast.success("Inventory updated successfully");
    } catch (error) {
      console.error("Failed to update inventory:", error);
      toast.error("Failed to update inventory");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Name *
          </label>
          <input
            {...register("name", { required: "Product name is required" })}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <select
            {...register("category", { required: true })}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dimensions (for mattresses) */}
      {category === "mattress" && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Mattress Dimensions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thickness (inches) *
              </label>
              <input
                {...register("dimensions.thickness", {
                  required:
                    category === "mattress"
                      ? "Thickness is required for mattresses"
                      : false,
                  min: { value: 1, message: "Minimum thickness is 1 inch" },
                  max: { value: 24, message: "Maximum thickness is 24 inches" },
                })}
                type="number"
                step="0.5"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 6"
              />
              {errors.dimensions?.thickness && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.dimensions.thickness.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Density (kg/m³) *
              </label>
              <input
                {...register("dimensions.density", {
                  required:
                    category === "mattress"
                      ? "Density is required for mattresses"
                      : false,
                  min: { value: 10, message: "Minimum density is 10" },
                  max: { value: 100, message: "Maximum density is 100" },
                })}
                type="number"
                step="1"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 32"
              />
              {errors.dimensions?.density && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.dimensions.density.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unit Cost (₦) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ₦
            </span>
            <input
              {...register("unitCost", {
                required: "Unit cost is required",
                min: { value: 0, message: "Unit cost must be positive" },
              })}
              type="number"
              step="0.01"
              className="w-full pl-8 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          {errors.unitCost && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.unitCost.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selling Price (₦) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ₦
            </span>
            <input
              {...register("sellingPrice", {
                required: "Selling price is required",
                min: { value: 0, message: "Selling price must be positive" },
                validate: (value) =>
                  value >= unitCost ||
                  "Selling price must be greater than unit cost",
              })}
              type="number"
              step="0.01"
              className="w-full pl-8 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          {errors.sellingPrice && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.sellingPrice.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Profit Margin
          </label>
          <div className="flex items-center h-full">
            <div
              className={`px-4 py-2.5 w-full rounded-lg text-sm font-medium ${
                profitMargin > 0
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {profitMargin.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Settings */}
      {product?._id && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Inventory Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Stock
              </label>
              <input
                {...register("currentStock", {
                  min: { value: 0, message: "Stock cannot be negative" },
                })}
                type="number"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Stock Level
              </label>
              <input
                {...register("minStockLevel", {
                  min: { value: 0, message: "Minimum 0" },
                })}
                type="number"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reorder Point
              </label>
              <input
                {...register("reorderPoint", {
                  min: { value: 0, message: "Minimum 0" },
                })}
                type="number"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Stock Level
              </label>
              <input
                {...register("maxStockLevel", {
                  min: { value: 0, message: "Minimum 0" },
                })}
                type="number"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleInventoryUpdate}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Update Inventory Settings
          </button>
        </div>
      )}

      {/* Supplier */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Supplier *
        </label>
        <select
          {...register("supplier", { required: "Supplier is required" })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a supplier...</option>
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>
              {supplier.name} ({supplier.company})
            </option>
          ))}
        </select>
        {errors.supplier && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.supplier.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          rows="3"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter product description"
        />
      </div>

      {/* Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Product is active and available for sale
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => onSuccess()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </span>
          ) : product?._id ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </button>
      </div>
    </form>
  );
}
