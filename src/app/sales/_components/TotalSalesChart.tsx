import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, CartesianGrid, XAxis, Bar } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
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
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
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
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TotalSalesChart;