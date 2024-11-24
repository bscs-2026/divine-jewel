"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

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
import { months } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const chartConfig = {
  orders: {
    label: "orders",
    color: "#FCB6D7",
  },
} satisfies ChartConfig;

interface OrdersSummaryProps {
  year: string;
}

interface OrdersSummary {
  order_date: string;
  orders_count: number;
}

export const OrdersSummary: FC<OrdersSummaryProps> = ({ year }) => {
  const [ordersSummary, setOrdersSummary] = useState<OrdersSummary[]>([]);
  const [isYear, setIsYear] = useState<boolean>(true);

  useEffect(() => {
    fetchOrdersSummary(isYear);
  }, [isYear, year]);

  const fetchOrdersSummary = async (isYear: boolean) => {
    let url = "";
    if (isYear) {
      url = `/api/sales/ordersSummary?year=${year}`;
    } else {
      url = `/api/sales/ordersSummary`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch orders summary data");
      }
      const data = await response.json();
      setOrdersSummary(data.ordersSummary);

    } catch (error: any) {
      console.error(error.message);
    }
  };

  const monthsSummary = ordersSummary.map((order) => {
    const orderDate = order.order_date;
    const [yearValue, monthValue] =
      typeof orderDate === "string" ? orderDate.split("-") : ["", ""];
    const monthName =
      months.find((m) => m.value === monthValue)?.name || monthValue;
    return {
      month: monthName,
      orders: order.orders_count,
    };
  });

  const yearsSummary = ordersSummary.map((order) => {
    return {
      month: order.order_date.toString(),
      orders: order.orders_count,
    };
  });

  const toggleIsYear = () => {
    setIsYear((prevIsYear) => !prevIsYear);
  };

  return (
    <Card className="shadow-md ">
      <CardHeader>
        <div className="flex flex-row">
          <div>
            <CardTitle className="text-xl font-bold text-gray-600">
              Orders Summary
            </CardTitle>
            <CardDescription>
              {isYear
                ? `The count of Orders for ${year}.`
                : "The count of Orders for all years."}
            </CardDescription>
          </div>
          <div className="ml-auto">
            <Button
              className="text-sm text-gray-700 p-2 w-[130px] h-[50px] bg-[#FCE4EC] hover:bg-pink-200"
              onClick={toggleIsYear}
            >
              {isYear ? year : "All Years"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={isYear ? monthsSummary : yearsSummary}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => 
                (isYear ? value.slice(0, 3) : value)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="orders"
              type="natural"
              stroke="var(--color-orders)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-orders)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
};
