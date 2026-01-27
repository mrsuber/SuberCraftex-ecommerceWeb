import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Type definitions that match Prisma schema
type NotificationType =
  | "new_order"
  | "order_paid"
  | "order_cancelled"
  | "new_booking"
  | "booking_confirmed"
  | "booking_cancelled"
  | "new_deposit"
  | "deposit_confirmed"
  | "withdrawal_request"
  | "new_review"
  | "new_feedback"
  | "low_stock"
  | "kyc_submitted"
  | "quote_approved"
  | "system";

type NotificationPriority = "low" | "normal" | "high" | "urgent";

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  referenceId?: string;
  referenceType?: string;
  actionUrl?: string;
  metadata?: Prisma.InputJsonValue;
}

export class NotificationService {
  /**
   * Create a new notification
   */
  static async create(params: CreateNotificationParams) {
    return db.notification.create({
      data: {
        type: params.type,
        title: params.title,
        message: params.message,
        priority: params.priority || "normal",
        referenceId: params.referenceId,
        referenceType: params.referenceType,
        actionUrl: params.actionUrl,
        metadata: params.metadata,
      },
    });
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount() {
    return db.notification.count({
      where: { isRead: false },
    });
  }

  /**
   * Get notifications with pagination
   */
  static async getNotifications(options?: {
    limit?: number;
    offset?: number;
    unreadOnly?: boolean;
  }) {
    const { limit = 20, offset = 0, unreadOnly = false } = options || {};

    return db.notification.findMany({
      where: unreadOnly ? { isRead: false } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(id: string, readBy?: string) {
    return db.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
        readBy,
      },
    });
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(readBy?: string) {
    return db.notification.updateMany({
      where: { isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
        readBy,
      },
    });
  }

  /**
   * Delete old read notifications (cleanup)
   */
  static async deleteOldNotifications(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return db.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: { lt: cutoffDate },
      },
    });
  }

  // ============================================================================
  // NOTIFICATION CREATORS FOR SPECIFIC EVENTS
  // ============================================================================

  /**
   * New order placed
   */
  static async notifyNewOrder(order: {
    id: string;
    orderNumber: string;
    totalAmount: number | string;
    customerName?: string;
  }) {
    const amount = typeof order.totalAmount === "string"
      ? parseFloat(order.totalAmount)
      : order.totalAmount;

    return this.create({
      type: "new_order",
      title: "New Order Received",
      message: `Order #${order.orderNumber} for $${amount.toFixed(2)}${order.customerName ? ` from ${order.customerName}` : ""}`,
      priority: "normal",
      referenceId: order.id,
      referenceType: "order",
      actionUrl: `/dashboard/orders/${order.id}`,
      metadata: { orderNumber: order.orderNumber, amount },
    });
  }

  /**
   * Order payment received
   */
  static async notifyOrderPaid(order: {
    id: string;
    orderNumber: string;
    totalAmount: number | string;
  }) {
    const amount = typeof order.totalAmount === "string"
      ? parseFloat(order.totalAmount)
      : order.totalAmount;

    return this.create({
      type: "order_paid",
      title: "Payment Received",
      message: `Payment of $${amount.toFixed(2)} received for order #${order.orderNumber}`,
      priority: "normal",
      referenceId: order.id,
      referenceType: "order",
      actionUrl: `/dashboard/orders/${order.id}`,
    });
  }

  /**
   * Order cancelled
   */
  static async notifyOrderCancelled(order: {
    id: string;
    orderNumber: string;
    reason?: string;
  }) {
    return this.create({
      type: "order_cancelled",
      title: "Order Cancelled",
      message: `Order #${order.orderNumber} has been cancelled${order.reason ? `: ${order.reason}` : ""}`,
      priority: "high",
      referenceId: order.id,
      referenceType: "order",
      actionUrl: `/dashboard/orders/${order.id}`,
    });
  }

  /**
   * New service booking
   */
  static async notifyNewBooking(booking: {
    id: string;
    bookingNumber: string;
    serviceName: string;
    customerName: string;
    scheduledDate?: Date;
  }) {
    const dateStr = booking.scheduledDate
      ? ` for ${new Date(booking.scheduledDate).toLocaleDateString()}`
      : "";

    return this.create({
      type: "new_booking",
      title: "New Service Booking",
      message: `${booking.customerName} booked "${booking.serviceName}"${dateStr}`,
      priority: "normal",
      referenceId: booking.id,
      referenceType: "booking",
      actionUrl: `/dashboard/bookings/${booking.id}`,
      metadata: { bookingNumber: booking.bookingNumber },
    });
  }

  /**
   * Booking confirmed
   */
  static async notifyBookingConfirmed(booking: {
    id: string;
    bookingNumber: string;
  }) {
    return this.create({
      type: "booking_confirmed",
      title: "Booking Confirmed",
      message: `Booking #${booking.bookingNumber} has been confirmed`,
      priority: "normal",
      referenceId: booking.id,
      referenceType: "booking",
      actionUrl: `/dashboard/bookings/${booking.id}`,
    });
  }

  /**
   * Booking cancelled
   */
  static async notifyBookingCancelled(booking: {
    id: string;
    bookingNumber: string;
    reason?: string;
  }) {
    return this.create({
      type: "booking_cancelled",
      title: "Booking Cancelled",
      message: `Booking #${booking.bookingNumber} has been cancelled${booking.reason ? `: ${booking.reason}` : ""}`,
      priority: "high",
      referenceId: booking.id,
      referenceType: "booking",
      actionUrl: `/dashboard/bookings/${booking.id}`,
    });
  }

  /**
   * Investor deposit received
   */
  static async notifyNewDeposit(deposit: {
    id: string;
    investorName: string;
    amount: number | string;
    paymentMethod: string;
  }) {
    const amount = typeof deposit.amount === "string"
      ? parseFloat(deposit.amount)
      : deposit.amount;

    return this.create({
      type: "new_deposit",
      title: "New Investor Deposit",
      message: `${deposit.investorName} deposited $${amount.toFixed(2)} via ${deposit.paymentMethod}`,
      priority: "high",
      referenceId: deposit.id,
      referenceType: "deposit",
      actionUrl: `/dashboard/investors`,
      metadata: { amount, paymentMethod: deposit.paymentMethod },
    });
  }

  /**
   * Deposit confirmed
   */
  static async notifyDepositConfirmed(deposit: {
    id: string;
    investorName: string;
    amount: number | string;
  }) {
    const amount = typeof deposit.amount === "string"
      ? parseFloat(deposit.amount)
      : deposit.amount;

    return this.create({
      type: "deposit_confirmed",
      title: "Deposit Confirmed",
      message: `Deposit of $${amount.toFixed(2)} from ${deposit.investorName} has been confirmed`,
      priority: "normal",
      referenceId: deposit.id,
      referenceType: "deposit",
      actionUrl: `/dashboard/investors`,
    });
  }

  /**
   * Withdrawal request submitted
   */
  static async notifyWithdrawalRequest(request: {
    id: string;
    requestNumber: string;
    investorName: string;
    amount: number | string;
    type: string;
  }) {
    const amount = typeof request.amount === "string"
      ? parseFloat(request.amount)
      : request.amount;

    return this.create({
      type: "withdrawal_request",
      title: "Withdrawal Request",
      message: `${request.investorName} requested ${request.type} withdrawal of $${amount.toFixed(2)}`,
      priority: "urgent",
      referenceId: request.id,
      referenceType: "withdrawal",
      actionUrl: `/dashboard/investors`,
      metadata: { requestNumber: request.requestNumber, amount, type: request.type },
    });
  }

  /**
   * New product review
   */
  static async notifyNewReview(review: {
    id: string;
    productName: string;
    rating: number;
    customerName?: string;
  }) {
    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

    return this.create({
      type: "new_review",
      title: "New Product Review",
      message: `${stars} review for "${review.productName}"${review.customerName ? ` by ${review.customerName}` : ""}`,
      priority: "low",
      referenceId: review.id,
      referenceType: "review",
      actionUrl: `/dashboard/reviews`,
      metadata: { rating: review.rating, productName: review.productName },
    });
  }

  /**
   * Investor feedback submitted
   */
  static async notifyNewFeedback(feedback: {
    id: string;
    subject: string;
    type: string;
    investorName: string;
  }) {
    return this.create({
      type: "new_feedback",
      title: "New Investor Feedback",
      message: `${feedback.investorName}: ${feedback.subject} (${feedback.type})`,
      priority: feedback.type === "bug_report" || feedback.type === "complaint" ? "high" : "normal",
      referenceId: feedback.id,
      referenceType: "feedback",
      actionUrl: `/dashboard/investors`,
      metadata: { type: feedback.type },
    });
  }

  /**
   * Low stock alert
   */
  static async notifyLowStock(product: {
    id: string;
    name: string;
    currentStock: number;
    threshold: number;
  }) {
    return this.create({
      type: "low_stock",
      title: "Low Stock Alert",
      message: `"${product.name}" has only ${product.currentStock} units left (threshold: ${product.threshold})`,
      priority: "high",
      referenceId: product.id,
      referenceType: "product",
      actionUrl: `/dashboard/products/${product.id}`,
      metadata: { currentStock: product.currentStock, threshold: product.threshold },
    });
  }

  /**
   * KYC submitted for verification
   */
  static async notifyKycSubmitted(investor: {
    id: string;
    investorNumber: string;
    fullName: string;
  }) {
    return this.create({
      type: "kyc_submitted",
      title: "KYC Verification Required",
      message: `${investor.fullName} (${investor.investorNumber}) submitted KYC documents for verification`,
      priority: "high",
      referenceId: investor.id,
      referenceType: "investor",
      actionUrl: `/dashboard/investors/${investor.id}`,
    });
  }

  /**
   * Quote approved by customer
   */
  static async notifyQuoteApproved(quote: {
    id: string;
    bookingNumber: string;
    customerName: string;
    totalCost: number | string;
  }) {
    const amount = typeof quote.totalCost === "string"
      ? parseFloat(quote.totalCost)
      : quote.totalCost;

    return this.create({
      type: "quote_approved",
      title: "Quote Approved",
      message: `${quote.customerName} approved quote for booking #${quote.bookingNumber} ($${amount.toFixed(2)})`,
      priority: "high",
      referenceId: quote.id,
      referenceType: "quote",
      actionUrl: `/dashboard/bookings`,
      metadata: { bookingNumber: quote.bookingNumber, amount },
    });
  }

  /**
   * System notification
   */
  static async notifySystem(title: string, message: string, priority: NotificationPriority = "normal") {
    return this.create({
      type: "system",
      title,
      message,
      priority,
    });
  }
}
