'use client';

import { useState, useEffect } from 'react';
import * as React from "react";
import MainLayout from '@/components/MainLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from '@/components/loading/Loading';
import TotalSalesChart from './_components/TotalSalesChart';
import TotalOrdersChart from './_components/TotalOrdersChart';
import TopProducts from './_components/TopProducts';
import BranchSalesPieChart from './_components/BranchSalesPieChart';
import { OrdersSummary } from './_components/OrdersSummary';
import ActiveBranches from './_components/ActiveBranches';
import { months } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Sales {
  sales_date: string;
  total_sales: number;
}

interface Orders {
  order_date: string;
  order_count: number;
}

interface Returns {
  returns_date: string;
  total_returns: number;
}

interface YearsData {
  year: string;
}

interface Branches {
  branch_name: string;
  address_line: string;
  branch_code: number;
  order_count: number;
  inCharge: string;
}

const barChartConfig = {
  sales: {
    label: "Sales",
    color: "#4C96D7",
  },
  orders: {
    label: "Orders",
    color: "#D77E4C",
  },
} satisfies ChartConfig;

export default function Home() {
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = months[new Date().getMonth()].name;

  const [years, setYears] = useState<YearsData[]>([]);
  const [year, setYear] = useState<string>(currentYear);
  const [month, setMonth] = useState<string>(currentMonth);

  const [totalSalesValue, setTotalSalesValue] = useState<number | null>(null);
  const [totalOrdersValue, setTotalOrdersValue] = useState<number | null>(null);
  const [totalReturnsValue, setTotalReturnsValue] = useState<number | null>(null);
  const [branches, setBranches] = useState<Branches[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTotalSales();
    fetchTotalOrders();
    fetchTotalReturns();
    fetchBranchesData();
    fetchYears();
  }, []);

  useEffect(() => {
    fetchYears();
  }, [year]);

  useEffect(() => {
    fetchTotalReturns();
  }, [year, month]);

  const fetchTotalSales = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/sales/totalSales");
      if (!response.ok) {
        throw new Error("Failed to fetch total sales value");
      }
      const data = await response.json();
      setTotalSalesValue(parseFloat(data.totalSales));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/orders/totalOrders");
      if (!response.ok) {
        throw new Error("Failed to fetch total orders value");
      }
      const data = await response.json();
      setTotalOrdersValue(parseFloat(data.totalOrders));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch total returns
  const fetchTotalReturns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/returns/totalReturns?year=${year}`);
      if (!response.ok) {
        throw new Error("Failed to fetch total returns value");
      }
      const data = await response.json();
      setTotalReturnsValue(parseFloat(data.totalReturns));
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchesData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sales/branches");
      if (!response.ok) {
        throw new Error("Failed to fetch branches data");
      }
      const data = await response.json();
      setBranches(data.branches);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchYears = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sales/years");
      if (!response.ok) {
        throw new Error("Failed to fetch years");
      }
      const data = await response.json();
      setYears(data.Years);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout defaultTitle="Dashboard">
      {loading && <Spinner />}
      {/* Combined Total Sales, Orders Card and Selectors */}
      <div className="mb-4 mx-7 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Card
            className="relative z-30 flex flex-col justify-center gap-1 border-t px-4 py-3 text-left border-l-[1px] border-[#CCCCCC] bg-[#FCE4EC] sm:border-l sm:border-t-0 sm:px-6 sm:py-4 w-[160px] h-[80px]"
          >
            <CardHeader className="flex flex-col">
              <span className="text-xs text-muted-foreground">Total Sales</span>
              <span className="text-md font-bold leading-none sm:text-md text-[#575757]">
                {totalSalesValue !== null ? `₱${totalSalesValue.toFixed(2)}` : "0.00"}
              </span>
            </CardHeader>
          </Card>

          <Card
            className="relative z-30 flex flex-col justify-center gap-1 border-t px-4 py-3 text-left border-l-[1px] border-[#CCCCCC] bg-[#FCE4EC] sm:border-l sm:border-t-0 sm:px-6 sm:py-4 w-[160px] h-[80px]"
          >
            <CardHeader className="flex flex-col">
              <span className="text-xs text-muted-foreground">Total Orders</span>
              <span className="text-md font-bold leading-none sm:text-md text-[#575757]">
                {totalOrdersValue !== null ? `${totalOrdersValue.toFixed(0)}` : "0"}
              </span>
            </CardHeader>
          </Card>

          {/* New Card for Total Returns */}
          <Card
            className="relative z-30 flex flex-col justify-center gap-1 border-t px-4 py-3 text-left border-l-[1px] border-[#CCCCCC] bg-[#FCE4EC] sm:border-l sm:border-t-0 sm:px-6 sm:py-4 w-[160px] h-[80px]"
          >
            <CardHeader className="flex flex-col">
              <span className="text-xs text-muted-foreground">Total Returns</span>
              <span className="text-md font-bold leading-none sm:text-md text-[#575757]">
                {totalReturnsValue !== null ? `${totalReturnsValue.toFixed(0)}` : "0"}
              </span>
            </CardHeader>
          </Card>
        </div>

        {/* Year and Month Selectors */}
        <div className="flex flex-row gap-2">
          <div>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[180px] h-[50px]">
                <SelectValue placeholder="Year">{year}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {years.map((year, index) => {
                  return (
                    <SelectItem key={index} value={year.year}>
                      {year.year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[180px] h-[50px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => {
                  return (
                    <SelectItem key={month.value} value={month.name}>
                      {month.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex flex-col gap-2 mx-8">
        <div className="w-full rounded-2xl">
          {/* Sales and Orders Charts */}
          <div className="flex flex-row gap-4 w-full">
            <div className="flex-1">
              <TotalSalesChart year={year} month={month} loading={loading} />
            </div>
            <div className="flex-1">
              <TotalOrdersChart
                year={year}
                month={month}
                loading={loading}
                totalReturnsValue={totalReturnsValue}
              />
            </div>
          </div>
        </div>

        {/* Other components */}
        <div className="flex flex-row gap-2 h-auto">
          <div className="w-2/3">
            <TopProducts branches={branches} year={year} month={month} />
          </div>
          <div className="w-1/3">
            <BranchSalesPieChart year={year} month={month} />
          </div>
        </div>
        <div className="flex flex-row gap-4 w-full">
          <div className="flex-1">
            <ActiveBranches branches={branches} />
          </div>
          {/* <div className="w-1/2">
            <OrdersSummary year={year} />
          </div> */}
        </div>
      </div>
    </MainLayout>
  );
}
