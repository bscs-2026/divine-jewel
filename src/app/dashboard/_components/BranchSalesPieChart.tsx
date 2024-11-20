"use client";
import { TrendingUp } from "lucide-react";
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
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";

interface BranchSalesPieChartProps {
  branchesOrders: BranchesOrders[];
  year: string;
  month: string;
}

const BranchSalesPieChart: FC<BranchSalesPieChartProps> = ({
  branchesOrders,
  year,
  month,
}) => {
  const [isMonth, setIsMonth] = useState<boolean>(true);

  const toggleIsMonth = () => {
    setIsMonth((prevIsMonth) => !prevIsMonth);
  };

  const pinkShades = [
    "#ffb3c6",
    "#ffccd5",
    "#ffe0e6",
    "#ff99af",
    "#ff6f91",
    "#fcb8c7",
    "#fcdbdf",
    "#fdf1f4",
    "#fc8fb2",
    "#fa678e",
    "#ffa6c1",
    "#ffc4d6",
    "#ffe4e8",
    "#ff8db0",
    "#ff5e87",
    "#fc9fb5",
    "#fcb4c5",
    "#ffd2d8",
    "#fb859f",
    "#f94d78",
  ];

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
    <Card className="flex flex-col rounded-xl shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Orders Per Branch</CardTitle>
        <CardDescription>
          <Button className="text-sm text-gray-700 p-2 w-[150px] bg-[#FCE4EC] hover:bg-pink-200" onClick={toggleIsMonth}>
            {isMonth ? month : year}
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 p-8">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={ChartData} dataKey="orders" label nameKey="branch" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total orders for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default BranchSalesPieChart;
