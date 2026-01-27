"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  Minus,
  X,
  ShoppingCart,
  User,
  CreditCard,
  Calculator,
  Printer,
} from "lucide-react";
import { createSales, loadAllCustomers, loadAllProducts } from "@/lib/actions";
// import { createSales, loadAllCustomers, loadAllProducts } from "../../../lib/actions";

export default function NewSalePage() {
  const { user } = useAuth();
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await loadAllProducts(true);
      console.log("res-products", response);
      // const response = await axios.get("/api/products?isActive=true");
      setProducts(response || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await loadAllCustomers(true);
      console.log("res-customers", response);
      // const response = await axios.get("/api/customers?isActive=true");
      setCustomers(response || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const addToCart = () => {
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) {
      toast.error("Please select a product");
      return;
    }

    const existingItem = cart.find((item) => item.product._id === product._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product._id === product._id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: item.unitPrice * (item.quantity + quantity),
              }
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
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.product._id !== productId));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

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
        status: calculateTotals().balance <= 0 ? "completed" : "pending",
      };

      const response = await createSales(saleData);
      console.log("res-createSales", response);
      // const response = await axios.post("/api/sales", saleData);

      toast.success("Sale completed successfully!");

      // Print receipt
      // printReceipt(response);

      // Reset form and cart
      reset();
      setCart([]);

      // Redirect to sales page after 2 seconds
      setTimeout(() => {
        window.location.href = "/sales";
      }, 2000);
    } catch (error) {
      console.error("Failed to create sale:", error);
      toast.error(error.response?.data?.message || "Failed to create sale");
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = (sale) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${sale.saleNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .info { margin-bottom: 15px; }
          .items { margin: 20px 0; }
          .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .total { border-top: 2px dashed #000; padding-top: 10px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Foam Business Manager</h2>
          <p>Sales Receipt</p>
        </div>
        <div class="info">
          <p><strong>Sale #:</strong> ${sale.saleNumber}</p>
          <p><strong>Date:</strong> ${new Date(
            sale.createdAt
          ).toLocaleString()}</p>
          <p><strong>Sold by:</strong> ${
            sale.soldBy?.firstName || user?.firstName
          }</p>
        </div>
        <div class="items">
          ${sale.items
            ?.map(
              (item) => `
            <div class="item-row">
              <span>${item.product?.name || "Product"} x ${item.quantity}</span>
              <span>₦${item.totalPrice?.toLocaleString()}</span>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="total">
          <div class="item-row"><span>Subtotal:</span><span>₦${sale.subtotal?.toLocaleString()}</span></div>
          <div class="item-row"><span>Discount:</span><span>₦${sale.discount?.toLocaleString()}</span></div>
          <div class="item-row"><span>Tax:</span><span>₦${sale.tax?.toLocaleString()}</span></div>
          <div class="item-row" style="font-weight: bold; font-size: 1.1em;"><span>TOTAL:</span><span>₦${sale.totalAmount?.toLocaleString()}</span></div>
          <div class="item-row"><span>Paid:</span><span>₦${sale.amountPaid?.toLocaleString()}</span></div>
          <div class="item-row"><span>Balance:</span><span>₦${sale.balance?.toLocaleString()}</span></div>
          <div class="item-row"><span>Payment:</span><span>${sale.paymentMethod?.toUpperCase()}</span></div>
        </div>
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        <script>
          window.onload = function() { window.print(); setTimeout(() => window.close(), 1000); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const { subtotal, discount, tax, total, amountPaid, balance } =
    calculateTotals();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            New Sale
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create a new sales transaction
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => (window.location.href = "/sales")}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Selection Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Select Products
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {cart.length} item(s) in cart
              </span>
            </div>

            {/* Product Selection Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a product...</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} - ₦{product.sellingPrice} ({product.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="self-end">
                  <button
                    type="button"
                    onClick={addToCart}
                    disabled={!selectedProduct}
                    className="w-full h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Cart Items
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <ShoppingCart className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No items in cart
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Add products to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          SKU: {item.product.sku}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
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
                            className="w-12 text-center border-x border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ₦{item.totalPrice.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ₦{item.unitPrice.toLocaleString()} each
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product._id)}
                          className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Payment Details */}
        <div className="space-y-6">
          {/* Customer Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Customer (Optional)
                </label>
                <select
                  {...register("customer")}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Notes
                </label>
                <textarea
                  {...register("notes")}
                  rows="2"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any special notes..."
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center mb-4">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Details
            </h2>

            <div className="space-y-4">
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method *
                </label>
                <select
                  {...register("paymentMethod", { required: true })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="transfer">Transfer</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Discount:
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white">₦</span>
                    <input
                      type="number"
                      min="0"
                      max={subtotal}
                      {...register("discount")}
                      className="w-24 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-transparent text-gray-900 dark:text-white text-right"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white">₦</span>
                    <input
                      type="number"
                      min="0"
                      {...register("tax")}
                      className="w-24 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-transparent text-gray-900 dark:text-white text-right"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span>Total:</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Amount Paid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount Paid *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₦
                  </span>
                  <input
                    type="number"
                    min="0"
                    max={total}
                    step="0.01"
                    {...register("amountPaid", { required: true })}
                    className="w-full pl-8 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Balance */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-lg font-bold">
                  <span>Balance:</span>
                  <span
                    className={
                      balance > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }
                  >
                    ₦{balance.toLocaleString()}
                  </span>
                </div>
                {balance > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Customer owes ₦{balance.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  "Complete Sale"
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  printReceipt({
                    saleNumber: `SALE-${new Date().getTime()}`,
                    items: cart,
                    subtotal,
                    discount: parseFloat(watch("discount") || 0),
                    tax: parseFloat(watch("tax") || 0),
                    totalAmount: total,
                    amountPaid: parseFloat(watch("amountPaid") || 0),
                    balance,
                    paymentMethod: watch("paymentMethod") || "cash",
                    createdAt: new Date(),
                    soldBy: { firstName: user?.firstName },
                  })
                }
                disabled={cart.length === 0}
                className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Preview
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
