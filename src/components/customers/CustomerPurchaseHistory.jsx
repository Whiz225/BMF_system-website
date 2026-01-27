"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Printer } from "lucide-react";

export default function CustomerPurchaseHistory({ customerId, purchases }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusColor = (status) => {
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
  };

  const totalPages = Math.ceil(purchases.length / itemsPerPage);
  const paginatedPurchases = purchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (purchases.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No purchase history</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          This customer hasn't made any purchases yet
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Sale #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedPurchases.map((sale) => (
              <tr
                key={sale._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {sale.saleNumber}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {format(new Date(sale.createdAt), "MMM dd, yyyy")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(sale.createdAt), "HH:mm")}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ₦{sale.totalAmount?.toLocaleString()}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      sale.status
                    )}`}
                  >
                    {sale.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/sales/${sale._id}`)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="View Sale"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        const printWindow = window.open("", "_blank");
                        printWindow.document.write(`
                          <h3>Sale Receipt</h3>
                          <p>Sale #: ${sale.saleNumber}</p>
                          <p>Amount: ₦${sale.totalAmount?.toLocaleString()}</p>
                          <script>window.print();</script>
                        `);
                        printWindow.document.close();
                      }}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      title="Print Receipt"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, purchases.length)} of{" "}
            {purchases.length} purchases
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
