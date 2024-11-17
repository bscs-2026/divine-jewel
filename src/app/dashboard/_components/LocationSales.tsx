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

interface Branches {
  branch_name: string;
  address_line: string;
  branch_code: number;
  order_count: number;
  inCharge: string;
}

interface BranchesSalesProps {
  branches: Branches[];
}

const LocationSales: FC<BranchesSalesProps> = ({ branches }) => {
  const activeBranches = branches.map((branch) => ({
    branch: branch.branch_name,
    location: branch.address_line,
    sales: branch.order_count,
  }));

  return (
    <div className="flex gap-2 mb-4">
      {/* Active Branches Table */}
      <div className="flex flex-col bg-white w-1/3 rounded-2xl shadow-md border border-gray-200">
        <div className="m-4 font-extrabold text-xl">Active Branches</div>
        <div className="mx-4 overflow-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-md">Branch</TableHead>
                <TableHead className="text-md">In Charge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {branch.branch_name}
                  </TableCell>
                  <TableCell className="text-xs">
                    {branch.inCharge || <p className="text-gray-400">No Person Assigned</p>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Sales per Branch Card */}
      <div className="w-2/3 flex-1">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-xl font-bold text-gray-600">
              Sales per Branch
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-x-hidden overflow-y-auto flex-1">
            <ChartContainer
              config={horizontalBarChartConfig}
              className="h-full w-full"
            >
              <BarChart
                data={activeBranches}
                layout="vertical"
                className="h-full w-full"
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
  );
};

export default LocationSales;
