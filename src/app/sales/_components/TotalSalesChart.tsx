
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, CartesianGrid, XAxis, Bar } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
} from "@/components/ui/chart"

const barChartConfig = {
  sales: {
    label: "Sales",
    color: "#FCB6D7",
  },
} satisfies ChartConfig

interface TotalSalesChartProps {
  yearData: YearsData[];
  sales: Sales[];
  activeChart: keyof typeof barChartConfig;
  setActiveChart: (chart: keyof typeof barChartConfig) => void;
}
  
interface Sales {
  order_date: string;
  order_count: number;
}

interface YearsData {
  year: string;
  yearly_orders: number;
}

const TotalSalesChart: FC<TotalSalesChartProps> = ({ activeChart, setActiveChart, sales, yearData }) => {

  const chartData = sales.map((sale) => ({
    date: sale.order_date,
    sales: sale.order_count,
  }));

  return (
    <Card>
<<<<<<< HEAD
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row ">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Sales</CardTitle>
          <CardDescription>
            Showing total sales for the last 12 months
          </CardDescription>
        </div>
        {/* <div className="flex">
          {["sales"].map((key) => {
            const chart = key as keyof typeof barChartConfig;
=======
=======
>>>>>>> 82619f2 (sales subsystem UI)
  } from "@/components/ui/chart"
=======
} from "@/components/ui/chart"
>>>>>>> e3eab2c (transferred Sales Bar Chart from page.tsx  to TotalSalesChart.tsx component)

const chartData = [
  { date: "2023-07-01", sales: 2220 },
  { date: "2023-08-01", sales: 1970 },
  { date: "2023-09-01", sales: 1670 },
  { date: "2023-10-01", sales: 2420 },
  { date: "2023-11-01", sales: 3730 },
  { date: "2023-12-01", sales: 3000 },
  { date: "2024-01-01", sales: 2450 },
  { date: "2024-02-01", sales: 4090 },
  { date: "2024-03-01", sales: 590 },
  { date: "2024-04-01", sales: 2610 },
  { date: "2024-05-01", sales: 3270 },
  { date: "2024-06-01", sales: 2920 },
];

const barChartConfig = {
  sales: {
    label: "Sales",
    color: "#FCB6D7",
  },
} satisfies ChartConfig

interface TotalSalesChartProps {
  activeChart: keyof typeof barChartConfig;
  setActiveChart: (chart: keyof typeof barChartConfig) => void;
  barChartConfig: ChartConfig;
}
  

const TotalSalesChart: React.FC<TotalSalesChartProps> = ({ activeChart, setActiveChart, barChartConfig }) => {
  const total = React.useMemo(
    () => ({
      sales: chartData.reduce((acc, curr) => acc + curr.sales, 0),
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row ">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Sales</CardTitle>
          <CardDescription>
            Showing total sales for the last 12 months
          </CardDescription>
        </div>
<<<<<<< HEAD
        <div className="flex">
          {["desktop"].map((key) => {
            const chart = key as keyof typeof chartConfig;
<<<<<<< HEAD
>>>>>>> 01076dc (sales subsystem UI)
=======
>>>>>>> 82619f2 (sales subsystem UI)
=======
        {/* <div className="flex">
          {["sales"].map((key) => {
            const chart = key as keyof typeof barChartConfig;
>>>>>>> e3eab2c (transferred Sales Bar Chart from page.tsx  to TotalSalesChart.tsx component)
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                  {barChartConfig[chart].label}
=======
                  {chartConfig[chart].label}
>>>>>>> 01076dc (sales subsystem UI)
=======
                  {chartConfig[chart].label}
>>>>>>> 82619f2 (sales subsystem UI)
=======
                  {barChartConfig[chart].label}
>>>>>>> e3eab2c (transferred Sales Bar Chart from page.tsx  to TotalSalesChart.tsx component)
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        </div> */}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={barChartConfig}
=======
=======
>>>>>>> 82619f2 (sales subsystem UI)
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
<<<<<<< HEAD
>>>>>>> 01076dc (sales subsystem UI)
=======
>>>>>>> 82619f2 (sales subsystem UI)
=======
        </div> */}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={barChartConfig}
>>>>>>> e3eab2c (transferred Sales Bar Chart from page.tsx  to TotalSalesChart.tsx component)
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                  year: "numeric",
=======
                  day: "numeric",
>>>>>>> 01076dc (sales subsystem UI)
=======
                  day: "numeric",
>>>>>>> 82619f2 (sales subsystem UI)
=======
                  year: "numeric",
>>>>>>> e3eab2c (transferred Sales Bar Chart from page.tsx  to TotalSalesChart.tsx component)
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
=======
=======
>>>>>>> 82619f2 (sales subsystem UI)
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
            />
<<<<<<< HEAD
>>>>>>> 01076dc (sales subsystem UI)
=======
>>>>>>> 82619f2 (sales subsystem UI)
=======
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
>>>>>>> e3eab2c (transferred Sales Bar Chart from page.tsx  to TotalSalesChart.tsx component)
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
=======
  <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row ">
    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
      <CardTitle>Total Sales</CardTitle>
      <CardDescription>
        Showing the count of sales for the selected month.
      </CardDescription>
    </div>
    <div className="flex">
      {["sales"].map((key) => {
        const chart = key as keyof typeof barChartConfig;
        return (
          <button
            key={chart}
            data-active={activeChart === chart}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
            onClick={() => setActiveChart(chart)}
          >
            <span className="text-xs text-muted-foreground">
              Count of sales this Month
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl ml-auto">
              {chartData.reduce((acc, item) => acc + item.sales, 0)}
            </span>
          </button>
        );
      })}
    </div>
    <div className="flex">
    {["sales"].map((key) => {
  const chart = key as keyof typeof barChartConfig;
  return (
    <button
      key={chart}
      data-active={activeChart === chart}
      className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 "
      onClick={() => setActiveChart(chart)}
    >
      <span className="text-xs text-muted-foreground">
        Count of sales this Year
      </span>
      <span className="text-lg font-bold leading-none sm:text-3xl ml-auto">
        {yearData.reduce((acc, item) => acc + item.yearly_orders, 0)}
      </span>
    </button>
  );
})}
    </div>
  </CardHeader>
  <CardContent className="px-2 sm:p-6">
    {chartData.length === 0 ? (
      <div className="flex justify-center items-center h-[250px] text-gray-500">
        <span>No Data Available on this Date.</span>
      </div>
    ) : (
      <ChartContainer
        config={barChartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="views"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
            }
          />
          <Bar dataKey="sales" fill={`var(--color-${activeChart})`} />
        </BarChart>
      </ChartContainer>
    )}
  </CardContent>
</Card>
>>>>>>> 15af650 (save all changes)
  );
};

export default TotalSalesChart;