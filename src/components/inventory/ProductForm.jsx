"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

const ProductForm = ({ product, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: product || {
      category: "mattress",
      unitCost: 0,
      sellingPrice: 0,
      minStockLevel: 10,
      maxStockLevel: 100,
      isActive: true,
    },
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thicknessOptions] = useState([16, 18, 20, 22, 24]);
  const [densityOptions] = useState([16, 18, 25, 30, 35, 40]);

  const category = watch("category");

  useEffect(() => {
    fetchSuppliers();
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("/api/suppliers");
      setSuppliers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const url = product ? `/api/products/${product._id}` : "/api/products";
      const method = product ? "put" : "post";

      const response = await axios[method](url, data);

      toast.success(
        product
          ? "Product updated successfully"
          : "Product created successfully"
      );

      if (onSuccess) {
        onSuccess(response.data.data);
      }

      if (!product) {
        reset();
      }
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const calculateProfitMargin = () => {
    const unitCost = parseFloat(watch("unitCost")) || 0;
    const sellingPrice = parseFloat(watch("sellingPrice")) || 0;

    if (unitCost > 0 && sellingPrice > 0) {
      return (((sellingPrice - unitCost) / unitCost) * 100).toFixed(2);
    }
    return 0;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name *
          </label>
          <input
            type="text"
            {...register("name", { required: "Product name is required" })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            {...register("category", { required: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="mattress">Mattress</option>
            <option value="pillow">Pillow</option>
            <option value="foot_mat">Foot Mat</option>
            <option value="bedsheet">Bedsheet</option>
            <option value="others">Others</option>
          </select>
        </div>

        {category === "mattress" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thickness (inches) *
              </label>
              <select
                {...register("dimensions.thickness", {
                  required: category === "mattress",
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select thickness</option>
                {thicknessOptions.map((thickness) => (
                  <option key={thickness} value={thickness}>
                    {thickness} inches
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Density *
              </label>
              <select
                {...register("dimensions.density", {
                  required: category === "mattress",
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select density</option>
                {densityOptions.map((density) => (
                  <option key={density} value={density}>
                    {density} density
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Supplier *
          </label>
          <select
            {...register("supplier", { required: "Supplier is required" })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name} ({supplier.company})
              </option>
            ))}
          </select>
          {errors.supplier && (
            <p className="mt-1 text-sm text-red-600">
              {errors.supplier.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit Cost (₦) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("unitCost", {
              required: "Unit cost is required",
              min: { value: 0, message: "Must be positive" },
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.unitCost && (
            <p className="mt-1 text-sm text-red-600">
              {errors.unitCost.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Selling Price (₦) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("sellingPrice", {
              required: "Selling price is required",
              min: { value: 0, message: "Must be positive" },
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.sellingPrice && (
            <p className="mt-1 text-sm text-red-600">
              {errors.sellingPrice.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Profit Margin
            </span>
            <span className="text-lg font-semibold text-green-600">
              {calculateProfitMargin()}%
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Minimum Stock Level
          </label>
          <input
            type="number"
            {...register("minStockLevel", { min: 0 })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Maximum Stock Level
          </label>
          <input
            type="number"
            {...register("maxStockLevel", { min: 0 })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={3}
            {...register("description")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            {...register("tags")}
            placeholder="premium, foam, luxury"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Active Product</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
