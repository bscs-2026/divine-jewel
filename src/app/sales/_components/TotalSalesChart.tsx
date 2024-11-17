import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, CartesianGrid, XAxis, Bar } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
<<<<<<< HEAD
} from "@/components/ui/chart"

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
        {/* <div className="flex">
          {["sales"].map((key) => {
            const chart = key as keyof typeof barChartConfig;
=======
  } from "@/components/ui/chart"

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Transactions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface TotalSalesChartProps {
  activeChart: keyof typeof chartConfig;
  setActiveChart: (chart: keyof typeof chartConfig) => void;
  total: { [key: string]: number };
  chartData: { date: string; [key: string]: number }[];
}

const TotalSalesChart: React.FC<TotalSalesChartProps> = ({ activeChart, setActiveChart, total, chartData }) => {
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Sales</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop"].map((key) => {
            const chart = key as keyof typeof chartConfig;
>>>>>>> 01076dc (sales subsystem UI)
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
<<<<<<< HEAD
                  {barChartConfig[chart].label}
=======
                  {chartConfig[chart].label}
>>>>>>> 01076dc (sales subsystem UI)
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
<<<<<<< HEAD
        </div> */}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={barChartConfig}
=======
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
>>>>>>> 01076dc (sales subsystem UI)
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
                  year: "numeric",
=======
                  day: "numeric",
>>>>>>> 01076dc (sales subsystem UI)
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
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
=======
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
            />
>>>>>>> 01076dc (sales subsystem UI)
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TotalSalesChart;