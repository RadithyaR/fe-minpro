import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOrganizerReviews } from "./useOrganizerReviews";

interface ReviewViewProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventName: string;
  token: string | null;
}

const ReviewView: React.FC<ReviewViewProps> = ({
  isOpen,
  onClose,
  eventId,
  eventName,
  token,
}) => {
  const { reviews, eventData, loading, error } = useOrganizerReviews(
    eventId,
    token
  );

  // Fungsi untuk menampilkan bintang rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-xl ${
              index < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Reviews - {eventName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Reviews - {eventName}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-red-500">{error}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Reviews - {eventName}
          </DialogTitle>
        </DialogHeader>

        {/* Rata-rata Rating */}
        {eventData && eventData.totalReviews > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="text-center">
              <p className="text-sm text-blue-600 mb-2">Average Rating</p>
              <div className="flex justify-center items-center mb-2">
                {renderStars(Math.round(eventData.averageRating))}
              </div>
              <p className="text-3xl font-bold text-blue-800">
                {eventData.averageRating.toFixed(1)}
              </p>
              <p className="text-sm text-blue-600">
                Based on {eventData.totalReviews} review
                {eventData.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* Daftar Reviews */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-2">
                This event hasn't received any reviews yet.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Header Review */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    {review.user.profilePicture ? (
                      <img
                        src={`http://localhost:8000/${review.user.profilePicture}`}
                        alt={review.user.fullName}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {review.user.fullName?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.user.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {/* Komentar */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tombol Close */}
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewView;
