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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Search,
  Eye,
  Edit,
  ClipboardList,
  Award,
  User,
  Star,
} from "lucide-react";

interface Apprentice {
  id: string;
  apprenticeNumber: string;
  fullName: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  department: string;
  mentorId: string;
  mentorType: string;
  startDate: string;
  expectedEndDate: string | null;
  status: string;
  totalAssignments: number;
  completedAssignments: number;
  certificatesCount: number;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

interface ApprenticesTableProps {
  apprentices: Apprentice[];
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  active: "default",
  on_hold: "outline",
  completed: "default",
  terminated: "destructive",
};

const departmentLabels: Record<string, string> = {
  tailoring: "Tailoring",
  sales: "Sales",
  delivery: "Delivery",
  operations: "Operations",
};

export function ApprenticesTable({ apprentices }: ApprenticesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const filteredApprentices = apprentices.filter((apprentice) => {
    const matchesSearch =
      apprentice.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apprentice.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apprentice.apprenticeNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || apprentice.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || apprentice.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  if (apprentices.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No apprentices found.</p>
          <Link href="/dashboard/apprentices/new">
            <Button className="mt-4">Add First Apprentice</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search apprentices..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="tailoring">Tailoring</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="delivery">Delivery</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Apprentice</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApprentices.map((apprentice) => (
                <TableRow key={apprentice.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={apprentice.photoUrl || apprentice.user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {apprentice.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{apprentice.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {apprentice.apprenticeNumber}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {departmentLabels[apprentice.department] || apprentice.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[apprentice.status] || "outline"}>
                      {apprentice.status.replace("_", " ").charAt(0).toUpperCase() +
                        apprentice.status.replace("_", " ").slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm">
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {apprentice.completedAssignments}/{apprentice.totalAssignments}
                        </span>
                      </div>
                      {apprentice.certificatesCount > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span>{apprentice.certificatesCount}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(apprentice.startDate).toLocaleDateString()}
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
                        <Link href={`/dashboard/apprentices/${apprentice.id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/dashboard/apprentices/${apprentice.id}/edit`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/apprentices/${apprentice.id}/assignments`}>
                          <DropdownMenuItem>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Assignments
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/dashboard/apprentices/${apprentice.id}/certificates`}>
                          <DropdownMenuItem>
                            <Award className="mr-2 h-4 w-4" />
                            Certificates
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
      {(searchQuery || statusFilter !== "all" || departmentFilter !== "all") && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredApprentices.length} of {apprentices.length} apprentices
        </p>
      )}
    </div>
  );
}
