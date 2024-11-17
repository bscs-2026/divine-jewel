<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e3eab2c (transferred Sales Bar Chart from page.tsx  to TotalSalesChart.tsx component)
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; // Adjust the import paths as necessary
import { BarChart, CartesianGrid, XAxis, Bar } from 'recharts'; 
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"// Adjust the import paths as necessary
<<<<<<< HEAD

interface TotalSalesChartProps {
  timePeriod: string;
}

const TotalSalesChart: React.FC<TotalSalesChartProps> = ({ timePeriod }) => {
  const [activeChart, setActiveChart] = useState<string>('desktop');
  
  const barChartConfig = {
    desktop: { label: 'Desktop Sales' },
    mobile: { label: 'Mobile Sales' },
    // Add other configurations as needed
  };

  const total = {
    desktop: 10000,
    mobile: 5000,
    // Add other totals as needed
  };

  const chartData = [
    { date: '2023-01-01', desktop: 1000, mobile: 500 },
    { date: '2023-01-02', desktop: 1200, mobile: 600 },
    // Add other data points as needed
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row ">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Sales</CardTitle>
          <CardDescription>
            Showing total sales for the last {timePeriod}
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof barChartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {barChartConfig[chart].label}
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
=======
=======
>>>>>>> 82619f2 (sales subsystem UI)
import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Command, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
=======
>>>>>>> e3eab2c (transferred Sales Bar Chart from page.tsx  to TotalSalesChart.tsx component)

interface TotalSalesChartProps {
  timePeriod: string;
}

const TotalSalesChart: React.FC<TotalSalesChartProps> = ({ timePeriod }) => {
  const [activeChart, setActiveChart] = useState<string>('desktop');
  
  const barChartConfig = {
    desktop: { label: 'Desktop Sales' },
    mobile: { label: 'Mobile Sales' },
    // Add other configurations as needed
  };

  const total = {
    desktop: 10000,
    mobile: 5000,
    // Add other totals as needed
  };

  const chartData = [
    { date: '2023-01-01', desktop: 1000, mobile: 500 },
    { date: '2023-01-02', desktop: 1200, mobile: 600 },
    // Add other data points as needed
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row ">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Sales</CardTitle>
          <CardDescription>
            Showing total sales for the last {timePeriod}
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof barChartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {barChartConfig[chart].label}
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

<<<<<<< HEAD
<<<<<<< HEAD
export default TimePeriodDropdown;
>>>>>>> 01076dc (sales subsystem UI)
=======
export default TimePeriodDropdown;
>>>>>>> 82619f2 (sales subsystem UI)
=======
export default TotalSalesChart;
>>>>>>> e3eab2c (transferred Sales Bar Chart from page.tsx  to TotalSalesChart.tsx component)
