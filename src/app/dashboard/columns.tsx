"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from 'lucide-react'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface TopProducts {
  product_name: string;
  category_name: string;
  total_quantity_sold: number;
  total_sales: number;
}


export const columns: ColumnDef<TopProducts>[] = [
  {
    accessorKey: "product_name",
    header: () => <div className="font-bold">Name</div>,
    
  },
  {
    accessorKey: "category_name",
    header: () => <div className="font-bold">Category</div>,
  },
  {
    accessorKey: "total_quantity_sold",
    header: () => <div className="font-bold text-right pr-2">Quantity Sold</div>,
    cell: ({ row }) => {
      const count = row.getValue("total_quantity_sold") as number;
      return <div className="text-right pr-2">{count}</div>;
    },
  },
  {
    accessorKey: "total_sales",
    header: () => <div className="font-bold text-right pr-2">Total Sales</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_sales"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);
      return <div className="text-right pr-2">{formatted}</div>;
    },
  },
]
