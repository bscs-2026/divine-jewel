'use client';

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 15af650 (save all changes)
import { useState, useEffect } from 'react';
import * as React from "react";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Check, ChevronsUpDown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import MainLayout from '@/components/MainLayout';
<<<<<<< HEAD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
=======
import { useState } from 'react';
import * as React from "react";
import { Check, ChevronsUpDown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, YAxis } from "recharts"
=======
import { useState } from 'react';
import * as React from "react";
import { Check, ChevronsUpDown, TrendingUp } from "lucide-react"
<<<<<<< HEAD
import { Pie, PieChart } from "recharts";
>>>>>>> 4f42e46 (changes)
=======
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, YAxis } from "recharts"
>>>>>>> 82619f2 (sales subsystem UI)
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import MainLayout from '@/components/MainLayout';
import { Progress } from "@/components/ui/progress";
import {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 82619f2 (sales subsystem UI)
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
<<<<<<< HEAD
=======
>>>>>>> 4f42e46 (changes)
=======
>>>>>>> 82619f2 (sales subsystem UI)
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
<<<<<<< HEAD
>>>>>>> 9ec0840 (resolve conflict)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

=======
>>>>>>> 4f42e46 (changes)
=======
>>>>>>> 15af650 (save all changes)
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
<<<<<<< HEAD
<<<<<<< HEAD
import TotalSalesChart from './_components/TotalSalesChart';
import TopProducts from './_components/TopProducts';
import LocationSales from './_components/LocationSales';
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
  inCharge: string;
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
=======
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
<<<<<<< HEAD
<<<<<<< HEAD
      <div className="flex flex-col mx-8">
        <div className="mb-4">
>>>>>>> 9ec0840 (resolve conflict)
=======
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Sales, columns } from './columns';
import { DataTable } from './data-table';

const timePeriod = [
  {
    value: "overall",
    label: "Overall",
  },
  {
    value: "annually",
    label: "Annually",
  },
  {
    value: "monthly",
    label: "Monthly",
  },
  {
    value: "weekly",
    label: "Weekly",
  },
  {
    value: "daily",
    label: "Daily",
  },
];

const storeLocation = [
  {
    value: "all",
    label: "All Stores",
  },
  {
    value: "store1",
    label: "Store 1",
  },
  {
    value: "store2",
    label: "Store 2",
  },
  {
    value: "store3",
    label: "Store 3",
  },
]

const sales: Sales[] = [
  {
    id: "728ed52f",
    name: "Hello Kitty",
    category: "Bracelets",
    quantitySold: 10,
    totalSales: 100,
  },
  {
    id: "489e1d42",
    name: "Pikachu",
    category: "Earrings",
    quantitySold: 5,
    totalSales: 50,
  },
  {
    id: "f7e9a3d3",
    name: "Snoopy",
    category: "Necklaces",
    quantitySold: 3,
    totalSales: 30,
  },
  {
    id: "b4e0b1d4",
    name: "Doraemon",
    category: "Rings",
    quantitySold: 2,
    totalSales: 20,
  },
  {
    id: "b4e0b1d4",
    name: "Doraemon",
    category: "Rings",
    quantitySold: 2,
    totalSales: 20,
  },
];

const description = "An interactive bar chart"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 300, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const salesPerLocation = [
  { location: "ADDU", desktop: 186 },
  { location: "SPC", desktop: 305 },
  { location: "Gaisano Mall", desktop: 237 },
  { location: "SM - Ecoland", desktop: 73 },
  { location: "MCM", desktop: 209 },
  { location: "SM - GenSan", desktop: 214 },
]

const activeLocations = [
  { location: "ADDU", inCharge: "Divine Villanueva"},
  { location: "SPC", inCharge: "Adolfo Cedric"},
  { location: "Gaisano Mall", inCharge: "Pretty Faith"},
  { location: "SM - Ecoland", inCharge: "John Paul"},
  { location: "MCM", inCharge: "Lewis Leclerc"},
  { location: "SM - GenSan", inCharge: "Max Piquet"},
]

const topProducts = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

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
} satisfies ChartConfig

const barChartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Transactions",
    color: "#FCB6D7",
  },
} satisfies ChartConfig

const horizontalBarChartConfig = {
  desktop: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


export default function Home() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("overall");
  const [selectedStore, setSelectedStore] = useState("all");
  // for Interactive Bar Chart
  const [activeChart, setActiveChart] = React.useState<keyof typeof barChartConfig>("desktop");

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
    }),
    []
  )

  return (
    <MainLayout defaultTitle="Sales">
<<<<<<< HEAD
      <div className="flex flex-col mx-8">
        <div className="mb-4">
>>>>>>> 4f42e46 (changes)
=======
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
>>>>>>> 15af650 (save all changes)
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                className="w-[250px] h-[48px] justify-between bg-[#FCB6D7] rounded-xl hover:bg-[#FCE4EC]"
=======
                className="w-[200px] h-[48px] justify-between bg-[#FCE4EC] rounded-xl hover:bg-[#FCB6D7]"
>>>>>>> 9ec0840 (resolve conflict)
=======
                className="w-[200px] h-[48px] justify-between bg-[#FCE4EC] rounded-xl hover:bg-[#FCB6D7]"
>>>>>>> 4f42e46 (changes)
=======
                className="w-[250px] h-[48px] justify-between bg-[#FCB6D7] rounded-xl hover:bg-[#FCE4EC]"
>>>>>>> 15af650 (save all changes)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                          const newValue =
                            currentValue === value ? "" : currentValue;
                          setValue(newValue);
=======
                          setValue(currentValue === value ? "" : currentValue);
>>>>>>> 9ec0840 (resolve conflict)
=======
                          setValue(currentValue === value ? "" : currentValue);
>>>>>>> 4f42e46 (changes)
=======
                          const newValue =
                            currentValue === value ? "" : currentValue;
                          setValue(newValue);
>>>>>>> 15af650 (save all changes)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 15af650 (save all changes)
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
<<<<<<< HEAD
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
=======
        </div>
        <div className="flex flex-row justify-between ">
          <div className="bg-[#FCE4EC] w-[49%] h-72 rounded-2xl">
            <div className="flex flex-col m-4 h-64">
              <div className="font-extrabold text-2xl">Total Sales</div>
              <div className="grid grid-cols-2 grid-rows-2 gap-2 mt-2 ">
                <div>
                  <Card className=" text-xs">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-lg">Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <p>₱200,000.00</p>
                    </CardContent>
                    <CardFooter className="text-xs">
                      <p>+17%</p>
                    </CardFooter>
                  </Card>
                </div>
                <div>
                  <Card className=" text-xs">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-lg">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <p>₱200,000.00</p>
                    </CardContent>
                    <CardFooter className="text-xs">
                      <p>+17%</p>
                    </CardFooter>
                  </Card>
                </div>
                <div>
                  <Card className=" text-xs">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-lg">Profit</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <p>₱100,000.00</p>
                    </CardContent>
                    <CardFooter className="text-xs">
                      <p>+10%</p>
                    </CardFooter>
                  </Card>
                </div>
                <div>
                  <Card className=" text-xs">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-lg">Expenses</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <p>₱50,000.00</p>
                    </CardContent>
                    <CardFooter className="text-xs">
                      <p>-5%</p>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#FCE4EC] w-[49%] h-72 rounded-2xl">
            <div className="flex flex-col m-4 h-full">
              <div className="font-extrabold text-2xl">Payment</div>
              <div className="flex flex-col mt-2 flex-grow gap-2 mb-8">
                <div className="bg-white rounded-lg w-full h-1/3 shadow-md">
                  <div className="m-2 flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                      <div className="font-bold">Cash</div>
                      <div className="text-md">₱200,000.00</div>
                    </div>
                    <div>
                      <Progress className="" value={50} />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg w-full h-1/3 shadow-md">
                  <div className="m-2 flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                      <div className="font-bold">Gcash</div>
                      <div className="text-md">₱200,000.00</div>
                    </div>
                    <div>
                      <Progress className="" value={33} />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg w-full h-1/3 shadow-md">
                  <div className="m-2 flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                      <div className="font-bold">Bank Transfer</div>
                      <div className="text-md">₱200,000.00</div>
                    </div>
                    <div>
                      <Progress className="" value={15} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#FCE4EC] mt-4 rounded-2xl h-[360px]">
          <div className="flex flex-col m-4">
            <div className="font-extrabold text-2xl mb-2">Top Products</div>
            <div className="flex flex-row justify-between gap-4">
              <div className='bg-white w-[70%] rounded-2xl'>
                <div className=" h-72 rounded-2xl ">
                  <DataTable columns={columns} data={sales} />
                </div>
              </div>
              <div className="w-[30%] h-72 text-sm bg-white rounded-2xl">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
=======
      <div className="mb-4 mx-7">
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
                        setValue(currentValue === value ? "" : currentValue);
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
      </div>
      <div className="flex flex-col gap-2 mx-8 ">
        <div className="bg-gray-100 w-full rounded-2xl">
<<<<<<< HEAD
          <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row ">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Total Sales</CardTitle>
                <CardDescription>
                  Showing total sales for the last 3 months
                </CardDescription>
              </div>
              <div className="flex">
                {["desktop"].map((key) => {
                  const chart = key as keyof typeof barChartConfig;
                  return (
                    <button
                      key={chart}
                      data-active={activeChart === chart}
                      className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                      onClick={() => setActiveChart(chart)}
                    >
                      <span className="text-xs text-muted-foreground">
                        {barChartConfig[chart].label}
                      </span>
                      <span className="text-lg font-bold leading-none sm:text-3xl">
                        {total[key as keyof typeof total].toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
              <ChartContainer
                config={barChartConfig}
                className="aspect-auto h-[250px] w-full"
              >
=======
      <div className="mb-4 mx-7">
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
                        setValue(currentValue === value ? "" : currentValue);
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
      </div>
      <div className="flex flex-col gap-2 mx-8 ">
        <div className="bg-gray-100 w-full rounded-2xl">
          <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row ">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                <CardTitle>Total Sales</CardTitle>
                <CardDescription>
                  Showing total sales for the last 3 months
                </CardDescription>
              </div>
              <div className="flex">
                {["desktop"].map((key) => {
                  const chart = key as keyof typeof barChartConfig;
                  return (
                    <button
                      key={chart}
                      data-active={activeChart === chart}
                      className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                      onClick={() => setActiveChart(chart)}
                    >
                      <span className="text-xs text-muted-foreground">
                        {barChartConfig[chart].label}
                      </span>
                      <span className="text-lg font-bold leading-none sm:text-3xl">
                        {total[key as keyof typeof total].toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
              <ChartContainer
                config={barChartConfig}
                className="aspect-auto h-[250px] w-full"
              >
>>>>>>> 82619f2 (sales subsystem UI)
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
<<<<<<< HEAD
>>>>>>> 01076dc (sales subsystem UI)
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey={activeChart}
                    fill={`var(--color-${activeChart})`}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
=======
          <TotalSalesChart 
            activeChart={activeChart} 
            setActiveChart={setActiveChart} 
=======
      </div>
      <div className="flex flex-col gap-2 mx-8 ">
        <div className="bg-gray-100 w-full rounded-2xl">
          <TotalSalesChart
            yearData={yearlyOrders}
            sales={sales}
            activeChart={activeChart}
            setActiveChart={setActiveChart}
>>>>>>> 15af650 (save all changes)
          />
>>>>>>> e3eab2c (transferred Sales Bar Chart from page.tsx  to TotalSalesChart.tsx component)
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
>>>>>>> 9ec0840 (resolve conflict)
=======
        </div>
        <div className="flex flex-row justify-between ">
          <div className="bg-[#FCE4EC] w-[49%] h-72 rounded-2xl">
            <div className="flex flex-col m-4 h-64">
              <div className="font-extrabold text-2xl">Total Sales</div>
              <div className="grid grid-cols-2 grid-rows-2 gap-2 mt-2 ">
                <div>
                  <Card className=" text-xs">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-lg">Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <p>₱200,000.00</p>
                    </CardContent>
                    <CardFooter className="text-xs">
                      <p>+17%</p>
                    </CardFooter>
                  </Card>
                </div>
                <div>
                  <Card className=" text-xs">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-lg">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <p>₱200,000.00</p>
                    </CardContent>
                    <CardFooter className="text-xs">
                      <p>+17%</p>
                    </CardFooter>
                  </Card>
                </div>
                <div>
                  <Card className=" text-xs">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-lg">Profit</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <p>₱100,000.00</p>
                    </CardContent>
                    <CardFooter className="text-xs">
                      <p>+10%</p>
                    </CardFooter>
                  </Card>
                </div>
                <div>
                  <Card className=" text-xs">
                    <CardHeader className="pb-1">
                      <CardTitle className="text-lg">Expenses</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-1">
                      <p>₱50,000.00</p>
                    </CardContent>
                    <CardFooter className="text-xs">
                      <p>-5%</p>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#FCE4EC] w-[49%] h-72 rounded-2xl">
            <div className="flex flex-col m-4 h-full">
              <div className="font-extrabold text-2xl">Payment</div>
              <div className="flex flex-col mt-2 flex-grow gap-2 mb-8">
                <div className="bg-white rounded-lg w-full h-1/3 shadow-md">
                  <div className="m-2 flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                      <div className="font-bold">Cash</div>
                      <div className="text-md">₱200,000.00</div>
                    </div>
                    <div>
                      <Progress className="" value={50} />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg w-full h-1/3 shadow-md">
                  <div className="m-2 flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                      <div className="font-bold">Gcash</div>
                      <div className="text-md">₱200,000.00</div>
                    </div>
                    <div>
                      <Progress className="" value={33} />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg w-full h-1/3 shadow-md">
                  <div className="m-2 flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                      <div className="font-bold">Bank Transfer</div>
                      <div className="text-md">₱200,000.00</div>
                    </div>
                    <div>
                      <Progress className="" value={15} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#FCE4EC] mt-4 rounded-2xl h-[360px]">
          <div className="flex flex-col m-4">
            <div className="font-extrabold text-2xl mb-2">Top Products</div>
            <div className="flex flex-row justify-between gap-4">
              <div className='bg-white w-[70%] rounded-2xl'>
                <div className=" h-72 rounded-2xl ">
                  <DataTable columns={columns} data={sales} />
                </div>
              </div>
              <div className="w-[30%] h-72 text-sm bg-white rounded-2xl">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
=======
>>>>>>> 82619f2 (sales subsystem UI)
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey={activeChart}
                    fill={`var(--color-${activeChart})`}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="bg-white h-[430px] shadow-md w-full rounded-2xl flex flex-col border border-gray-200">
          <div className="flex flex-row">
            <div className="m-4 font-extrabold text-xl">Top Products</div>
            <div className='m-3'>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">SPC</SelectItem>
                <SelectItem value="dark">MCM</SelectItem>
                <SelectItem value="system">ADDU</SelectItem>
              </SelectContent>
            </Select>
            </div>
            <div className='m-3'>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Bracelet</SelectItem>
                <SelectItem value="dark">Pins</SelectItem>
                <SelectItem value="system">Necklaces</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
          <div className="mx-4 gap-2 flex flex-row mb-2">
            <div className="w-2/3">
              <div className="bg-white rounded-xl h-[350px]">
                <DataTable columns={columns} data={sales} />
              </div>
            </div>
            <div className="w-1/3">
              <Card className="flex flex-col h-[350px]">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={pieChartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={topProducts}
                        dataKey="visitors"
                        nameKey="browser"
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm mb-2">
                  <div className="leading-none text-muted-foreground">
                    Top products for the last 6 months
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 mb-4">
          <div className="flex flex-col bg-white h-auto w-1/3 rounded-2xl shadow-md border border-gray-200 ">
            <div className="m-4 font-extrabold text-xl">Active Locations</div>
            <div className="mx-4">
              <Table>
                <TableCaption>A list of your Active Locations.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Location</TableHead>
                    <TableHead className="">In Charge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeLocations.map((location, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {location.location}
                      </TableCell>
                      <TableCell className="">{location.inCharge}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className=" w-2/3">
            <Card className="">
              <CardHeader>
                <CardTitle className='text-xl'>Sales per Location</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={horizontalBarChartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={salesPerLocation}
                    layout="vertical"
                    // margin={{
                    //   left: 10,
                    // }}
                  >
                    <XAxis type="number" dataKey="desktop" hide />
                    <YAxis
                      dataKey="location"
                      type="category"
                      tickLine={false}
                      tickMargin={5}
                      axisLine={false}
                      // tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="desktop"
                      fill="#FCE4EC"
                      radius={5}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
>>>>>>> 4f42e46 (changes)
    </MainLayout>
  );
}