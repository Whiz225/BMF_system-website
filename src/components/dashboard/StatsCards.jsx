"use client";

import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CubeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      name: "Total Revenue",
      value: `₦${stats?.sales?.revenue?.toLocaleString() || "0"}`,
      icon: CurrencyDollarIcon,
      change: "+12%",
      trend: "up",
      color: "bg-blue-500",
    },
    {
      name: "Total Sales",
      value: stats?.sales?.total?.toLocaleString() || "0",
      icon: ShoppingCartIcon,
      change: "+8%",
      trend: "up",
      color: "bg-green-500",
    },
    {
      name: "Total Customers",
      value: stats?.customers?.total?.toLocaleString() || "0",
      icon: UserGroupIcon,
      change: "+5%",
      trend: "up",
      color: "bg-purple-500",
    },
    {
      name: "Low Stock Items",
      value: stats?.inventory?.lowStock?.toLocaleString() || "0",
      icon: CubeIcon,
      change: "-2%",
      trend: "down",
      color: "bg-yellow-500",
    },
  ];

  if (stats?.sales?.profit !== undefined) {
    cards.push({
      name: "Total Profit",
      value: `₦${stats.sales.profit.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      change: "+15%",
      trend: "up",
      color: "bg-emerald-500",
    });
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
        >
          <dt>
            <div className={`absolute rounded-md p-3 ${card.color}`}>
              <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {card.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                card.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {card.trend === "up" ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              <span className="ml-1">{card.change}</span>
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
