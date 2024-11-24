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
import { Button } from "@/components/ui/button";
import { months } from "@/lib/constants";

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
  year: string;
  month: string;
}

const TopProducts: FC<BranchesSalesProps> = ({ branches, year, month }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topProducts, setTopProducts] = useState<TopProducts[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("allCategories");
  const [selectedBranch, setSelectedBranch] = useState<string>("allBranches");
  const [isMonth, setIsMonth] = useState<boolean>(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTopProduct(isMonth);
  }, [selectedCategory, selectedBranch, isMonth, month, year]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/products/category");
      const data = await response.json();
      setCategories(data.categories);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchTopProduct = async (isMonth: boolean) => {
    let url;
    if (isMonth) {
      const monthValue = months.find((m) => m.name === month)?.value;
      const date = `${year}-${monthValue}`;
      url = `/api/sales/topproducts?category=${selectedCategory}&branch=${selectedBranch}&date=${date}`;
    } else {
      url = `/api/sales/topproducts?category=${selectedCategory}&branch=${selectedBranch}&year=${year}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setTopProducts(data.TopProducts);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const toggleIsMonth = () => {
    setIsMonth((prevIsMonth) => !prevIsMonth);
  }

  return (
    <div className="bg-white h-full shadow-md w-full rounded-2xl flex flex-col border border-gray-200">
      <div className="mt-4 ml-4 font-extrabold text-xl">Top Products</div>
      <div className="flex flex-row gap-3 m-4 ">  
        <div className="">
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
        <div className="">
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
        <div className="">
        <Button
            className="text-sm text-gray-700 p-2 w-[150px] bg-[#FCE4EC] hover:bg-pink-200"
            onClick={toggleIsMonth}
          >
            {isMonth ? month : year}
          </Button>
        </div>
      </div>
      <div className="mx-4 gap-2 flex flex-row mb-2">
        <div className="w-full h-auto">
          <div className="bg-white rounded-xl">
            <DataTable columns={columns} data={topProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
