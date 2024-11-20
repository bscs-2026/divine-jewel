import React, { FC, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { DataTable } from "../data-table";
import { columns } from "../columns";
import { Pie, PieChart } from "recharts";

const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const topProducts = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Branches {
  branch_name: string;
  address_line: string;
  branch_code: number;
  order_count: number;
}

interface TopProducts {
  product_name: string;
  category_name: string;
  total_quantity_sold: number;
  total_sales: number;
}

interface BranchesSalesProps {
  branches: Branches[];
}

const TopProducts: FC<BranchesSalesProps> = ({ branches }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topProducts, setTopProducts] = useState<TopProducts[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("allCategories");
  const [selectedBranch, setSelectedBranch] = useState<string>("allBranches");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTopProduct();
  }, [selectedCategory, selectedBranch]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/products/category");
      const data = await response.json();
      setCategories(data.categories);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchTopProduct = async () => {
    try {
      const response = await fetch(
        `/api/sales/topproducts?category=${selectedCategory}&branch=${selectedBranch}`
      );
      const data = await response.json();
      setTopProducts(data.TopProducts);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="bg-white h-full shadow-md w-full rounded-2xl flex flex-col border border-gray-200">
      <div className="flex flex-row">
        <div className="m-4 font-extrabold text-xl">Top Products</div>
        <div className="m-3">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allBranches">All Branches</SelectItem>
              {branches.map((branch, index) => {
                return (
                  <SelectItem key={index} value={branch.branch_code.toString()}>
                    {branch.branch_name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="m-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allCategories">All Categories</SelectItem>
              {categories.map((category, index) => {
                return (
                  <SelectItem key={index} value={category.name}>
                    {category.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {/* <div className="m-3">
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yearBased">Selected Year</SelectItem>
              <SelectItem value="monthBased">Selected Month</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>
      <div className="mx-4 gap-2 flex flex-row mb-2">
        <div className="w-full">
          <div className="bg-white rounded-xl h-[350px]">
            <DataTable columns={columns} data={topProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
