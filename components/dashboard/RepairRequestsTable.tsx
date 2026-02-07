"use client";

import { useState } from "react";
import Link from "next/link";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontal,
  Search,
  Eye,
  Wrench,
  Phone,
  Laptop,
  Tablet,
  Tv,
  Gamepad2,
  Speaker,
  Monitor,
  HelpCircle,
} from "lucide-react";

interface RepairRequest {
  id: string;
  ticketNumber: string;
  deviceType: string;
  brand: string;
  model: string;
  status: string;
  priority: string;
  createdAt: string;
  customer: {
    id: string;
    fullName: string | null;
    email: string;
    phone: string | null;
  };
  technician: {
    id: string;
    fullName: string;
    employeeId: string | null;
  } | null;
}

interface RepairRequestsTableProps {
  repairs: RepairRequest[];
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  received: "outline",
  diagnosing: "outline",
  diagnosed: "outline",
  quote_sent: "outline",
  quote_approved: "default",
  quote_rejected: "destructive",
  waiting_parts: "secondary",
  in_repair: "default",
  testing: "default",
  ready_for_pickup: "default",
  completed: "default",
  cancelled: "destructive",
};

const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "secondary",
  normal: "outline",
  high: "default",
  urgent: "destructive",
};

const deviceIcons: Record<string, React.ReactNode> = {
  phone: <Phone className="h-4 w-4" />,
  tablet: <Tablet className="h-4 w-4" />,
  laptop: <Laptop className="h-4 w-4" />,
  desktop: <Monitor className="h-4 w-4" />,
  tv: <Tv className="h-4 w-4" />,
  gaming_console: <Gamepad2 className="h-4 w-4" />,
  audio_equipment: <Speaker className="h-4 w-4" />,
  other: <HelpCircle className="h-4 w-4" />,
};

export function RepairRequestsTable({ repairs }: RepairRequestsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch =
      repair.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.customer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || repair.status === statusFilter;
    const matchesDeviceType = deviceTypeFilter === "all" || repair.deviceType === deviceTypeFilter;
    const matchesPriority = priorityFilter === "all" || repair.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesDeviceType && matchesPriority;
  });

  if (repairs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No repair requests found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repairs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="diagnosing">Diagnosing</SelectItem>
            <SelectItem value="diagnosed">Diagnosed</SelectItem>
            <SelectItem value="quote_sent">Quote Sent</SelectItem>
            <SelectItem value="quote_approved">Approved</SelectItem>
            <SelectItem value="in_repair">In Repair</SelectItem>
            <SelectItem value="ready_for_pickup">Ready</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deviceTypeFilter} onValueChange={setDeviceTypeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="tablet">Tablet</SelectItem>
            <SelectItem value="laptop">Laptop</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="tv">TV</SelectItem>
            <SelectItem value="gaming_console">Gaming Console</SelectItem>
            <SelectItem value="audio_equipment">Audio</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRepairs.map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell>
                    <div className="font-medium">{repair.ticketNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(repair.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {deviceIcons[repair.deviceType] || deviceIcons.other}
                      <div>
                        <div className="text-sm">{repair.brand}</div>
                        <div className="text-xs text-muted-foreground">
                          {repair.model}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {repair.customer.fullName || "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {repair.customer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[repair.status] || "outline"}>
                      {repair.status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {repair.technician ? (
                      <div className="text-sm">
                        {repair.technician.fullName}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Unassigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityColors[repair.priority] || "outline"}>
                      {repair.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/repair-requests/${repair.id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/dashboard/repair-requests/${repair.id}?action=manage`}>
                          <DropdownMenuItem>
                            <Wrench className="mr-2 h-4 w-4" />
                            Manage Repair
                          </DropdownMenuItem>
                        </Link>
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
      {(searchQuery || statusFilter !== "all" || deviceTypeFilter !== "all" || priorityFilter !== "all") && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredRepairs.length} of {repairs.length} repair requests
        </p>
      )}
    </div>
  );
}
