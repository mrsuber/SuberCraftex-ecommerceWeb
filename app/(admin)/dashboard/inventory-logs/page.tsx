import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inventory Logs - Admin Dashboard",
  description: "View inventory change history",
};

const actionColors: Record<string, string> = {
  received: "bg-green-100 text-green-800",
  sold: "bg-blue-100 text-blue-800",
  damaged: "bg-red-100 text-red-800",
  lost: "bg-orange-100 text-orange-800",
  returned: "bg-purple-100 text-purple-800",
  adjustment_increase: "bg-emerald-100 text-emerald-800",
  adjustment_decrease: "bg-amber-100 text-amber-800",
  correction: "bg-gray-100 text-gray-800",
};

export default async function InventoryLogsPage() {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const logs = await db.inventoryLog.findMany({
    include: {
      product: {
        select: {
          name: true,
          sku: true,
        },
      },
      user: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Logs</h1>
        <p className="text-muted-foreground">
          Complete history of inventory changes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Changes (Last 100)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">After</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No inventory logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {log.product.sku}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          actionColors[log.action] || "bg-gray-100 text-gray-800"
                        }
                      >
                        {log.action.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span
                        className={
                          log.quantityChange >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {log.quantityChange >= 0 ? "+" : ""}
                        {log.quantityChange}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {log.quantityAfter}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{log.user?.fullName || "System"}</div>
                      <div className="text-xs text-muted-foreground">
                        {log.user?.email || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {log.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
