"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, Edit } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  images: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  adminResponse: string | null;
  adminRespondedAt: string | null;
  createdAt: string;
  user: {
    fullName: string;
    avatarUrl: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  avgRating: number;
  reviewCount: number;
  isLoggedIn: boolean;
}

export function ProductReviews({
  productId,
  reviews,
  avgRating,
  reviewCount,
  isLoggedIn,
}: ProductReviewsProps) {
  const router = useRouter();
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    stars: rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviewCount > 0
      ? (reviews.filter((r) => r.rating === rating).length / reviewCount) * 100
      : 0,
  }));

  const handleHelpful = async (reviewId: string) => {
    if (!isLoggedIn) {
      toast.error("Please log in to vote on reviews");
      return;
    }

    if (votedReviews.has(reviewId)) {
      toast.info("You've already marked this as helpful");
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to vote");

      setVotedReviews(new Set([...votedReviews, reviewId]));
      toast.success("Thank you for your feedback!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit vote");
    }
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{avgRating.toFixed(1)}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2 space-y-2">
              {ratingDistribution.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review Button */}
          <div className="mt-6 text-center">
            {isLoggedIn ? (
              <Button asChild>
                <Link href={`/product/${productId}/review`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Write a Review
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href={`/login?redirect=/product/${productId}/review`}>
                  Log in to Write a Review
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No reviews yet. Be the first to review this product!
              </p>
              {isLoggedIn && (
                <Button asChild>
                  <Link href={`/product/${productId}/review`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Write a Review
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        {review.user.avatarUrl ? (
                          <img
                            src={review.user.avatarUrl}
                            alt={review.user.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold">
                            {review.user.fullName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.user.fullName}</span>
                          {review.verifiedPurchase && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Title & Content */}
                  {review.title && (
                    <h3 className="font-semibold text-lg">{review.title}</h3>
                  )}
                  {review.content && (
                    <p className="text-muted-foreground">{review.content}</p>
                  )}

                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {review.images.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border">
                          <img
                            src={img}
                            alt={`Review image ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Admin Response */}
                  {review.adminResponse && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        Response from SuberCraftex:
                      </p>
                      <p className="text-sm text-blue-800">{review.adminResponse}</p>
                      {review.adminRespondedAt && (
                        <p className="text-xs text-blue-600 mt-2">
                          {formatDistanceToNow(new Date(review.adminRespondedAt), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpful(review.id)}
                      disabled={votedReviews.has(review.id)}
                      className={votedReviews.has(review.id) ? "text-primary" : ""}
                    >
                      <ThumbsUp className={`h-4 w-4 mr-2 ${votedReviews.has(review.id) ? "fill-current" : ""}`} />
                      Helpful ({review.helpfulCount})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
