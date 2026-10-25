"use client";

import { useRouter } from "next/navigation";
import { MobileMoneyPay } from "@/components/payments/MobileMoneyPay";

/** Pay what is left on a repair by Mobile Money. The server works out the amount. */
export function RepairPayCard({ repairId, balance, phone }: { repairId: string; balance: number; phone?: string | null }) {
  const router = useRouter();
  return (
    <div className="border-t pt-4">
      <MobileMoneyPay
        purpose="repair"
        id={repairId}
        amount={balance}
        defaultPhone={phone ?? ""}
        compact
        onPaid={() => setTimeout(() => router.refresh(), 1500)}
      />
    </div>
  );
}
