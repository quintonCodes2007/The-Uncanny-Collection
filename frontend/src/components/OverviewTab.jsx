
/*
 * ============================================
 * THE UNCANNY COLLECTION — OVERVIEW TAB
 * ============================================
 *
 * Admin dashboard overview.
 *
 * Data sources:
 * - GET /analytics: users, products, sales,
 *   revenue, and daily revenue history.
 * - useProductStore: current stock levels.
 *
 * No hardcoded business statistics.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  ReceiptText,
  AlertTriangle,
  CalendarDays,
  TrendingUp,
  PackageX,
  Skull,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import axios from "../lib/axios";
import { useProductStore } from "../stores/useProductStore";

// ============================================
// HELPERS
// ============================================

const money = (value) =>
  `N$${Number(value ?? 0).toLocaleString("en-NA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const count = (value) =>
  Number(value ?? 0).toLocaleString("en-NA");


const panelStyle = `
  relative min-w-0
  rounded-xl
  border border-[#522536]/70
  bg-gradient-to-br
  from-[#28131e]
  via-[#21121b]
  to-[#170e17]
  shadow-[0_8px_24px_rgba(0,0,0,0.28)]
  transition-all duration-300
  hover:border-red-500/30
  hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]
`;


// ============================================
// REUSABLE STATISTIC CARD
// ============================================

const StatCard = ({ title, value, icon: Icon, note }) => (
  <div className={`${panelStyle} relative min-w-0 overflow-hidden bg-gradient-to-br from-[#351622] via-[#29131e] to-[#1c1019] p-3 sm:p-4`}>
    <div className="relative z-10 flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-red-200 sm:text-xs">
          {title}
        </p>

        <h3 className="mt-2 break-words text-lg font-bold text-white sm:text-2xl">
          {value}
        </h3>

        <p className="mt-2 text-[10px] text-gray-400 sm:text-xs">
          {note}
        </p>
      </div>

      <Icon
        size={26}
        className="shrink-0 text-red-500 sm:h-9 sm:w-9"
      />
    </div>

    <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-red-600/10 blur-2xl" />
  </div>
);

// ============================================
// OVERVIEW TAB
// ============================================

const OverviewTab = () => {
  const [analytics, setAnalytics] = useState(null);
  const [dailySales, setDailySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const products = useProductStore((state) => state.products);

  // ==========================================
  // FETCH LIVE ANALYTICS
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    const loadOverview = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get("/analytics", {
          signal: controller.signal,
        });

        setAnalytics(response.data.analyticsData ?? {});
        setDailySales(response.data.dailySalesData ?? []);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Overview analytics error:", err);
        setError("The spirits could not retrieve your shop statistics.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadOverview();

    return () => controller.abort();
  }, []);

  // ==========================================
  // CALCULATE INVENTORY ALERTS
  // ==========================================

  const stockProducts = Array.isArray(products)
    ? products
    : [];

  const outOfStock = stockProducts.filter(
    (product) => Number(product.inventoryQuantity) === 0
  );

  const lowStock = stockProducts.filter((product) => {
    const quantity = Number(product.inventoryQuantity);

    return Number.isFinite(quantity) &&
      quantity > 0 &&
      quantity <= 10;
  });

  const averageOrderValue =
    analytics?.totalSales > 0
      ? analytics.totalRevenue / analytics.totalSales
      : 0;

  const stats = analytics
    ? [
        {
          title: "Registered Souls",
          value: count(analytics.users),
          icon: Users,
          note: "Total registered accounts",
        },
        {
          title: "Total Products",
          value: count(analytics.products),
          icon: Package,
          note: "Artifacts in the catalog",
        },
        {
          title: "Total Sales",
          value: count(analytics.totalSales),
          icon: ShoppingCart,
          note: "Recorded orders",
        },
        {
          title: "Total Revenue",
          value: money(analytics.totalRevenue),
          icon: DollarSign,
          note: "Recorded order revenue",
        },
        {
          title: "Average Order Value",
          value: money(averageOrderValue),
          icon: ReceiptText,
          note: "Revenue divided by orders",
        },
        {
          title: "Low Stock Alerts",
          value: count(lowStock.length),
          icon: AlertTriangle,
          note: "Items with 1–10 units",
        },
      ]
    : [];

  // ==========================================
  // LOADING AND ERROR STATES
  // ==========================================

  if (loading) {
    return (
      <div className="py-16 text-center text-red-300">
        Summoning your shop statistics...
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-[#28151f] p-6 text-center text-red-300">
        {error || "Overview data is unavailable."}
      </div>
    );
  }

  // ==========================================
  // DASHBOARD CONTENT
  // ==========================================

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-[1600px] space-y-4 text-white sm:space-y-5"
    >
      {/* ======================================
          HEADER
      ====================================== */}

      <div
        className={`${panelStyle} flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6`}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-red-500/30 bg-[#21121d] p-3">
            <Skull size={27} className="text-red-300" />
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-red-300 sm:text-2xl">
              The Dark Overview
            </h2>

            <p className="mt-1 text-xs text-gray-400 sm:text-sm">
              Your shop's performance, customers, and inventory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#522536] bg-[#21131d] px-3 py-2 text-xs text-red-200">
          <CalendarDays size={15} />
          Sales trend: Last 30 Days
        </div>
      </div>

      {/* ======================================
          SIX KPI CARDS
      ====================================== */}

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* ======================================
          REVENUE CHART AND STOCK PANEL
      ====================================== */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* REVENUE TREND */}
        <div className={`${panelStyle} min-w-0 p-3 sm:p-5 lg:col-span-2`}>
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp size={19} className="text-red-400" />

            <div>
              <h3 className="text-sm font-bold text-red-200 sm:text-base">
                Revenue Trend
              </h3>

              <p className="text-xs text-gray-400">
                Daily recorded revenue
              </p>
            </div>
          </div>

          <div className="h-[230px] w-full sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailySales}
                margin={{ top: 8, right: 6, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="overviewRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#ef4444"
                      stopOpacity={0.45}
                    />

                    <stop
                      offset="100%"
                      stopColor="#ef4444"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#54303c"
                  strokeOpacity={0.45}
                  strokeDasharray="3 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  stroke="#b7a1ac"
                  tick={{ fontSize: 10 }}
                  minTickGap={24}
                  tickFormatter={(value) => value.slice(5)}
                />

                <YAxis
                  stroke="#b7a1ac"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                />

                <Tooltip
                  formatter={(value) => [money(value), "Revenue"]}
                  contentStyle={{
                    background: "#170e17",
                    border: "1px solid #522536",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff465c"
                  strokeWidth={2.5}
                  fill="url(#overviewRevenueGradient)"
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INVENTORY ALERTS */}
        <div className={`${panelStyle} min-w-0 p-3 sm:p-5`}>
          <div className="mb-5 flex items-center gap-2">
            <AlertTriangle size={19} className="text-red-400" />

            <div>
              <h3 className="text-sm font-bold text-red-200 sm:text-base">
                Inventory Alerts
              </h3>

              <p className="text-xs text-gray-400">
                Artifacts needing attention
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-[#522536] bg-[#1d111a] p-4">
              <div className="flex items-center gap-3">
                <PackageX size={21} className="text-red-400" />

                <div>
                  <p className="text-sm font-medium">
                    Out of Stock
                  </p>

                  <p className="text-xs text-gray-400">
                    No units remaining
                  </p>
                </div>
              </div>

              <span className="text-2xl font-bold text-red-300">
                {outOfStock.length}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[#522536] bg-[#1d111a] p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle size={21} className="text-amber-400" />

                <div>
                  <p className="text-sm font-medium">
                    Low Stock
                  </p>

                  <p className="text-xs text-gray-400">
                    1–10 units remaining
                  </p>
                </div>
              </div>

              <span className="text-2xl font-bold text-amber-400">
                {lowStock.length}
              </span>
            </div>

            <p className="pt-2 text-xs leading-relaxed text-gray-400">
              Review the Products tab to restock your artifacts
              before the shelves become suspiciously empty.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================
          QUICK BUSINESS SNAPSHOT
      ====================================== */}

      <div className={`${panelStyle} p-4 sm:p-5`}>
        <h3 className="mb-4 text-sm font-bold text-red-200 sm:text-base">
          Quick Insights
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-[#1d111a] p-3">
            <p className="text-xs text-gray-400">
              Average Order Value
            </p>

            <p className="mt-1 text-lg font-bold text-red-300">
              {money(averageOrderValue)}
            </p>
          </div>

          <div className="rounded-lg bg-[#1d111a] p-3">
            <p className="text-xs text-gray-400">
              Registered Customers
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              {count(analytics.users)}
            </p>
          </div>

          <div className="rounded-lg bg-[#1d111a] p-3">
            <p className="text-xs text-gray-400">
              Inventory Warnings
            </p>

            <p className="mt-1 text-lg font-bold text-amber-400">
              {lowStock.length + outOfStock.length}
            </p>
          </div>
        </div>
      </div>

    </motion.section>
  );
};

export default OverviewTab;
