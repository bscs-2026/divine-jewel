'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import MainLayout from '@/components/MainLayout';
import { Progress } from "@/components/ui/progress";
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

export const sales: Sales[] = [
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
];

export const description = "A simple pie chart"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
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


export default function Home() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("overall");

  return (
    <MainLayout defaultTitle="Sales">
      <div className="flex flex-col mx-8">
        <div className="mb-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] h-[48px] justify-between bg-[#FCE4EC] rounded-xl hover:bg-[#FCB6D7]"
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
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="visitors"
                      nameKey="browser"
                    />
                  </PieChart>
                </ChartContainer>
                <div className="flex flex-col items-center justify-between">
                  <div className="font-extrabold">
                    Trending up by 5.2% this month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}