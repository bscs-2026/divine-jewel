import React from "react";
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

const activeLocations = [
  { location: "Location 1", inCharge: "Person A" },
  { location: "Location 2", inCharge: "Person B" },
  { location: "Location 3", inCharge: "Person C" },
  // Add more locations as needed
];

const horizontalBarChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const salesPerLocation = [
  { location: "Location 1", sales: 1000 },
  { location: "Location 2", sales: 2000 },
  { location: "Location 3", sales: 3000 },
  // Add more sales data as needed
];

const LocationSales: React.FC = () => {
  return (
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
            <CardTitle className="text-xl">Sales per Location</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={horizontalBarChartConfig}>
              <BarChart
                accessibilityLayer
                data={salesPerLocation}
                layout="vertical"
              >
                <XAxis type="number" dataKey="sales" hide />
                <YAxis
                  dataKey="location"
                  type="category"
                  tickLine={false}
                  tickMargin={5}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="sales" fill="#FCE4EC" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationSales;
