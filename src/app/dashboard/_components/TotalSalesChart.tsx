
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, CartesianGrid, XAxis, Bar } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import Spinner from '@/components/loading/Loading';

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
  loading: boolean;
}

interface Sales {
  order_date: string;
  order_count: number;
}

interface YearsData {
  year: string;
  yearly_orders: number;
}

const TotalSalesChart: FC<TotalSalesChartProps> = ({ activeChart, setActiveChart, sales, yearData, loading }) => {

  const chartData = sales.map((sale) => ({
    date: sale.order_date,
    sales: sale.order_count,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row ">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className='text-xl font-extrabold text-gray-600'>Total Orders</CardTitle>
          <CardDescription>
            Showing the orders count for the selected month.
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
                  Orders Count this Month
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
                  Orders Count this Year
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
        {loading ? (
          <div className="flex justify-center items-center h-[250px] text-gray-500">
            <Spinner />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-[250px] text-gray-500">
            <span className="text-center text-gray-500 p-4 border border-gray-300 rounded-lg bg-gray-100">
              No Data Available on this Date.
            </span>
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
  );
};

export default TotalSalesChart;