
import { PlusCircle, ShoppingBasket, BarChart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

import CreateProductForm from '../components/CreateProductsForm';
import ProductsList from '../components/ProductsList';
import AnalyticsTab from '../components/AnalyticsTab';
import { useProductStore } from '../stores/useProductStore';


const tabs = [
    {id: "products", label: "Products", icon: ShoppingBasket},
    {id: "create", label: "Create Product", icon: PlusCircle},
    {id: "analytics", label: "Analytics", icon: BarChart},
];

const AdminPage = () => {

    const [activeTab, setActiveTab] = useState("products");
    const { fetchAllProducts } = useProductStore();

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    return (
        <div className='min-h-screen  text-white relative overflow-hidden'>
            <div className='relative z-10 container mx-auto px-4 py-16'>
                <motion.h1
                    className="text-center text-2xl sm:text-4xl font-bold text-red-400 mb-6 sm:mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Admin Dashboard
                </motion.h1>


                <div className="mb-8 grid grid-cols-3 gap-2 sm:flex sm:justify-center sm:gap-0">
                {tabs.map((tab) => (
                    <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 py-3 text-xs font-medium transition-colors duration-200 sm:mx-2 sm:flex-row sm:gap-0 sm:px-4 sm:py-2 sm:text-base ${
                        activeTab === tab.id
                        ? "bg-red-500 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                    >
                    <tab.icon className="h-5 w-5 shrink-0 sm:mr-3 sm:h-6 sm:w-6" />

                    <span className="text-center leading-tight sm:text-left">
                        {tab.id === "create" ? (
                        <>
                            <span className="sm:hidden">Create</span>
                            <span className="hidden sm:inline">Create Product</span>
                        </>
                        ) : (
                        tab.label
                        )}
                    </span>
                    </button>
                ))}
                </div>

                    {activeTab === "create" && <CreateProductForm />}
                    {activeTab === "products" && <ProductsList />}
                    {activeTab === "analytics" && <AnalyticsTab />}
            </div>

        </div>
    );

}

export default AdminPage;