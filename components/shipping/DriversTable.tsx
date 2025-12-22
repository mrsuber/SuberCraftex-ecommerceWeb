"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Star } from "lucide-react";

interface Driver {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  photoUrl: string | null;
  vehicleType: string;
  vehicleNumber: string;
  isActive: boolean;
  isAvailable: boolean;
  rating: number | null;
  totalDeliveries: number;
  activeDeliveries: number;
}

interface DriversTableProps {
  drivers: Driver[];
}

export function DriversTable({ drivers }: DriversTableProps) {
  const [search, setSearch] = useState("");

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.fullName.toLowerCase().includes(search.toLowerCase()) ||
      driver.phone.includes(search) ||
      driver.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Deliveries</TableHead>
              <TableHead className="text-right">Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No drivers found
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative">
                        {driver.photoUrl ? (
                          <Image
                            src={driver.photoUrl}
                            alt={driver.fullName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-medium">
                            {driver.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{driver.fullName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{driver.phone}</div>
                      <div className="text-muted-foreground">{driver.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{driver.vehicleType}</div>
                      <div className="text-muted-foreground">{driver.vehicleNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant={driver.isActive ? "default" : "secondary"}>
                        {driver.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {driver.isActive && (
                        <Badge variant={driver.isAvailable ? "outline" : "secondary"}>
                          {driver.isAvailable ? "Available" : "Busy"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {driver.rating ? driver.rating.toFixed(1) : "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{driver.totalDeliveries}</TableCell>
                  <TableCell className="text-right">{driver.activeDeliveries}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Driver</DropdownMenuItem>
                        <DropdownMenuItem>
                          {driver.isAvailable ? "Mark Unavailable" : "Mark Available"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Deliveries</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
