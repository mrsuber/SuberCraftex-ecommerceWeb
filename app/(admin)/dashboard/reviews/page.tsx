import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ReviewsManager } from "@/components/reviews/ReviewsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Reviews - Admin Dashboard",
  description: "Approve and manage customer reviews",
};

export default async function ReviewsPage() {
  const user = await getSession();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const [pendingReviews, approvedReviews] = await Promise.all([
    db.review.findMany({
      where: { isApproved: false },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        product: {
          select: {
            name: true,
            sku: true,
            featuredImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.review.findMany({
      where: { isApproved: true },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        product: {
          select: {
            name: true,
            sku: true,
            featuredImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const serializedPending = pendingReviews.map((review) => ({
    ...review,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
    adminRespondedAt: review.adminRespondedAt?.toISOString() || null,
  }));

  const serializedApproved = approvedReviews.map((review) => ({
    ...review,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
    adminRespondedAt: review.adminRespondedAt?.toISOString() || null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Reviews</h1>
        <p className="text-muted-foreground">
          Approve, respond to, and manage customer reviews
        </p>
      </div>

      <ReviewsManager
        pendingReviews={serializedPending}
        approvedReviews={serializedApproved}
      />
    </div>
  );
}
