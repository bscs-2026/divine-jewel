import React, { FC, useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { months } from "@/lib/constants";

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

const ActiveBranches: FC<BranchesSalesProps> = ({ branches }) => {
  const [period, setPeriod] = useState<string>("monthPeriod");

  const activeBranches = branches.map((branch) => ({
    branch: branch.branch_name,
    location: branch.address_line,
    sales: branch.order_count,
  }));

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md border border-gray-200 h-full">
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
                  {branch.inCharge || (
                    <p className="text-gray-400">No Person Assigned</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActiveBranches;
