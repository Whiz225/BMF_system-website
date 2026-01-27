"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { handlePrint } from "@/components/printer";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Printer,
  DollarSign,
  Calendar,
  User,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  Edit,
  RefreshCw,
  Download,
  Phone,
  Mail,
  MapPin,
  Plus,
  Minus,
  X,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSale,
  loadAllProducts,
  updateSales,
  updateSalesItems,
  updateSalesStatus,
} from "@/lib/actions";

// Memoized components
const SaleItemRow = React.memo(function SaleItemRow({
  item,
  showProfit,
  editingItems,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const handleDecrease = useCallback(() => {
    onUpdateQuantity(item.product._id, item.quantity - 1);
  }, [item.product._id, item.quantity, onUpdateQuantity]);

  const handleIncrease = useCallback(() => {
    onUpdateQuantity(item.product._id, item.quantity + 1);
  }, [item.product._id, item.quantity, onUpdateQuantity]);

  const handleRemove = useCallback(() => {
    onRemoveItem(item.product._id);
  }, [item.product._id, onRemoveItem]);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-4 py-4">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {item.product?.name || "Product"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SKU: {item.product?.sku || "N/A"}
          </p>
        </div>
      </td>
      <td className="px-4 py-4">
        {editingItems ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDecrease}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={handleRemove}
              className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-900 dark:text-white">
            {item.quantity}
          </p>
        )}
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-gray-900 dark:text-white">
          ₦{item.unitPrice?.toLocaleString()}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          ₦{item.totalPrice?.toLocaleString()}
        </p>
      </td>
      {showProfit && (
        <td className="px-4 py-4">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            ₦{item.profit?.toLocaleString()}
          </p>
        </td>
      )}
    </tr>
  );
});

const ProductItem = React.memo(function ProductItem({ product, onAdd }) {
  const handleAdd = useCallback(() => {
    onAdd(product);
  }, [product, onAdd]);

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {product.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Stock: {product.stock} | Price: ₦
          {product.sellingPrice?.toLocaleString()}
        </p>
      </div>
      <button
        onClick={handleAdd}
        className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
});

const PaymentSummary = React.memo(function PaymentSummary({
  sale,
  canEdit,
  onEditPayment,
  editingPayment,
  paymentData,
  onPaymentDataChange,
  onSavePayment,
  onCancelEditPayment,
  editing,
}) {
  const handleEditClick = useCallback(() => {
    onEditPayment();
  }, [onEditPayment]);

  const handleSaveClick = useCallback(() => {
    onSavePayment();
  }, [onSavePayment]);

  const handleCancelClick = useCallback(() => {
    onCancelEditPayment();
  }, [onCancelEditPayment]);

  const handleFieldChange = useCallback(
    (field, value) => {
      onPaymentDataChange(field, value);
    },
    [onPaymentDataChange]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
        <span className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Payment Summary
        </span>
        {canEdit && editing && !editingPayment && (
          <button
            onClick={handleEditClick}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </button>
        )}
      </h3>

      {editingPayment ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount
            </label>
            <input
              type="number"
              min="0"
              max={sale.subtotal}
              value={paymentData.discount}
              onChange={(e) =>
                handleFieldChange("discount", parseFloat(e.target.value) || 0)
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tax
            </label>
            <input
              type="number"
              min="0"
              value={paymentData.tax}
              onChange={(e) =>
                handleFieldChange("tax", parseFloat(e.target.value) || 0)
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount Paid
            </label>
            <input
              type="number"
              min="0"
              value={paymentData.amountPaid}
              onChange={(e) =>
                handleFieldChange("amountPaid", parseFloat(e.target.value) || 0)
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <select
              value={paymentData.paymentMethod}
              onChange={(e) =>
                handleFieldChange("paymentMethod", e.target.value)
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Transfer</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={paymentData.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              rows="3"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleCancelClick}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Subtotal
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              ₦{sale.subtotal?.toLocaleString()}
            </span>
          </div>

          {sale.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Discount
              </span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                -₦{sale.discount?.toLocaleString()}
              </span>
            </div>
          )}

          {sale.tax > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tax
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                +₦{sale.tax?.toLocaleString()}
              </span>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                Total Amount
              </span>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                ₦{sale.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Amount Paid
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              ₦{sale.amountPaid?.toLocaleString()}
            </span>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Balance
              </span>
              <span
                className={`text-sm font-bold ${
                  sale.balance > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                ₦{sale.balance?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const saleId = params.id;
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const { user } = useAuth();
  const [editingPayment, setEditingPayment] = useState(false);
  const [editingItems, setEditingItems] = useState(false);
  const [paymentData, setPaymentData] = useState({
    discount: 0,
    tax: 0,
    amountPaid: 0,
    paymentMethod: "cash",
    notes: "",
  });
  const [saleItems, setSaleItems] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [productsSearch, setProductsSearch] = useState("");

  // Memoized handlers
  const fetchSaleDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSale(saleId);
      const saleData = response;
      setSale(saleData);
      setStatus(saleData.status);
      setPaymentStatus(saleData.balance > 0 ? "partial" : "full");

      // Set editable data
      setPaymentData({
        discount: saleData.discount || 0,
        tax: saleData.tax || 0,
        amountPaid: saleData.amountPaid || 0,
        paymentMethod: saleData.paymentMethod || "cash",
        notes: saleData.notes || "",
      });

      setSaleItems(saleData.items || []);

      // Fetch available products for editing
      const productsRes = await loadAllProducts(true);
      setAvailableProducts(productsRes || []);
    } catch (error) {
      console.error("Failed to fetch sale details:", error);
      toast.error("Failed to load sale details");
    } finally {
      setLoading(false);
    }
  }, [saleId]);

  useEffect(() => {
    if (saleId) {
      fetchSaleDetails();
    }
  }, [saleId, fetchSaleDetails]);

  const updatePaymentDetails = useCallback(async () => {
    try {
      const subtotal = saleItems.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      );
      const totalAmount =
        subtotal - (paymentData.discount || 0) + (paymentData.tax || 0);
      const balance = totalAmount - (paymentData.amountPaid || 0);

      const updateData = {
        discount: paymentData.discount,
        tax: paymentData.tax,
        amountPaid: paymentData.amountPaid,
        totalAmount: totalAmount,
        balance: balance,
        paymentMethod: paymentData.paymentMethod,
        notes: paymentData.notes,
        status: balance <= 0 ? "completed" : "pending",
      };

      await updateSales(saleId, updateData);
      await fetchSaleDetails();
      setEditingPayment(false);
      toast.success("Payment details updated successfully");
    } catch (error) {
      console.error("Failed to update payment:", error);
      toast.error("Failed to update payment details");
    }
  }, [saleId, paymentData, saleItems, fetchSaleDetails]);

  const handleUpdateSaleStatus = useCallback(
    async (newStatus) => {
      try {
        await updateSalesStatus(saleId, { status: newStatus });
        setStatus(newStatus);
        toast.success(`Sale status updated to ${newStatus}`);
      } catch (error) {
        console.error("Failed to update sale:", error);
        toast.error("Failed to update sale status");
      }
    },
    [saleId]
  );

  const addItemToSale = useCallback(
    (product) => {
      const existingItem = saleItems.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        setSaleItems(
          saleItems.map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  totalPrice: item.unitPrice * (item.quantity + 1),
                }
              : item
          )
        );
      } else {
        setSaleItems([
          ...saleItems,
          {
            product,
            quantity: 1,
            unitPrice: product.sellingPrice,
            totalPrice: product.sellingPrice,
          },
        ]);
      }
      toast.success(`${product.name} added to sale`);
    },
    [saleItems]
  );

  const updateItemQuantity = useCallback(
    (productId, newQuantity) => {
      if (newQuantity < 1) {
        setSaleItems(
          saleItems.filter((item) => item.product._id !== productId)
        );
        toast.success("Item removed from sale");
        return;
      }

      setSaleItems(
        saleItems.map((item) =>
          item.product._id === productId
            ? {
                ...item,
                quantity: newQuantity,
                totalPrice: item.unitPrice * newQuantity,
              }
            : item
        )
      );
    },
    [saleItems]
  );

  const removeItem = useCallback(
    (productId) => {
      setSaleItems(saleItems.filter((item) => item.product._id !== productId));
      toast.success("Item removed from sale");
    },
    [saleItems]
  );

  const saveItems = useCallback(async () => {
    try {
      const itemsToUpdate = saleItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      await updateSalesItems(saleId, { items: itemsToUpdate });
      await fetchSaleDetails();
      setEditingItems(false);
      toast.success("Sale items updated successfully");
    } catch (error) {
      console.error("Failed to update items:", error);
      toast.error("Failed to update sale items");
    }
  }, [saleId, saleItems, fetchSaleDetails]);

  const printReceipt = useCallback((sale) => {
    handlePrint(sale);
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }, []);

  const getPaymentColor = useCallback((balance) => {
    return balance > 0
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  }, []);

  const handleEditPayment = useCallback(() => {
    setEditingPayment(true);
  }, []);

  const handleCancelEditPayment = useCallback(() => {
    setEditingPayment(false);
    setPaymentData({
      discount: sale?.discount || 0,
      tax: sale?.tax || 0,
      amountPaid: sale?.amountPaid || 0,
      paymentMethod: sale?.paymentMethod || "cash",
      notes: sale?.notes || "",
    });
  }, [sale]);

  const handlePaymentDataChange = useCallback((field, value) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleToggleEditItems = useCallback(() => {
    if (editingItems) {
      setSaleItems(sale?.items || []);
    }
    setEditingItems(!editingItems);
  }, [editingItems, sale?.items]);

  const handleCancelEditItems = useCallback(() => {
    setEditingItems(false);
    setSaleItems(sale?.items || []);
  }, [sale?.items]);

  const handleStatusChange = useCallback(
    (e) => {
      handleUpdateSaleStatus(e.target.value);
    },
    [handleUpdateSaleStatus]
  );

  const handleProductsSearchChange = useCallback((e) => {
    setProductsSearch(e.target.value);
  }, []);

  // Memoized computed values
  const filteredProducts = useMemo(() => {
    if (!productsSearch) return availableProducts;
    return availableProducts.filter(
      (product) =>
        product.name?.toLowerCase().includes(productsSearch.toLowerCase()) ||
        product.sku?.toLowerCase().includes(productsSearch.toLowerCase())
    );
  }, [availableProducts, productsSearch]);

  const currentItems = useMemo(() => {
    return editingItems ? saleItems : sale?.items || [];
  }, [editingItems, saleItems, sale?.items]);

  const showProfit = useMemo(() => {
    return user?.permissions?.view_profits;
  }, [user?.permissions?.view_profits]);

  const canManageSales = useMemo(() => {
    return user?.permissions?.manage_sales;
  }, [user?.permissions?.manage_sales]);

  const customerInfo = useMemo(() => {
    if (!sale?.customer) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <User className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {sale.customer.name}
            </p>
          </div>
        </div>

        {sale.customer.phone && (
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {sale.customer.phone}
              </p>
            </div>
          </div>
        )}

        {sale.customer.email && (
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {sale.customer.email}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => router.push(`/customers/${sale.customer._id}`)}
          className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          View Customer Details →
        </button>
      </div>
    );
  }, [sale?.customer, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sale Not Found
          </h2>
          <button
            onClick={() => router.push("/sales")}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Return to Sales
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
            onClick={() => router.push("/sales")}
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              #{sale.saleNumber.slice(0, 15)}...
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {format(new Date(sale.createdAt), "PPP 'at' p")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Print
          </button>

          <button
            onClick={() => printReceipt(sale)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Receipt
          </button>

          {canManageSales && (
            <button
              onClick={() => setEditing(!editing)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              {editing ? "Cancel Edit" : "Edit"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sale Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h3>

            {sale.customer ? (
              customerInfo
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">
                  Walk-in Customer
                </p>
              </div>
            )}
          </div>

          {/* Items List Card with Edit Functionality */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Items Sold ({currentItems.length})
              </h3>

              {editing && canManageSales && (
                <div className="flex space-x-2">
                  {!editingItems ? (
                    <button
                      onClick={handleToggleEditItems}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit Items
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEditItems}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveItems}
                        className="text-sm text-green-600 hover:text-green-800"
                      >
                        Save Items
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Products Search for Adding Items */}
            {editingItems && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Add Products
                </h4>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productsSearch}
                    onChange={handleProductsSearchChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto border rounded-lg">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductItem
                        key={product._id}
                        product={product}
                        onAdd={addItemToSale}
                      />
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No products found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Total
                    </th>
                    {showProfit && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Profit
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={showProfit ? 5 : 4}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No items in this sale
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item, index) => (
                      <SaleItemRow
                        key={`${item.product?._id || index}`}
                        item={item}
                        showProfit={showProfit}
                        editingItems={editingItems}
                        onUpdateQuantity={updateItemQuantity}
                        onRemoveItem={removeItem}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Payment & Status */}
        <div className="space-y-6">
          {/* Payment Summary Card */}
          <PaymentSummary
            sale={sale}
            canEdit={canManageSales}
            onEditPayment={handleEditPayment}
            editingPayment={editingPayment}
            paymentData={paymentData}
            onPaymentDataChange={handlePaymentDataChange}
            onSavePayment={updatePaymentDetails}
            onCancelEditPayment={handleCancelEditPayment}
            editing={editing}
          />

          {/* Status & Payment Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Status & Payment
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Sale Status
                </p>
                {editing ? (
                  <select
                    value={status}
                    onChange={handleStatusChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Payment Status
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentColor(
                    sale.balance
                  )}`}
                >
                  {sale.balance > 0 ? "Partially Paid" : "Fully Paid"}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Payment Method
                </p>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {sale.paymentMethod?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Sold By
                </p>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {sale.soldBy?.firstName} {sale.soldBy?.lastName}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {sale.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Notes
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {sale.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { handlePrint } from "@/components/printer";
// import toast from "react-hot-toast";
// import {
//   ArrowLeft,
//   Printer,
//   DollarSign,
//   Calendar,
//   User,
//   Package,
//   CreditCard,
//   CheckCircle,
//   XCircle,
//   Edit,
//   RefreshCw,
//   Download,
//   Phone,
//   Mail,
//   MapPin,
// } from "lucide-react";
// import { format } from "date-fns";
// import { useAuth } from "@/contexts/AuthContext";
// import {
//   getSale,
//   loadAllProducts,
//   updateSales,
//   updateSalesItems,
// } from "@/lib/actions";
// // } from "../../../lib/actions";

// export default function SaleDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const saleId = params.id;
//   const [sale, setSale] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [status, setStatus] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const { user } = useAuth();
//   const [editingPayment, setEditingPayment] = useState(false);
//   const [editingItems, setEditingItems] = useState(false);
//   const [paymentData, setPaymentData] = useState({});
//   const [saleItems, setSaleItems] = useState([]);
//   const [availableProducts, setAvailableProducts] = useState([]);

//   useEffect(() => {
//     if (saleId) {
//       fetchSaleDetails();
//     }
//   }, [saleId]);

//   const fetchSaleDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await getSale(saleId);
//       // const response = await axios.get(`/sales/${saleId}`);
//       console.log("response", response);
//       const saleData = response;
//       setSale(saleData);
//       setStatus(saleData.status);
//       setPaymentStatus(saleData.balance > 0 ? "partial" : "full");

//       // Set editable data
//       setPaymentData({
//         discount: saleData.discount || 0,
//         tax: saleData.tax || 0,
//         amountPaid: saleData.amountPaid || 0,
//         paymentMethod: saleData.paymentMethod || "cash",
//         notes: saleData.notes || "",
//       });

//       setSaleItems(saleData.items || []);

//       // Fetch available products for editing
//       const productsRes = await loadAllProducts(true);
//       // const productsRes = await axios.get("/products?isActive=true");
//       setAvailableProducts(productsRes || []);
//     } catch (error) {
//       console.error("Failed to fetch sale details:", error);
//       toast.error("Failed to load sale details");
//       //   router.push("/sales");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add function to update payment details
//   const updatePaymentDetails = async () => {
//     try {
//       const subtotal = saleItems.reduce(
//         (sum, item) => sum + (item.totalPrice || 0),
//         0
//       );
//       const totalAmount =
//         subtotal - (paymentData.discount || 0) + (paymentData.tax || 0);
//       const balance = totalAmount - (paymentData.amountPaid || 0);

//       const updateData = {
//         discount: paymentData.discount,
//         tax: paymentData.tax,
//         amountPaid: paymentData.amountPaid,
//         totalAmount: totalAmount,
//         balance: balance,
//         paymentMethod: paymentData.paymentMethod,
//         notes: paymentData.notes,
//         status: balance <= 0 ? "completed" : "pending",
//       };

//       await updateSales(saleId, updateData);
//       // await axios.put(`/sales/${saleId}`, updateData);

//       // Refresh sale data
//       fetchSaleDetails();
//       setEditingPayment(false);
//       toast.success("Payment details updated successfully");
//     } catch (error) {
//       console.error("Failed to update payment:", error);
//       toast.error("Failed to update payment details");
//     }
//   };

//   const updateSaleStatus = async (newStatus) => {
//     try {
//       await updateSaleStatus(saleId, { status: newStatus });
//       // await axios.patch(`/sales/${saleId}/status`, { status: newStatus });
//       setStatus(newStatus);
//       toast.success(`Sale status updated to ${newStatus}`);
//     } catch (error) {
//       console.error("Failed to update sale:", error);
//       toast.error("Failed to update sale status");
//     }
//   };

//   // Add function to add item to sale
//   const addItemToSale = (product) => {
//     const existingItem = saleItems.find(
//       (item) => item.product._id === product._id
//     );

//     if (existingItem) {
//       setSaleItems(
//         saleItems.map((item) =>
//           item.product._id === product._id
//             ? {
//                 ...item,
//                 quantity: item.quantity + 1,
//                 totalPrice: item.unitPrice * (item.quantity + 1),
//               }
//             : item
//         )
//       );
//     } else {
//       setSaleItems([
//         ...saleItems,
//         {
//           product,
//           quantity: 1,

//           unitPrice: product.sellingPrice,
//           totalPrice: product.sellingPrice,
//         },
//       ]);
//     }
//     toast.success(`${product.name} added to sale`);
//   };

//   // Add function to update item quantity
//   const updateItemQuantity = (productId, newQuantity) => {
//     if (newQuantity < 1) {
//       setSaleItems(saleItems.filter((item) => item.product._id !== productId));
//       toast.success("Item removed from sale");
//       return;
//     }

//     setSaleItems(
//       saleItems.map((item) =>
//         item.product._id === productId
//           ? {
//               ...item,
//               quantity: newQuantity,
//               totalPrice: item.unitPrice * newQuantity,
//             }
//           : item
//       )
//     );
//   };

//   // Add function to remove item
//   const removeItem = (productId) => {
//     setSaleItems(saleItems.filter((item) => item.product._id !== productId));
//     toast.success("Item removed from sale");
//   };

//   // Add function to save items
//   const saveItems = async () => {
//     try {
//       const itemsToUpdate = saleItems.map((item) => ({
//         product: item.product._id,
//         quantity: item.quantity,
//         unitPrice: item.unitPrice,
//       }));

//       await updateSalesItems(saleId, { items: itemsToUpdate });
//       // await axios.put(`/sales/${saleId}/items`, { items: itemsToUpdate });

//       fetchSaleDetails();
//       setEditingItems(false);
//       toast.success("Sale items updated successfully");
//     } catch (error) {
//       console.error("Failed to update items:", error);
//       toast.error("Failed to update sale items");
//     }
//   };

//   const printReceipt = (sale) => {
//     handlePrint(sale);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
//       case "cancelled":
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
//     }
//   };

//   const getPaymentColor = (balance) => {
//     return balance > 0
//       ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
//       : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!sale) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//             Sale Not Found
//           </h2>
//           <button
//             onClick={() => router.push("/sales")}
//             className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
//           >
//             Return to Sales
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <div className="flex items-center">
//           <button
//             onClick={() => router.push("/sales")}
//             className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//           >
//             <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//           </button>
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
//               #{sale.saleNumber.slice(0, 15)}...
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-1">
//               {format(new Date(sale.createdAt), "PPP 'at' p")}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-3">
//           <button
//             onClick={() => window.print()}
//             className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Print
//           </button>

//           <button
//             onClick={() => printReceipt(sale)}
//             className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//           >
//             <Printer className="h-4 w-4 mr-2" />
//             Receipt
//           </button>

//           {user?.permissions?.manage_sales && (
//             <button
//               onClick={() => setEditing(!editing)}
//               className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
//             >
//               <Edit className="h-4 w-4 mr-2" />
//               {editing ? "Cancel Edit" : "Edit"}
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Sale Details */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Customer Info Card */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
//               <User className="h-5 w-5 mr-2" />
//               Customer Information
//             </h3>

//             {sale.customer ? (
//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <User className="h-5 w-5 text-gray-400 mr-3" />
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Name
//                     </p>
//                     <p className="text-sm font-medium text-gray-900 dark:text-white">
//                       {sale.customer.name}
//                     </p>
//                   </div>
//                 </div>

//                 {sale.customer.phone && (
//                   <div className="flex items-center">
//                     <Phone className="h-5 w-5 text-gray-400 mr-3" />
//                     <div>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Phone
//                       </p>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         {sale.customer.phone}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {sale.customer.email && (
//                   <div className="flex items-center">
//                     <Mail className="h-5 w-5 text-gray-400 mr-3" />
//                     <div>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Email
//                       </p>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         {sale.customer.email}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 <button
//                   onClick={() => router.push(`/customers/${sale.customer._id}`)}
//                   className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
//                 >
//                   View Customer Details →
//                 </button>
//               </div>
//             ) : (
//               <div className="text-center py-4">
//                 <p className="text-gray-500 dark:text-gray-400">
//                   Walk-in Customer
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Items List Card */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
//               <Package className="h-5 w-5 mr-2" />
//               Items Sold ({sale.items.length})
//             </h3>

//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
//                       Product
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
//                       Qty
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
//                       Price
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
//                       Total
//                     </th>
//                     {user?.permissions?.view_profits && (
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
//                         Profit
//                       </th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {sale.items.map((item, index) => (
//                     <tr
//                       key={index}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
//                     >
//                       <td className="px-4 py-4">
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 dark:text-white">
//                             {item.product?.name || "Product"}
//                           </p>
//                           <p className="text-xs text-gray-500 dark:text-gray-400">
//                             SKU: {item.product?.sku || "N/A"}
//                           </p>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4">
//                         <p className="text-sm text-gray-900 dark:text-white">
//                           {item.quantity}
//                         </p>
//                       </td>
//                       <td className="px-4 py-4">
//                         <p className="text-sm text-gray-900 dark:text-white">
//                           ₦{item.unitPrice?.toLocaleString()}
//                         </p>
//                       </td>
//                       <td className="px-4 py-4">
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">
//                           ₦{item.totalPrice?.toLocaleString()}
//                         </p>
//                       </td>
//                       {user?.permissions?.view_profits && (
//                         <td className="px-4 py-4">
//                           <p className="text-sm font-medium text-green-600 dark:text-green-400">
//                             ₦{item.profit?.toLocaleString()}
//                           </p>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Payment & Status */}
//         <div className="space-y-6">
//           {/* Payment Summary Card */}
//           {/* Payment Summary Card - Editable Version */}
//           {editingPayment ? (
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
//                 <span>Edit Payment Details</span>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => {
//                       setEditingPayment(false);
//                       setPaymentData({
//                         discount: sale.discount || 0,
//                         tax: sale.tax || 0,
//                         amountPaid: sale.amountPaid || 0,
//                         paymentMethod: sale.paymentMethod || "cash",
//                         notes: sale.notes || "",
//                       });
//                     }}
//                     className="text-sm text-gray-600 hover:text-gray-900"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={updatePaymentDetails}
//                     className="text-sm text-green-600 hover:text-green-800"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </h3>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Discount
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     max={sale.subtotal}
//                     value={paymentData.discount}
//                     onChange={(e) =>
//                       setPaymentData({
//                         ...paymentData,
//                         discount: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                     className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Tax
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     value={paymentData.tax}
//                     onChange={(e) =>
//                       setPaymentData({
//                         ...paymentData,
//                         tax: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                     className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Amount Paid
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     value={paymentData.amountPaid}
//                     onChange={(e) =>
//                       setPaymentData({
//                         ...paymentData,
//                         amountPaid: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                     className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Payment Method
//                   </label>
//                   <select
//                     value={paymentData.paymentMethod}
//                     onChange={(e) =>
//                       setPaymentData({
//                         ...paymentData,
//                         paymentMethod: e.target.value,
//                       })
//                     }
//                     className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   >
//                     <option value="cash">Cash</option>
//                     <option value="card">Card</option>
//                     <option value="transfer">Transfer</option>
//                     <option value="credit">Credit</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Notes
//                   </label>
//                   <textarea
//                     value={paymentData.notes}
//                     onChange={(e) =>
//                       setPaymentData({ ...paymentData, notes: e.target.value })
//                     }
//                     rows="3"
//                     className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
//                 <span className="flex items-center">
//                   <DollarSign className="h-5 w-5 mr-2" />
//                   Payment Summary
//                 </span>
//                 {user?.permissions?.manage_sales && (
//                   <button
//                     onClick={() => setEditingPayment(true)}
//                     className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
//                   >
//                     Edit
//                   </button>
//                 )}
//               </h3>
//               {/* ... rest of payment summary display */}
//               <div className="space-y-4">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     Subtotal
//                   </span>
//                   <span className="text-sm font-medium text-gray-900 dark:text-white">
//                     ₦{sale.subtotal?.toLocaleString()}
//                   </span>
//                 </div>

//                 {sale.discount > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       Discount
//                     </span>
//                     <span className="text-sm font-medium text-red-600 dark:text-red-400">
//                       -₦{sale.discount?.toLocaleString()}
//                     </span>
//                   </div>
//                 )}

//                 {sale.tax > 0 && (
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       Tax
//                     </span>
//                     <span className="text-sm font-medium text-gray-900 dark:text-white">
//                       +₦{sale.tax?.toLocaleString()}
//                     </span>
//                   </div>
//                 )}

//                 <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex justify-between">
//                     <span className="text-base font-semibold text-gray-900 dark:text-white">
//                       Total Amount
//                     </span>
//                     <span className="text-base font-bold text-gray-900 dark:text-white">
//                       ₦{sale.totalAmount?.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     Amount Paid
//                   </span>
//                   <span className="text-sm font-medium text-gray-900 dark:text-white">
//                     ₦{sale.amountPaid?.toLocaleString()}
//                   </span>
//                 </div>

//                 <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex justify-between">
//                     <span className="text-sm font-semibold text-gray-900 dark:text-white">
//                       Balance
//                     </span>
//                     <span
//                       className={`text-sm font-bold ${
//                         sale.balance > 0
//                           ? "text-red-600 dark:text-red-400"
//                           : "text-green-600 dark:text-green-400"
//                       }`}
//                     >
//                       ₦{sale.balance?.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             //   </div>
//           )}

//           {/* Status & Payment Card */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//               Status & Payment
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//                   Sale Status
//                 </p>
//                 {editing ? (
//                   <select
//                     value={status}
//                     onChange={(e) => updateSaleStatus(e.target.value)}
//                     className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                     <option value="refunded">Refunded</option>
//                   </select>
//                 ) : (
//                   <span
//                     className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                       status
//                     )}`}
//                   >
//                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                   </span>
//                 )}
//               </div>

//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//                   Payment Status
//                 </p>
//                 <span
//                   className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentColor(
//                     sale.balance
//                   )}`}
//                 >
//                   {sale.balance > 0 ? "Partially Paid" : "Fully Paid"}
//                 </span>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//                   Payment Method
//                 </p>
//                 <div className="flex items-center">
//                   <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
//                   <span className="text-sm text-gray-900 dark:text-white">
//                     {sale.paymentMethod?.toUpperCase()}
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//                   Sold By
//                 </p>
//                 <div className="flex items-center">
//                   <User className="h-5 w-5 text-gray-400 mr-2" />
//                   <span className="text-sm text-gray-900 dark:text-white">
//                     {sale.soldBy?.firstName} {sale.soldBy?.lastName}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Notes */}
//             {sale.notes && (
//               <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//                   Notes
//                 </p>
//                 <p className="text-sm text-gray-900 dark:text-white">
//                   {sale.notes}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // const printWindow = window.open("", "_blank");
// //     printWindow.document.write(`
// //       <!DOCTYPE html>
// //       <html>
// //       <head>
// //         <title>Receipt - ${sale?.saleNumber}</title>
// //         <style>
// //           body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
// //           .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
// //           .business-info { margin-bottom: 15px; }
// //           .sale-info { margin-bottom: 15px; }
// //           .customer-info { margin-bottom: 15px; }
// //           table { width: 100%; border-collapse: collapse; margin: 20px 0; }
// //           th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
// //           .totals { margin-top: 20px; padding-top: 10px; border-top: 2px dashed #000; }
// //           .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
// //           .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
// //           @media print { body { padding: 0; } }
// //         </style>
// //       </head>
// //       <body>
// //         <div class="header">
// //           <h2>${
// //             localStorage.getItem("businessName") || "Foam Business Manager"
// //           }</h2>
// //           <p>Sales Receipt</p>
// //         </div>

// //         <div class="business-info">
// //           <p><strong>Business Address:</strong> Your Business Address Here</p>
// //           <p><strong>Phone:</strong> ${
// //             localStorage.getItem("businessPhone") || "N/A"
// //           }</p>
// //         </div>

// //         <div class="sale-info">
// //           <p><strong>Receipt #:</strong> ${sale?.saleNumber}</p>
// //           <p><strong>Date:</strong> ${format(
// //             new Date(sale?.createdAt),
// //             "PPP p"
// //           )}</p>
// //           <p><strong>Sold by:</strong> ${sale?.soldBy?.firstName} ${
// //       sale?.soldBy?.lastName
// //     }</p>
// //         </div>

// //         ${
// //           sale?.customer
// //             ? `
// //         <div class="customer-info">
// //           <p><strong>Customer:</strong> ${sale.customer.name}</p>
// //           ${
// //             sale.customer.phone
// //               ? `<p><strong>Phone:</strong> ${sale.customer.phone}</p>`
// //               : ""
// //           }
// //         </div>
// //         `
// //             : ""
// //         }

// //         <table>
// //           <thead>
// //             <tr>
// //               <th>Item</th>
// //               <th>Qty</th>
// //               <th>Price</th>
// //               <th>Total</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             ${sale?.items
// //               ?.map(
// //                 (item) => `
// //               <tr>
// //                 <td>${item.product?.name || "Product"}</td>
// //                 <td>${item.quantity}</td>
// //                 <td>₦${item.unitPrice?.toLocaleString()}</td>
// //                 <td>₦${item.totalPrice?.toLocaleString()}</td>
// //               </tr>
// //             `
// //               )
// //               .join("")}
// //           </tbody>
// //         </table>

// //         <div class="totals">
// //           <div class="total-row">
// //             <span>Subtotal:</span>
// //             <span>₦${sale?.subtotal?.toLocaleString()}</span>
// //           </div>
// //           ${
// //             sale?.discount > 0
// //               ? `
// //           <div class="total-row">
// //             <span>Discount:</span>
// //             <span>-₦${sale?.discount?.toLocaleString()}</span>
// //           </div>
// //           `
// //               : ""
// //           }
// //           ${
// //             sale?.tax > 0
// //               ? `
// //           <div class="total-row">
// //             <span>Tax:</span>
// //             <span>+₦${sale?.tax?.toLocaleString()}</span>
// //           </div>
// //           `
// //               : ""
// //           }
// //           <div class="total-row" style="font-weight: bold; font-size: 1.1em;">
// //             <span>Total:</span>
// //             <span>₦${sale?.totalAmount?.toLocaleString()}</span>
// //           </div>
// //           <div class="total-row">
// //             <span>Amount Paid:</span>
// //             <span>₦${sale?.amountPaid?.toLocaleString()}</span>
// //           </div>
// //           <div class="total-row">
// //             <span>Balance:</span>
// //             <span>₦${sale?.balance?.toLocaleString()}</span>
// //           </div>
// //           <div class="total-row">
// //             <span>Payment Method:</span>
// //             <span>${sale?.paymentMethod?.toUpperCase()}</span>
// //           </div>
// //         </div>

// //         <div class="footer">
// //           <p>Thank you for your business!</p>
// //           <p>Generated on ${format(new Date(), "PPP p")}</p>
// //         </div>
// //         <script>
// //           window.onload = function() {
// //             window.print();
// //             setTimeout(() => window.close(), 1000);
// //           }
// //         </script>
// //       </body>
// //       </html>
// //     `);
// //     printWindow.document.close();
