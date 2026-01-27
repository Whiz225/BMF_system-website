"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function NewSalePage() {
  const { user } = useAuth();
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/customers");
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const addToCart = () => {
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    const existingItem = cart.find((item) => item.product._id === product._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product,
          quantity,
          unitPrice: product.sellingPrice,
          totalPrice: product.sellingPrice * quantity,
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(
      cart.map((item) =>
        item.product._id === productId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.unitPrice * newQuantity,
            }
          : item
      )
    );
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = parseFloat(watch("discount") || 0);
    const tax = parseFloat(watch("tax") || 0);
    const total = subtotal - discount + tax;
    const amountPaid = parseFloat(watch("amountPaid") || 0);
    const balance = total - amountPaid;

    return { subtotal, discount, tax, total, amountPaid, balance };
  };

  const onSubmit = async (data) => {
    if (cart.length === 0) {
      toast.error("Please add at least one product to the cart");
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        ...data,
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        subtotal: calculateTotals().subtotal,
        totalAmount: calculateTotals().total,
        amountPaid: parseFloat(data.amountPaid) || 0,
        soldBy: user._id,
      };

      const response = await axios.post("/api/sales", saleData);

      toast.success("Sale completed successfully!");

      // Reset form and cart
      reset();
      setCart([]);

      // Print receipt (optional)
      printReceipt(response.data.data);
    } catch (error) {
      console.error("Failed to create sale:", error);
      toast.error(error.response?.data?.message || "Failed to create sale");
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = (sale) => {
    // Implement receipt printing logic here
    console.log("Printing receipt:", sale);
    toast.success("Receipt printed successfully!");
  };

  const { subtotal, discount, tax, total, amountPaid, balance } =
    calculateTotals();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">New Sale</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Select Products
            </h2>

            <div className="flex space-x-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a product</option>
                  {products
                    .filter((p) => p.isActive)
                    .map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - ₦{product.sellingPrice} ({product.sku})
                      </option>
                    ))}
                </select>
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="self-end">
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={!selectedProduct}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cart Items
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No items in cart
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cart.map((item) => (
                        <tr key={item.product._id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.product.sku}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₦{item.unitPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.product._id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₦{item.totalPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Payment Details */}
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Payment Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer (Optional)
                </label>
                <select
                  {...register("customer")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Walk-in Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} ({customer.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  {...register("paymentMethod", { required: true })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="transfer">Transfer</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <div className="flex items-center space-x-2">
                    <span>₦</span>
                    <input
                      type="number"
                      min="0"
                      max={subtotal}
                      {...register("discount")}
                      className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Tax:</span>
                  <div className="flex items-center space-x-2">
                    <span>₦</span>
                    <input
                      type="number"
                      min="0"
                      {...register("tax")}
                      className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid
                </label>
                <input
                  type="number"
                  min="0"
                  max={total}
                  {...register("amountPaid", { required: true })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Balance:</span>
                  <span
                    className={balance > 0 ? "text-red-600" : "text-green-600"}
                  >
                    ₦{balance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Complete Sale"}
              </button>

              <button
                type="button"
                onClick={() => printReceipt()}
                disabled={cart.length === 0}
                className="w-full rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Print Receipt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
