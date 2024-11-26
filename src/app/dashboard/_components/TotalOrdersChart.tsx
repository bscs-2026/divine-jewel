import React, { FC, useEffect, useState } from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";
import { Card, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Spinner from "@/components/loading/Loading";

const lineChartConfig = {
  orders: {
    label: "Orders",
    color: "#228B22", // Orders line color
  },
  returns: {
    label: "Returns",
    color: "#FF0000", // Returns line color
  },
} satisfies ChartConfig;

interface TotalOrdersChartProps {
  year: string;
  month: string;
  loading: boolean;
}

const TotalOrdersChart: FC<TotalOrdersChartProps> = ({ year, month, loading }) => {
  const [dailyOrders, setDailyOrders] = useState<any[]>([]);
  const [dailyReturns, setDailyReturns] = useState<any[]>([]);
  const [monthlyOrders, setMonthlyOrders] = useState<any[]>([]);
  const [monthlyReturns, setMonthlyReturns] = useState<any[]>([]);
  const [yearlyOrders, setYearlyOrders] = useState<any[]>([]);
  const [yearlyReturns, setYearlyReturns] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<"yearly" | "monthly" | "daily">("daily");

  // Fetch data for Orders
  const fetchYearlyOrders = async () => {
    try {
      const response = await fetch(`/api/dashboard/orders`);
      if (!response.ok) throw new Error("Failed to fetch yearly orders");
      const data = await response.json();
      setYearlyOrders(data.yearlyOrders || []);
    } catch {
      setYearlyOrders([]);
    }
  };

  const fetchMonthlyOrders = async () => {
    try {
      const response = await fetch(`/api/dashboard/orders?year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch monthly orders");
      const data = await response.json();
      setMonthlyOrders(data.monthlyOrders || []);
    } catch {
      setMonthlyOrders([]);
    }
  };

  const fetchDailyOrders = async () => {
    try {
      const response = await fetch(`/api/dashboard/orders?year=${year}&month=${month}`);
      if (!response.ok) throw new Error("Failed to fetch daily orders");
      const data = await response.json();
      setDailyOrders(data.dailyOrders || []);
    } catch {
      setDailyOrders([]);
    }
  };

  // Fetch data for Returns
  const fetchYearlyReturns = async () => {
    try {
      const response = await fetch(`/api/dashboard/returns?year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch yearly returns");
      const data = await response.json();
      setYearlyReturns(data.yearlyReturns || []);
    } catch {
      setYearlyReturns([]);
    }
  };

  const fetchMonthlyReturns = async () => {
    try {
      const response = await fetch(`/api/dashboard/returns?year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch monthly returns");
      const data = await response.json();
      setMonthlyReturns(data.monthlyReturns || []);
    } catch {
      setMonthlyReturns([]);
    }
  };

  const fetchDailyReturns = async () => {
    try {
      const response = await fetch(`/api/dashboard/returns?year=${year}&month=${month}`);
      if (!response.ok) throw new Error("Failed to fetch daily returns");
      const data = await response.json();
      setDailyReturns(data.dailyReturns || []);
    } catch {
      setDailyReturns([]);
    }
  };

  // UseEffect to trigger fetch based on view
  useEffect(() => {
    if (activeView === "yearly") {
      fetchYearlyOrders();
      fetchYearlyReturns();
    } else if (activeView === "monthly") {
      fetchMonthlyOrders();
      fetchMonthlyReturns();
    } else if (activeView === "daily") {
      fetchDailyOrders();
      fetchDailyReturns();
    }
  }, [activeView, year, month]);

  // Merging Orders and Returns Data
  // const mergeData = (ordersData: any[], returnsData: any[], dateKey: string) => {
  //   const mergedData = ordersData.map((order) => {
  //     const matchingReturn = returnsData.find((ret) => ret[dateKey] === order[dateKey]);
  //     return {
  //       ...order,
  //       total_returns: matchingReturn ? matchingReturn.total_returns : 0, // If no return, set to 0
  //     };
  //   });
  //   return mergedData;
  // };

  const mergeData = (ordersData: any[], returnsData: any[], dateKeyOrders: string, dateKeyReturns: string) => {
    const mergedData = ordersData.map((order) => {
      const orderDate = order[dateKeyOrders] ? String(order[dateKeyOrders]).trim() : ""; // Ensure it’s a string
      const matchingReturn = returnsData.find((ret) => {
        const returnDate = ret[dateKeyReturns] ? String(ret[dateKeyReturns]).trim() : ""; // Ensure it’s a string
        return returnDate === orderDate;
      });

      const month = activeView === "monthly" && orderDate ? parseInt(orderDate.split("-")[1]) : undefined;

      const mergedItem = {
        orders_date: orderDate,
        orders_year: year,
        orders_month: month,
        total_orders: Number(order.total_orders || 0),
        total_returns: matchingReturn ? Number(matchingReturn.total_returns || 0) : 0,
      };

      return mergedItem;
    });

    return mergedData;
  };

  // Merge Orders and Returns based on active view (daily, monthly, yearly)
  const ordersChartData =
    activeView === "yearly"
      ? mergeData(yearlyOrders, yearlyReturns, "orders_year", "returns_year")
      : activeView === "monthly"
        ? mergeData(monthlyOrders, monthlyReturns, "orders_month", "returns_month")
        : mergeData(dailyOrders, dailyReturns, "orders_date", "returns_date");


  const dataKey =
    activeView === "yearly"
      ? "orders_year"
      : activeView === "monthly"
        ? "orders_month"
        : "orders_date";

  // Get max values for Orders and Returns
  const maxOrdersValue = Math.max(...ordersChartData.map((data) => data.total_orders || 0), 0);
  const maxReturnsValue = Math.max(...ordersChartData.map((data) => data.total_returns || 0), 0);
  const maxValue = Math.max(maxOrdersValue, maxReturnsValue);

  return (
    <div className="flex flex-wrap">
      <Card className="flex-1">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row h-14">
          <div className="flex w-full">
            <button
              data-active={activeView === "yearly"}
              className={`relative z-30 flex flex-1 flex-col justify-center items-center gap-1 px-6 py-4 text-center bg-[#FCE4EC] rounded-tl-[0.75rem] ${activeView === "yearly" ? "bg-[#F9BDBB] font-bold" : ""
                }`}
              onClick={() => setActiveView("yearly")}
            >
              <span className="text-xs text-muted-foreground">Yearly Orders & Returns</span>
            </button>
            <button
              data-active={activeView === "monthly"}
              className={`relative z-30 flex flex-1 flex-col justify-center items-center gap-1 px-6 py-4 text-center bg-[#FCE4EC] border-l-0 border-r-0 ${activeView === "monthly" ? "bg-[#F9BDBB] font-bold" : ""
                }`}
              onClick={() => setActiveView("monthly")}
            >
              <span className="text-xs text-muted-foreground">Monthly Orders & Returns</span>
            </button>
            <button
              data-active={activeView === "daily"}
              className={`relative z-30 flex flex-1 flex-col justify-center items-center gap-1 px-6 py-4 text-center bg-[#FCE4EC] rounded-tr-[0.75rem] ${activeView === "daily" ? "bg-[#F9BDBB] font-bold" : ""
                }`}
              onClick={() => setActiveView("daily")}
            >
              <span className="text-xs text-muted-foreground">Daily Orders & Returns</span>
            </button>
          </div>
        </CardHeader>
        <div className="sm:p-4">
          {loading ? (
            <Spinner />
          ) : ordersChartData.length === 0 ? (
            <div className="text-center text-gray-500">No Data Available</div>
          ) : (
            <ChartContainer config={lineChartConfig} className="aspect-auto h-[250px] w-full">
              <LineChart
                data={ordersChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={dataKey}
                  tickFormatter={(tick) => {
                    if (activeView === "yearly") {
                      return tick;
                    } else if (activeView === "monthly") {
                      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      return monthNames[tick - 1] || tick;
                    } else {
                      return tick;
                    }
                  }}
                />

                <YAxis domain={[0, maxValue]} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: number, name: string) =>
                        name === "total_orders"
                          ? [`Total Orders: ${value}`, ""]
                          : name === "total_returns"
                            ? [`Total Returns: ${value}`, ""]
                            : [`${name}: ${value}`, ""]
                      }
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="total_orders"
                  stroke="#228B22"
                  name="Total Orders"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="total_returns"
                  stroke="#FF0000"
                  name="Total Returns"
                  dot={false}
                />
              </LineChart>

            </ChartContainer>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TotalOrdersChart;
