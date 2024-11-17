"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Sales = {
    id: string
    name: string
    category: string
    quantitySold: number
    totalSales: number
}

export const columns: ColumnDef<Sales>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "quantitySold",
    header: "Quantity Sold",
  },
  {
    accessorKey: "totalSales",
    header: "Total Sales",
  },
]
