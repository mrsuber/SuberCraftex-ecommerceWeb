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
  Wrench,
  Star,
  User,
} from "lucide-react";

interface Technician {
  id: string;
  employeeId: string | null;
  fullName: string;
  phone: string | null;
  photoUrl: string | null;
  specializations: string[];
  certifications: string[];
  isActive: boolean;
  hireDate: string;
  totalRepairs: number;
  completedRepairs: number;
  pendingRepairs: number;
  averageRating: number | null;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

interface TechniciansTableProps {
  technicians: Technician[];
}

const specializationLabels: Record<string, string> = {
  phones: "Phones",
  tablets: "Tablets",
  laptops: "Laptops",
  desktops: "Desktops",
  tvs: "TVs",
  gaming_consoles: "Gaming Consoles",
  audio_equipment: "Audio",
};

export function TechniciansTable({ technicians }: TechniciansTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] = useState<string>("all");

  const filteredTechnicians = technicians.filter((technician) => {
    const matchesSearch =
      technician.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      technician.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (technician.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && technician.isActive) ||
      (statusFilter === "inactive" && !technician.isActive);

    const matchesSpecialization =
      specializationFilter === "all" ||
      technician.specializations.includes(specializationFilter);

    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  if (technicians.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No technicians found.</p>
          <Link href="/dashboard/technicians/new">
            <Button className="mt-4">Add First Technician</Button>
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
            placeholder="Search technicians..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            <SelectItem value="phones">Phones</SelectItem>
            <SelectItem value="tablets">Tablets</SelectItem>
            <SelectItem value="laptops">Laptops</SelectItem>
            <SelectItem value="desktops">Desktops</SelectItem>
            <SelectItem value="tvs">TVs</SelectItem>
            <SelectItem value="gaming_consoles">Gaming Consoles</SelectItem>
            <SelectItem value="audio_equipment">Audio Equipment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Specializations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Repairs</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.map((technician) => (
                <TableRow key={technician.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={technician.photoUrl || technician.user.avatarUrl || undefined}
                        />
                        <AvatarFallback>
                          {technician.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{technician.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {technician.employeeId || technician.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {technician.specializations.slice(0, 3).map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {specializationLabels[spec] || spec}
                        </Badge>
                      ))}
                      {technician.specializations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{technician.specializations.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={technician.isActive ? "default" : "secondary"}>
                      {technician.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {technician.completedRepairs}/{technician.totalRepairs}
                      </span>
                      {technician.pendingRepairs > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {technician.pendingRepairs} active
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {technician.averageRating !== null ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {technician.averageRating.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
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
                        <Link href={`/dashboard/technicians/${technician.id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/dashboard/technicians/${technician.id}?edit=true`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/repair-requests?technicianId=${technician.id}`}>
                          <DropdownMenuItem>
                            <Wrench className="mr-2 h-4 w-4" />
                            View Repairs
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
      {(searchQuery || statusFilter !== "all" || specializationFilter !== "all") && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredTechnicians.length} of {technicians.length} technicians
        </p>
      )}
    </div>
  );
}
