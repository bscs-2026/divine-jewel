import React, { FC, useEffect } from "react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, XAxis, YAxis, Bar } from "recharts";

const horizontalBarChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const salesPerLocation = [
  { branch: "Location 1", sales: 1000 },
  { branch: "Location 2", sales: 2000 },
  { branch: "Location 3", sales: 3000 },
  // Add more sales data as needed
];

interface Branches {
  branch_name: string;
  address_line: string;
  branch_code: number;
  order_count: number;
}

interface BranchesSalesProps {
  branches: Branches[];
}

const LocationSales: FC<BranchesSalesProps> = ({ branches }) => {

  const activeBranches =  branches.map((branch) => ({
      branch: branch.branch_name,
      location: branch.address_line,
      sales: branch.order_count,
    })
  );

  return (
    <div className="flex flex-row gap-2 mb-4 h-[530px]">
      <div className="flex flex-col bg-white h-[522px] w-1/3 rounded-2xl shadow-md border border-gray-200 ">
        <div className="m-4 font-extrabold text-xl">Active Branches</div>
        <div className="mx-4 overflow-auto">
          <Table>
            {/* <TableCaption>A list of your Active Branches.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="text-md">Branch</TableHead>
                <TableHead className="text-md" >Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch, index) => (
                <TableRow key = {index}>
                  <TableCell className="font-medium">{branch.branch_name}</TableCell>
                  <TableCell className="text-xs">{branch.address_line}</TableCell>
                </TableRow>
              ))}
              {/* {activeLocations.map((branch, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {branch.branch}
                  </TableCell>
                  <TableCell className="">{branch.location}</TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className=" w-2/3 ">
        <div className="">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-600">Sales per Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={horizontalBarChartConfig}>
                <BarChart
                  accessibilityLayer
                  data={activeBranches}
                  layout="vertical"
                >
                  <XAxis type="number" dataKey="sales" hide />
                  <YAxis
                    dataKey="branch"
                    type="category"
                    tickLine={false}
                    tickMargin={5}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="sales" fill="#FCE4EC" radius={5} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocationSales;
