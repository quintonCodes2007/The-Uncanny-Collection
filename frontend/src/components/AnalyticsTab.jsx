import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign, Loader } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return <div className="flex items-center justify-center p-50 bg-gray-90 animate-spin rounded-full ">
			<Loader />
		</div>;
	}


		const formatXAxisDate = (dateString) => {
		// Parse the YYYY-MM-DD date safely
		const [year, month, day] = dateString.split("-").map(Number);
		const date = new Date(year, month - 1, day);

		const now = new Date();
		const today = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		);

		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);

		if (date.getTime() === today.getTime()) {
			return "Today";
		}

		if (date.getTime() === yesterday.getTime()) {
			return "Yest";
		}

		return date.toLocaleDateString("en-US", {
			weekday: "short"
		});
		};

		const maxSales = Math.max(
		0,
		...dailySalesData.map((day) => day.sales)
		);

		const salesTicks = Array.from(
		{ length: Math.max(9, maxSales + 1) },
		(_, i) => i
		);


	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			
		<div className="mb-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">

				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color='from-emerald-500 to-teal-700'
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color='from-emerald-500 to-green-700'
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color='from-emerald-500 to-cyan-700'
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`$${analyticsData.totalRevenue.toLocaleString()}`}
					icon={DollarSign}
					color='from-emerald-500 to-lime-700'
				/>
			</div>
			<motion.div
				className="min-w-0 rounded-lg bg-red-900/20 p-3 shadow-lg sm:p-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.25 }}
			>
				<div className="w-full min-w-0 overflow-x-auto overscroll-x-contain">
				<div className="h-[300px] w-[140%] md:h-[400px] md:w-full">
						<ResponsiveContainer width="100%" height="100%">
						<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 5' />
						
						<XAxis
						dataKey="date"
						stroke="#D1D5DB"
						tickFormatter={formatXAxisDate}
						interval={0}
						tick={{ fontSize: 12 }}
						minTickGap={5}
						/>
						
						<YAxis
						yAxisId="left"
						stroke="#D1D5DB"
						allowDecimals={false}
						domain={[0, salesTicks[salesTicks.length - 1]]}
						ticks={salesTicks}
						interval={0}
						/>

						<YAxis
						yAxisId="right"
						orientation="right"
						stroke="#D1D5DB"
						/>
						<Tooltip />
						<Legend />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#10B981'
							activeDot={{ r: 8 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#3B82F6'
							activeDot={{ r: 8 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
			</motion.div>
		</div>
	);
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		
		className={`bg-gray-800 rounded-lg p-3 sm:p-6 shadow-lg overflow-hidden relative min-w-0 ${color}`}

		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center'>
			<div className='z-10'>
				<p className='text-red-300 text-sm mb-1 font-semibold'>{title}</p>
				<h3 className="text-white text-xl sm:text-3xl font-bold break-words">
  {value}
</h3>
			</div>
		</div>
		<div className='absolute inset-0 bg-linear-to-br from-red-600 to-red-900 opacity-30' />
		<div className='absolute -bottom-4 -right-4 text-red-500 opacity-50'>
			<Icon className="h-16 w-16 sm:h-32 sm:w-32" />
		</div>
	</motion.div>
);