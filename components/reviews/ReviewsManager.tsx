"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, Check, X, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  images: string[];
  verifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  adminResponse: string | null;
  createdAt: string;
  user: {
    fullName: string | null;
    email: string;
    avatarUrl: string | null;
  };
  product: {
    name: string;
    sku: string;
    featuredImage: string | null;
  };
}

interface ReviewsManagerProps {
  pendingReviews: Review[];
  approvedReviews: Review[];
}

export function ReviewsManager({ pendingReviews, approvedReviews }: ReviewsManagerProps) {
  const router = useRouter();
  const [responding, setResponding] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async (reviewId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });

      if (!response.ok) throw new Error("Failed to approve review");

      toast.success("Review approved!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to approve review");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete review");

      toast.success("Review deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminResponse: responseText }),
      });

      if (!response.ok) throw new Error("Failed to respond");

      toast.success("Response posted!");
      setResponding(null);
      setResponseText("");
      router.refresh();
    } catch (error) {
      toast.error("Failed to post response");
    } finally {
      setLoading(false);
    }
  };

  const ReviewCard = ({ review, showActions = true }: { review: Review; showActions?: boolean }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                {review.user.avatarUrl ? (
                  <img
                    src={review.user.avatarUrl}
                    alt={review.user.fullName || review.user.email}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold">
                    {(review.user.fullName || review.user.email).charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium">{review.user.fullName || review.user.email}</p>
                <p className="text-sm text-muted-foreground">{review.user.email}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {review.verifiedPurchase && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Verified Purchase
                </Badge>
              )}
              {review.isApproved ? (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">Approved</Badge>
              ) : (
                <Badge variant="secondary">Pending</Badge>
              )}
            </div>
          </div>

          {/* Product */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {review.product.featuredImage && (
              <div className="w-12 h-12 rounded overflow-hidden border">
                <img
                  src={review.product.featuredImage}
                  alt={review.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium text-sm">{review.product.name}</p>
              <p className="text-xs text-muted-foreground">SKU: {review.product.sku}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Title & Content */}
          {review.title && <h3 className="font-semibold">{review.title}</h3>}
          {review.content && <p className="text-sm">{review.content}</p>}

          {/* Images */}
          {review.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {review.images.map((img, idx) => (
                <div key={idx} className="aspect-square rounded overflow-hidden border">
                  <img src={img} alt={`Review ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Admin Response */}
          {review.adminResponse && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 mb-1">Response from SuberCraftex:</p>
              <p className="text-sm text-blue-800">{review.adminResponse}</p>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2 border-t">
              {!review.isApproved && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(review.id)}
                    disabled={loading}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(review.id)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setResponding(review.id);
                  setResponseText(review.adminResponse || "");
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {review.adminResponse ? "Edit Response" : "Respond"}
              </Button>
              {review.isApproved && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleReject(review.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No pending reviews</p>
              </CardContent>
            </Card>
          ) : (
            pendingReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No approved reviews yet</p>
              </CardContent>
            </Card>
          ) : (
            approvedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={!!responding} onOpenChange={(open) => !open && setResponding(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Your response will be visible to all customers viewing this review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Thank you for your feedback..."
              rows={5}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResponding(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => responding && handleRespond(responding)}
                disabled={loading || !responseText.trim()}
              >
                Post Response
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
