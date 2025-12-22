"use client";

import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopCustomersTableProps {
  customers: Array<{
    id: string;
    name: string;
    email: string;
    orderCount: number;
    totalSpent: number;
  }>;
}

export function TopCustomersTable({ customers }: TopCustomersTableProps) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No customer data available
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead className="text-right">Orders</TableHead>
          <TableHead className="text-right">Total Spent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {customer.name}
                    {customer.totalSpent > 1000 && (
                      <Badge variant="secondary" className="text-xs">
                        VIP
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {customer.email}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right">{customer.orderCount}</TableCell>
            <TableCell className="text-right font-medium">
              {formatPrice(customer.totalSpent)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
