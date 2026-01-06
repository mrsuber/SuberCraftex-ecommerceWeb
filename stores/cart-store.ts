import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem, Service, CartItemService } from "@/types";

interface CartStore {
  items: Array<CartItem & { product: Product }>;
  serviceItems: Array<CartItemService & { service: Service }>;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addServiceItem: (
    service: Service,
    scheduledDate: string,
    scheduledTime: string,
    customerNotes?: string
  ) => void;
  removeServiceItem: (serviceItemId: string) => void;
  updateServiceItem: (
    serviceItemId: string,
    scheduledDate: string,
    scheduledTime: string
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      serviceItems: [],

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product_id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product_id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: crypto.randomUUID(),
                user_id: "",
                product_id: product.id,
                variant_id: null,
                quantity,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                product,
              },
            ],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      addServiceItem: (
        service: Service,
        scheduledDate: string,
        scheduledTime: string,
        customerNotes?: string
      ) => {
        set((state) => {
          // Check if this exact booking already exists
          const existingItem = state.serviceItems.find(
            (item) =>
              item.service_id === service.id &&
              item.scheduled_date === scheduledDate &&
              item.scheduled_time === scheduledTime
          );

          if (existingItem) {
            // Don't add duplicate bookings
            return state;
          }

          return {
            serviceItems: [
              ...state.serviceItems,
              {
                id: crypto.randomUUID(),
                user_id: "",
                service_id: service.id,
                scheduled_date: scheduledDate,
                scheduled_time: scheduledTime,
                customer_notes: customerNotes || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                service,
              },
            ],
          };
        });
      },

      removeServiceItem: (serviceItemId: string) => {
        set((state) => ({
          serviceItems: state.serviceItems.filter((item) => item.id !== serviceItemId),
        }));
      },

      updateServiceItem: (
        serviceItemId: string,
        scheduledDate: string,
        scheduledTime: string
      ) => {
        set((state) => ({
          serviceItems: state.serviceItems.map((item) =>
            item.id === serviceItemId
              ? {
                  ...item,
                  scheduled_date: scheduledDate,
                  scheduled_time: scheduledTime,
                  updated_at: new Date().toISOString(),
                }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], serviceItems: [] });
      },

      getTotal: () => {
        const items = get().items;
        const serviceItems = get().serviceItems;

        const productsTotal = items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );

        const servicesTotal = serviceItems.reduce(
          (total, item) => total + item.service.price,
          0
        );

        return productsTotal + servicesTotal;
      },

      getItemCount: () => {
        const items = get().items;
        const serviceItems = get().serviceItems;

        const productCount = items.reduce((count, item) => count + item.quantity, 0);
        const serviceCount = serviceItems.length;

        return productCount + serviceCount;
      },
    }),
    {
      name: "subercraftex-cart",
      skipHydration: true,
    }
  )
);
