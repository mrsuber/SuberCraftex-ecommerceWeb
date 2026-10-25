import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "Region is required"),
  // Cameroon has no postal codes
  postalCode: z.string().optional(),
  country: z.string().min(2, "Country is required"),
});

export const shippingMethodSchema = z.object({
  method: z.enum(["in_store", "standard", "express", "overnight"], {
    required_error: "Please select a shipping method",
  }),
});

export const paymentMethodSchema = z.object({
  method: z.enum(["mobile_payment", "cash"], {
    required_error: "Please select a payment method",
  }),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type ShippingMethod = z.infer<typeof shippingMethodSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
