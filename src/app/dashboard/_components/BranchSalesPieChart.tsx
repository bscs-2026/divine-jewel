"use client";
import { pinkShades } from "@/lib/constants";
import { BranchesOrders } from "../page";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { months } from "@/lib/constants";

interface BranchSalesPieChartProps {
  year: string;
  month: string;
}

const BranchSalesPieChart: FC<BranchSalesPieChartProps> = ({ year, month }) => {
  const [isMonth, setIsMonth] = useState<boolean>(true);
  const [branchesOrders, setBranchesOrders] = useState<BranchesOrders[]>([]);

  useEffect(() => {
    fetchBranchSalesData(isMonth);
  }, [year, month, isMonth]);

  const fetchBranchSalesData = async (isMonth: boolean) => {
    let url;
    if (isMonth) {
      const monthValue = months.find((m) => m.name === month)?.value;
      const date = `${year}-${monthValue}`;
      url = `/api/sales/branchOrders?date=${date}`;
    } else {
      url = `/api/sales/branchOrders?year=${year}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch branch orders data");
      }
      const data = await response.json();
      setBranchesOrders(data.branchesOrders);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const toggleIsMonth = () => {
    setIsMonth((prevIsMonth) => !prevIsMonth);
  };


  const ChartData = branchesOrders.map((branch, index) => ({
    branch: branch.branch_name,
    orders: branch.orders_count,
    fill: pinkShades[index % pinkShades.length],
  }));

  const chartConfig = branchesOrders.reduce((config, branch, index) => {
    config[branch.branch_name] = {
      label:
        branch.branch_name.charAt(0).toUpperCase() +
        branch.branch_name.slice(1),
      color: pinkShades[index % pinkShades.length],
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col rounded-xl shadow-md h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold text-gray-600">Orders Per Branch</CardTitle>
        <CardDescription>
          <Button
            className="text-sm text-gray-700 p-2 w-[150px] bg-[#FCE4EC] hover:bg-pink-200"
            onClick={toggleIsMonth}
          >
            {isMonth ? month : year}
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 p-8 min-h-[300px]">
        {ChartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={ChartData} dataKey="orders" label nameKey="branch" />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="mt-[50px] text-center items-center text-gray-500 p-4 border border-gray-300 rounded-lg bg-gray-100">
            No available data on this date.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground mx-6 text-center">
          Showing total orders per branch for the month of {month} {year}.
        </div>
      </CardFooter>
    </Card>
  );
};

export default BranchSalesPieChart;
