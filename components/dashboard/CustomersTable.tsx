"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Mail, Ban, Search, Shield, Truck, User } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Customer {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
  orderCount: number;
  totalSpent: number;
}

interface CustomersTableProps {
  customers: Customer[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const router = useRouter();

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangeRole = async (customerId: string, role: 'customer' | 'admin' | 'driver') => {
    if (!confirm(`Are you sure you want to change this user's role to ${role}?`)) return;

    setLoadingActions(prev => new Set(prev).add(customerId));

    try {
      const response = await fetch(`/api/admin/customers/${customerId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      toast.success(`User role updated to ${role}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(customerId);
        return newSet;
      });
    }
  };

  const handleSuspendAccount = async (customerId: string) => {
    if (!confirm('Are you sure you want to suspend this account?')) return;

    setLoadingActions(prev => new Set(prev).add(customerId));

    try {
      const response = await fetch(`/api/admin/customers/${customerId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspended: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to suspend account');
      }

      toast.success('Account suspended successfully');
      router.refresh();
    } catch (error) {
      console.error('Error suspending account:', error);
      toast.error('Failed to suspend account');
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(customerId);
        return newSet;
      });
    }
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No customers found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">
                      {customer.full_name || "Anonymous"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{customer.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.role === 'admin'
                          ? 'default'
                          : customer.role === 'driver'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {customer.role === 'admin' && <Shield className="mr-1 h-3 w-3" />}
                      {customer.role === 'driver' && <Truck className="mr-1 h-3 w-3" />}
                      {customer.role === 'customer' && <User className="mr-1 h-3 w-3" />}
                      {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {customer.phone || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{customer.orderCount}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={loadingActions.has(customer.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Shield className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(customer.id, 'customer')}
                              disabled={customer.role === 'customer'}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(customer.id, 'driver')}
                              disabled={customer.role === 'driver'}
                            >
                              <Truck className="mr-2 h-4 w-4" />
                              Delivery Agent
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleChangeRole(customer.id, 'admin')}
                              disabled={customer.role === 'admin'}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Admin
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={() => handleSendEmail(customer.email)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleSuspendAccount(customer.id)}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredCustomers.length} of {customers.length} customers
        </p>
      )}
    </div>
  );
}
