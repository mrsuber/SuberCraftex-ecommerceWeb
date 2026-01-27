"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Check, CheckCheck, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  normal: "bg-blue-500",
  low: "bg-gray-400",
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/notifications?limit=15");
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
  }, []);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Refresh when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
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
          prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-destructive text-destructive-foreground text-xs rounded-full font-medium">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead();
              }}
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading && notifications.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Bell className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                asChild
                className={cn(
                  "flex flex-col items-start p-3 cursor-pointer focus:bg-accent",
                  !notification.isRead && "bg-accent/50"
                )}
              >
                <div
                  className="w-full"
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  {notification.actionUrl ? (
                    <Link
                      href={notification.actionUrl}
                      className="flex flex-col w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!notification.isRead) {
                          markAsRead(notification.id);
                        }
                        setIsOpen(false);
                      }}
                    >
                      <NotificationContent notification={notification} />
                    </Link>
                  ) : (
                    <NotificationContent notification={notification} />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center">
          <Link
            href="/dashboard/notifications"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            View all notifications
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationContent({ notification }: { notification: Notification }) {
  return (
    <>
      <div className="flex items-start justify-between w-full gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="text-lg leading-none mt-0.5">
            {NOTIFICATION_TYPE_ICONS[notification.type] || "📌"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">
                {notification.title}
              </span>
              {notification.priority !== "normal" && (
                <span
                  className={cn(
                    "h-2 w-2 rounded-full flex-shrink-0",
                    PRIORITY_COLORS[notification.priority]
                  )}
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {notification.message}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
          {notification.isRead ? (
            <Check className="h-3 w-3 text-muted-foreground" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-primary" />
          )}
        </div>
      </div>
    </>
  );
}
