'use client';

import { useState } from 'react';
import * as React from "react";
import { Check, ChevronsUpDown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import MainLayout from '@/components/MainLayout';
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
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
import { Sales, columns } from './columns';
import { DataTable } from './data-table';
import TotalSalesChart from './_components/TotalSalesChart';
import TopProducts from './_components/TopProducts';
import LocationSales from './_components/LocationSales';

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

const barChartConfig = {
  sales: {
    label: "Sales",
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
  const [activeChart, setActiveChart] = React.useState<keyof typeof barChartConfig>("sales");

  return (
    <MainLayout defaultTitle="Sales">
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
          <TotalSalesChart 
            activeChart={activeChart} 
            setActiveChart={setActiveChart} 
          />
        </div>
        <div>
          <TopProducts />
        </div>
        <div>
          <LocationSales />
        </div>
      </div>
    </MainLayout>
  );
}
