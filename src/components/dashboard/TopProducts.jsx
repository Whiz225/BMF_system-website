"use client";

const TopProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No product data available
        </p>
      </div>
    );
  }

  // Calculate total quantity for percentage
  const totalQuantity = products.reduce(
    (sum, product) => sum + product.totalQuantity,
    0
  );

  return (
    <div className="space-y-4">
      {products.slice(0, 5).map((product, index) => {
        const percentage =
          totalQuantity > 0
            ? Math.round((product.totalQuantity / totalQuantity) * 100)
            : 0;

        return (
          <div key={product._id} className="space-y-2">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {product.name || "Unknown Product"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {product.sku || "N/A"} • {product.totalQuantity} sold
                </p>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ₦{product.totalRevenue?.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopProducts;
