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
      {items.slice(0, 5).map((item, index) => {
        const isOutOfStock = item.availableStock <= 0;
        const isLowStock =
          item.availableStock > 0 && item.availableStock <= item.reorderPoint;

        return (
          <div
            key={item._id || index}
            className={`flex items-center justify-between p-4 border rounded-lg hover:shadow-sm cursor-pointer transition-all ${
              isOutOfStock
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
            }`}
            onClick={() =>
              router.push(`/inventory/stock?product=${item.product?._id}`)
            }
          >
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon
                className={`h-5 w-5 ${
                  isOutOfStock ? "text-red-500" : "text-yellow-500"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.product?.name || "Product"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {/* SKU: {item.product?.sku} */}
                  {item.product?.dimensions?.thickness
                    ? `${item.product?.dimensions?.thickness}Inches `
                    : ""}
                  ({" "}
                  {item.product?.dimensions?.density
                    ? `${item.product?.dimensions?.density}Density  `
                    : ""}
                  )
                  {item.product?.dimensions?.width &&
                  item.product?.dimensions?.length
                    ? `${item.product?.dimensions?.length}m * ${item.product?.dimension?.width}m`
                    : ""}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-bold ${
                  isOutOfStock
                    ? "text-red-600 dark:text-red-400"
                    : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {item.availableStock} {isOutOfStock ? "Out" : "Left"}
              </p>
              {isLowStock && item.reorderPoint && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Reorder at: {item.reorderPoint}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {items.length > 5 && (
        <button
          onClick={() => router.push("/inventory/analysis")}
          className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 py-2"
        >
          View all {items.length} stock alerts →
        </button>
      )}
    </div>
  );
};

export default LowStockAlert;

// "use client";

// import { useRouter } from "next/navigation";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// const LowStockAlert = ({ items }) => {
//   const router = useRouter();

//   if (!items || items.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500 dark:text-gray-400">
//           All products are well stocked
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {items.map((item, index) => (
//         <div
//           key={index}
//           className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer transition-colors"
//           onClick={() => router.push("/inventory/stock")}
//         >
//           <div className="flex items-center space-x-3">
//             <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
//             <div>
//               <p className="text-sm font-medium text-gray-900 dark:text-white">
//                 {item.product?.name || "Product"}
//               </p>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 SKU: {item.product?.sku}
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-sm font-bold text-red-600 dark:text-red-400">
//               {item.availableStock} left
//             </p>
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               {item.status}
//             </p>
//           </div>
//         </div>
//       ))}

//       {items.length > 3 && (
//         <button
//           onClick={() => router.push("/inventory/stock")}
//           className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 py-2"
//         >
//           View all {items.length} low stock items
//         </button>
//       )}
//     </div>
//   );
// };

// export default LowStockAlert;
