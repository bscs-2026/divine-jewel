import React, { FC, useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Spinner from "@/components/loading/Loading";

const barChartConfig = {
  sales: {
    label: "Sales",
    color: "#4C96D7", // Sales chart color
  },
} satisfies ChartConfig;

interface TotalSalesChartProps {
  year: string;
  month: string;
  loading: boolean;
}

const TotalSalesChart: FC<TotalSalesChartProps> = ({ year, month, loading }) => {
  const [monthlySales, setMonthlySales] = useState<any[]>([]);
  const [dailySales, setDailySales] = useState<any[]>([]);
  const [yearlySales, setYearlySales] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<"yearly" | "monthly" | "daily">("daily");

  const fetchYearlySales = async () => {
    try {
      const response = await fetch(`/api/dashboard/sales`);
      if (!response.ok) throw new Error("Failed to fetch yearly sales");
      const data = await response.json();
      setYearlySales(Array.isArray(data.yearlySales) ? data.yearlySales : []);
    } catch {
      setYearlySales([]);
    }
  };

  const generateDefaultMonths = (year: string) => {
    return Array.from({ length: 12 }, (_, index) => {
      const month = (index + 1).toString().padStart(2, "0");
      return { sales_month: `${year}-${month}`, total_sales: 0 };
    });
  };

  const fetchMonthlySales = async () => {
    try {
      const response = await fetch(`/api/dashboard/sales?year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch monthly sales");
      const data = await response.json();
      const fetchedMonthlySales = Array.isArray(data.monthlySales)
        ? data.monthlySales
        : [];
      const defaultMonths = generateDefaultMonths(year);
      const mergedMonthlySales = defaultMonths.map((month) => {
        const match = fetchedMonthlySales.find(
          (sale) => sale.sales_month === month.sales_month
        );
        return match ? match : month;
      });
      setMonthlySales(mergedMonthlySales);
    } catch {
      setMonthlySales(generateDefaultMonths(year));
    }
  };

  const generateFullMonthDates = (year: string, month: string) => {
    const numericMonth = isNaN(Number(month))
      ? new Date(`${month} 1, ${year}`).getMonth() + 1
      : parseInt(month);

    const daysInMonth = new Date(parseInt(year), numericMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, day) => {
      const date = `${year}-${numericMonth.toString().padStart(2, "0")}-${(day + 1)
        .toString()
        .padStart(2, "0")}`;
      return { sales_date: date, total_sales: 0 };
    });
  };

  const fetchDailySales = async () => {
    try {
      const response = await fetch(`/api/dashboard/sales?year=${year}&month=${month}`);
      if (!response.ok) throw new Error("Failed to fetch daily sales");
      const data = await response.json();
      const fetchedDailySales = Array.isArray(data.dailySales) ? data.dailySales : [];
      const fullMonthDates = generateFullMonthDates(year, month);
      const mergedDailySales = fullMonthDates.map((date) => {
        const match = fetchedDailySales.find(
          (sale) => sale.sales_date === date.sales_date
        );
        return match ? match : date;
      });
      setDailySales(mergedDailySales);
    } catch {
      setDailySales(generateFullMonthDates(year, month));
    }
  };

  useEffect(() => {
    if (activeView === "yearly") {
      fetchYearlySales();
    } else if (activeView === "monthly") {
      fetchMonthlySales();
    } else if (activeView === "daily") {
      fetchDailySales();
    }
  }, [activeView, year, month]);

  const salesChartData =
    activeView === "yearly"
      ? yearlySales
      : activeView === "monthly"
        ? monthlySales
        : dailySales;

  const dataKey =
    activeView === "yearly"
      ? "sales_year"
      : activeView === "monthly"
        ? "sales_month"
        : "sales_date";

  const maxValue = Math.max(...salesChartData.map((data) => data.total_sales || 0), 0);

  return (
    <div className="flex flex-wrap h-full">
      <Card className="flex-1 ">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row h-14">
          <div className="flex w-full">
            <button
              data-active={activeView === "yearly"}
              className={`relative z-30 flex flex-1 flex-col justify-center items-center gap-1 px-6 py-4 text-center bg-[#D6EAF8] rounded-tl-[0.75rem] ${activeView === "yearly" ? "bg-[#AED6F1] font-bold" : ""
                }`}
              onClick={() => setActiveView("yearly")}
            >
              <span className="text-xs text-muted-foreground">Yearly Sales</span>
            </button>
            <button
              data-active={activeView === "monthly"}
              className={`relative z-30 flex flex-1 flex-col justify-center items-center gap-1 px-6 py-4 text-center bg-[#D6EAF8] border-l-0 border-r-0 ${activeView === "monthly" ? "bg-[#AED6F1] font-bold" : ""
                }`}
              onClick={() => setActiveView("monthly")}
            >
              <span className="text-xs text-muted-foreground">Monthly Sales</span>
            </button>
            <button
              data-active={activeView === "daily"}
              className={`relative z-30 flex flex-1 flex-col justify-center items-center gap-1 px-6 py-4 text-center bg-[#D6EAF8] rounded-tr-[0.75rem] border-r-0 border-l ${activeView === "daily" ? "bg-[#AED6F1] font-bold" : ""
                }`}
              onClick={() => setActiveView("daily")}
            >
              <span className="text-xs text-muted-foreground">Daily Sales</span>
            </button>
          </div>
        </CardHeader>
        <div className="sm:p-4">
          {loading ? (
            <Spinner />
          ) : salesChartData.length === 0 ? (
            <div className="text-center text-gray-500">No Data Available</div>
          ) : (
            <ChartContainer config={barChartConfig} className="aspect-auto h-[250px] w-full">
              {/* <BarChart
                data={salesChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey={dataKey} />
                <YAxis domain={[0, maxValue]} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value: number, name: string) =>
                        name === "total_sales"
                          ? [`Total Sales: ₱${value.toFixed(2)}`, ""]
                          : [`${name}: ${value}`, ""]
                      }
                    />
                  }
                />
                <Bar dataKey="total_sales" fill="#4C96D7" name="Total Sales" />
              </BarChart> */}
              <BarChart
                data={salesChartData}
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
                      const [year, month] = tick.split("-");
                      return monthNames[parseInt(month, 10) - 1] || tick;
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
                        name === "total_sales"
                          ? [`Total Sales: ₱${value.toFixed(2)}`, ""]
                          : [`${name}: ${value}`, ""]
                      }
                    />
                  }
                />
                <Bar dataKey="total_sales" fill="#4C96D7" name="Total Sales" />
              </BarChart>

            </ChartContainer>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TotalSalesChart;
