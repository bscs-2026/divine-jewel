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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { columns } from './columns';
import { DataTable } from './data-table';
import TotalSalesChart from './_components/TotalSalesChart';
import TopProducts from './_components/TopProducts';
import LocationSales from './_components/LocationSales';
import { Calendar } from '@/components/ui/calendar';
import { months } from '@/lib/constants';

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
  const [activeChart, setActiveChart] = useState<keyof typeof barChartConfig>("sales");

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
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch yearly orders data");
      }
      const data = await response.json();
      setYearlyOrders(data.YearlyOrders);
      console.log("Total Order:", data.YearlyOrders);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchSales = async () => {
    const monthValue = months.find(m => m.name === month)?.value;
    const date = `${year}-${monthValue}`;
    const url = `/api/sales?date=${date}`;
    console.log(date);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      const data = await response.json();
      setSales(data.Orders);
    } catch (error: any) {
      console.error(error.message);
    }
  };
  
  const fetchBranchesData = async () => {
    try {
      const response = await fetch("/api/sales/branches");
      if (!response.ok) {
        throw new Error("Failed to fetch branches data");
      }
      const data = await response.json();
      setBranches(data.branches);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  const fetchYears = async () => {
    try {
      const response = await fetch('/api/sales/years');
      if (!response.ok) {
        throw new Error('Failed to fetch years');
      }
      const data = await response.json();
      setYears(data.Years);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <MainLayout defaultTitle="Sales">
      <div className="mb-4 mx-7 flex flex-row gap-2">
        <div className="flex flex-row gap-2 m-1">
          <div>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[180px] h-[40px] ">
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
              <SelectTrigger className="w-[180px] h-[40px]">
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
        {/* <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[250px] h-[48px] justify-between bg-[#FCB6D7] rounded-xl hover:bg-[#FCE4EC]"
              >
                {value
                  ? timePeriod.find((period) => period.value === value)?.label
                  : "Select Time Period"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {timePeriod.map((period) => (
                      <CommandItem
                        key={period.value}
                        value={period.value}
                        onSelect={(currentValue) => {
                          const newValue =
                            currentValue === value ? "" : currentValue;
                          setValue(newValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === period.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {period.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div> */}
        {/* <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div> */}
      </div>
      <div className="flex flex-col gap-2 mx-8 ">
        <div className="bg-gray-100 w-full rounded-2xl">
          <TotalSalesChart
            yearData={yearlyOrders}
            sales={sales}
            activeChart={activeChart}
            setActiveChart={setActiveChart}
          />
        </div>
        <div>
          <TopProducts 
            branches={branches}
          />
        </div>
        <div>
          <LocationSales branches={branches} />
        </div>
      </div>
    </MainLayout>
  );
}