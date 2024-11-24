'use client';

import { useState, useEffect } from 'react';
import * as React from "react";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Check, ChevronsUpDown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import MainLayout from '@/components/MainLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import TotalSalesChart from './_components/TotalSalesChart';
import TopProducts from './_components/TopProducts';
import LocationSales from './_components/ActiveBranches';
import { months } from '@/lib/constants';
import BranchSalesPieChart from './_components/BranchSalesPieChart';
import { OrdersSummary } from './_components/OrdersSummary';
import ActiveBranches from './_components/ActiveBranches';
import Spinner from '@/components/loading/Loading';
import { fi, se } from 'date-fns/locale';

interface Sales {
  order_date: string;
  order_count: number;
}

interface YearsData {
  year: string;
  yearly_orders: number;
}

interface Branches {
  branch_name: string;
  address_line: string;
  branch_code: number;
  order_count: number;
  inCharge: string;
}

export interface BranchesOrders {
  branch_name: string;
  branch_code: number;
  orders_count: number;
  orders_date: string;
}

const barChartConfig = {
  sales: {
    label: "Sales",
    color: "#FCB6D7",
  },
} satisfies ChartConfig

export default function Home() {
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = months[new Date().getMonth()].name;

  const [yearlyOrders, setYearlyOrders] = useState<YearsData[]>([]);
  const [years, setYears] = useState<YearsData[]>([]);
  const [year, setYear] = useState<string>(currentYear);
  const [month, setMonth] = useState<string>(currentMonth);
  const [sales, setSales] = useState<Sales[]>([]);
  const [branches, setBranches] = useState<Branches[]>([]);
  const [branchesOrders, setBranchesOrders] = useState<BranchesOrders[]>([]);
  const [activeChart, setActiveChart] = useState<keyof typeof barChartConfig>("sales");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchBranchesData();
    fetchYears();
  }, []);

  useEffect(() => {
    fetchSales();
    fetchYearlyOrders();
  }, [year, month]);

  const fetchYearlyOrders = async () => {
    const url = `/api/sales/yearlyOrders?year=${year}`;
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch yearly orders data");
      }
      const data = await response.json();
      setYearlyOrders(data.YearlyOrders);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    const monthValue = months.find(m => m.name === month)?.value;
    const date = `${year}-${monthValue}`;
    const url = `/api/sales?date=${date}`;
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      const data = await response.json();
      setSales(data.Orders);
    } catch (error: any) {
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
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchYears = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sales/years');
      if (!response.ok) {
        throw new Error('Failed to fetch years');
      }
      const data = await response.json();
      setYears(data.Years);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout defaultTitle="Sales Dashboard">
      {loading && <Spinner />}
      <div className="mb-4 mx-7 flex flex-row gap-2">
        <div className="flex flex-row gap-2 m-1">
          <div>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[180px] h-[50px] ">
                <SelectValue placeholder="Year">{year}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {years.map((year, index) => {
                  return (
                    <SelectItem key={index} value={year.year}>
                      {year.year}
                    </SelectItem>
                  )
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
      <div className="flex flex-col gap-2 mx-8 ">
        <div className="bg-gray-100 w-full rounded-2xl">
          <TotalSalesChart
            yearData={yearlyOrders}
            sales={sales}
            activeChart={activeChart}
            setActiveChart={setActiveChart}
            loading={loading}
          />
        </div>
        <div className='flex flex-row gap-2 h-auto'>
          <div className='w-2/3'>
            <TopProducts
              branches={branches}
              year={year}
              month={month}
            />
          </div>
          <div className='w-1/3 '>
              <BranchSalesPieChart 
                year={year}
                month={month}
              />
          </div>
        </div>
        <div className='flex flex-row gap-2 mb-4'>
          <div className='w-1/2'>
            <ActiveBranches
              branches={branches}
            />
          </div>
          <div className='w-1/2'>
            <OrdersSummary 
              year={year}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}