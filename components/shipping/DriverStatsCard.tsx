"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Package, Truck } from "lucide-react";

interface DriverStatsCardProps {
  driver: {
    id: string;
    fullName: string;
    photoUrl: string | null;
    vehicleType: string;
    rating: number | null;
    totalDeliveries: number;
    activeDeliveries: number;
    isAvailable: boolean;
  };
}

export function DriverStatsCard({ driver }: DriverStatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Photo */}
          <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative flex-shrink-0">
            {driver.photoUrl ? (
              <Image
                src={driver.photoUrl}
                alt={driver.fullName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-medium">
                {driver.fullName.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-medium truncate">{driver.fullName}</h4>
              {driver.isAvailable && (
                <Badge variant="outline" className="text-xs">
                  Available
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 mt-1">
              <Truck className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{driver.vehicleType}</span>
            </div>

            <div className="flex items-center gap-3 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{driver.rating ? driver.rating.toFixed(1) : "N/A"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3 text-muted-foreground" />
                <span>{driver.totalDeliveries}</span>
              </div>
              {driver.activeDeliveries > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {driver.activeDeliveries} active
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
