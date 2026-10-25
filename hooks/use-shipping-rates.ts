"use client";

import { useEffect, useState } from "react";

export type ShippingRateKey = "in_store" | "standard" | "express" | "overnight";
export type ShippingRates = Record<ShippingRateKey, number>;

/** Delivery prices from the server, the same ones the order will be charged. */
export function useShippingRates() {
  const [rates, setRates] = useState<ShippingRates | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/shipping/rates")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.rates) setRates(data.rates);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return rates;
}
