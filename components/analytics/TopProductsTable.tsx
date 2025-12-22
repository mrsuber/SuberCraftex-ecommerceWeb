"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopProductsTableProps {
  products: Array<{
    id: string;
    name: string;
    sku: string;
    image: string | null;
    unitsSold: number;
    revenue: number;
  }>;
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No product data available
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Units Sold</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-muted rounded overflow-hidden relative">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      {index + 1}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {product.sku}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right">{product.unitsSold}</TableCell>
            <TableCell className="text-right font-medium">
              {formatPrice(product.revenue)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
