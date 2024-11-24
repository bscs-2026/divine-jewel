"use client"

import { Button } from "@/components/ui/button";
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
    header: () => <div className="font-bold w-40">Name</div>,
    cell: ({ row }) => <div className="w-40">{row.getValue("product_name")}</div>,
  },
  {
    accessorKey: "category_name",
    header: () => <div className="font-bold w-40">Category</div>,
    cell: ({ row }) => <div className="w-40">{row.getValue("category_name")}</div>,
  },
  {
    accessorKey: "total_quantity_sold",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-bold w-40 flex justify-end"
        >
          <span className="flex items-center">
            Quantity Sold <ArrowUpDown className="ml-2 h-4 w-4" />
          </span>
        </button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("total_quantity_sold") as number;
      return <div className="w-40 text-right pr-2">{count}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "total_sales",
    header: () => (
      <div className="font-bold w-40 flex justify-end">Gross Sales</div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_sales"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);
      return <div className="w-40 text-right pr-2">{formatted}</div>;
    },
  },
]
