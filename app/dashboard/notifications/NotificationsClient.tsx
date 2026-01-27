"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  Loader2,
  Trash2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  referenceId?: string;
  referenceType?: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

const NOTIFICATION_TYPE_ICONS: Record<string, string> = {
  new_order: "🛒",
  order_paid: "💰",
  order_cancelled: "❌",
  new_booking: "📅",
  booking_confirmed: "✅",
  booking_cancelled: "🚫",
  new_deposit: "💵",
  deposit_confirmed: "✓",
  withdrawal_request: "💸",
  new_review: "⭐",
  new_feedback: "💬",
  low_stock: "📦",
  kyc_submitted: "🪪",
  quote_approved: "📝",
  system: "⚙️",
};

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  new_order: "New Order",
  order_paid: "Order Paid",
  order_cancelled: "Order Cancelled",
  new_booking: "New Booking",
  booking_confirmed: "Booking Confirmed",
  booking_cancelled: "Booking Cancelled",
  new_deposit: "New Deposit",
  deposit_confirmed: "Deposit Confirmed",
  withdrawal_request: "Withdrawal Request",
  new_review: "New Review",
  new_feedback: "New Feedback",
  low_stock: "Low Stock",
  kyc_submitted: "KYC Submitted",
  quote_approved: "Quote Approved",
  system: "System",
};

const PRIORITY_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  urgent: "destructive",
  high: "destructive",
  normal: "secondary",
  low: "outline",
};

export function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ limit: "100" });
      if (filter === "unread") {
        params.set("unreadOnly", "true");
      }
      const response = await fetch(`/api/notifications?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id
              ? { ...n, isRead: true, readAt: new Date().toISOString() }
              : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            isRead: true,
            readAt: new Date().toISOString(),
          }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    return true;
  });

  const uniqueTypes = Array.from(new Set(notifications.map((n) => n.type)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select
              value={filter}
              onValueChange={(v) => setFilter(v as "all" | "unread")}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {NOTIFICATION_TYPE_ICONS[type]}{" "}
                    {NOTIFICATION_TYPE_LABELS[type] || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            All Notifications
            {filteredNotifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filteredNotifications.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">
                {filter === "unread"
                  ? "All notifications have been read"
                  : "You don't have any notifications yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                    !notification.isRead
                      ? "bg-accent/50 border-primary/20"
                      : "bg-background hover:bg-accent/30"
                  )}
                >
                  <span className="text-2xl">
                    {NOTIFICATION_TYPE_ICONS[notification.type] || "📌"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{notification.title}</span>
                      <Badge
                        variant={PRIORITY_VARIANTS[notification.priority]}
                        className="text-xs"
                      >
                        {notification.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {NOTIFICATION_TYPE_LABELS[notification.type] ||
                          notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>
                        {format(new Date(notification.createdAt), "PPp")}
                      </span>
                      <span>
                        ({formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })})
                      </span>
                      {notification.isRead && notification.readAt && (
                        <span className="flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {notification.actionUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={notification.actionUrl}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
