import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { DataTable } from '../data-table'
import { columns, Sales } from '../columns'
import { Pie, PieChart } from 'recharts'

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

  const topProducts = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
  ];

const TopProducts = () => {
  return (
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
  )
}

export default TopProducts