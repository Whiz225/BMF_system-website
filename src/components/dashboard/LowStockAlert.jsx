"use client";

import { useRouter } from "next/navigation";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const LowStockAlert = ({ items }) => {
  const router = useRouter();

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          All products are well stocked
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer transition-colors"
          onClick={() => router.push("/inventory/stock")}
        >
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {item.product?.name || "Product"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SKU: {item.product?.sku}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              {item.availableStock} left
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {item.status}
            </p>
          </div>
        </div>
      ))}

      {items.length > 3 && (
        <button
          onClick={() => router.push("/inventory/stock")}
          className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 py-2"
        >
          View all {items.length} low stock items
        </button>
      )}
    </div>
  );
};

export default LowStockAlert;
