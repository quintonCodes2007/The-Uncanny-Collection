
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Users,
  ShoppingBasket,
  PlusCircle,
  BarChart3,
} from "lucide-react";

import CreateProductForm from "../components/CreateProductsForm";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/AnalyticsTab";
import OverviewTab from "../components/OverviewTab";

import { useProductStore } from "../stores/useProductStore";

// ==============================================
// ADMIN DASHBOARD — NAVIGATION TABS
// ==============================================

const tabs = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
  },
  {
    id: "products",
    label: "Products",
    icon: ShoppingBasket,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    id: "create",
    label: "Create Product",
    icon: PlusCircle,
  },
];

// ==============================================
// MAIN ADMIN PAGE
// ==============================================

const AdminPage = () => {
  // Overview is now the default tab.
  const [activeTab, setActiveTab] = useState("overview");

  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      <div className="relative z-10 mx-auto w-full max-w-[1700px] px-3 py-8 sm:px-6 sm:py-12 lg:px-8">

        {/* =====================================
            PAGE TITLE
        ===================================== */}

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center text-2xl font-bold text-red-400 sm:mb-8 sm:text-4xl"
        >
          Admin Dashboard
        </motion.h1>

        {/* =====================================
            DASHBOARD NAVIGATION
        ===================================== */}

        <div
          role="tablist"
          aria-label="Admin dashboard sections"
          className="
            mb-6 flex flex-wrap
            items-center justify-center
            gap-2 sm:mb-8 sm:gap-3
          "
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`admin-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex min-h-10 items-center justify-center
                  gap-2 rounded-lg px-3 py-2
                  text-xs font-medium
                  transition-all duration-200
                  sm:px-5 sm:py-2.5 sm:text-sm

                  ${
                    isActive
                      ? "bg-red-500 text-white shadow-lg shadow-red-900/30"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={18}
                  className="shrink-0"
                />

                <span>
                  {tab.id === "create"
                    ? (
                      <>
                        <span className="sm:hidden">Create</span>
                        <span className="hidden sm:inline">
                          Create Product
                        </span>
                      </>
                    )
                    : tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* =====================================
            ACTIVE TAB CONTENT
        ===================================== */}

        <div
          id={`admin-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`admin-tab-${activeTab}`}
          className="min-w-0"
        >
          {activeTab === "overview" && <OverviewTab />}

          {activeTab === "customers" && (
            <div className="mx-auto max-w-xl rounded-xl border border-[#69404b] bg-[#281b27] px-6 py-12 text-center">
              <Users
                size={36}
                className="mx-auto mb-4 text-red-400"
              />

              <h2 className="text-xl font-semibold text-red-300">
                The Cursed Census™
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Customer analytics are coming next.
                Soon we'll uncover who — and what —
                is shopping at The Uncanny Collection.
              </p>
            </div>
          )}

          {activeTab === "products" && <ProductsList />}

          {activeTab === "analytics" && <AnalyticsTab />}

          {activeTab === "create" && <CreateProductForm />}
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
