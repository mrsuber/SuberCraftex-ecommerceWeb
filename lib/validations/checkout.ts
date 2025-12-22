import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

export const shippingMethodSchema = z.object({
  method: z.enum(["standard", "express", "overnight"], {
    required_error: "Please select a shipping method",
  }),
});

export const paymentMethodSchema = z.object({
  method: z.enum(["card", "cash"], {
    required_error: "Please select a payment method",
  }),
  saveCard: z.boolean().optional(),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type ShippingMethod = z.infer<typeof shippingMethodSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
