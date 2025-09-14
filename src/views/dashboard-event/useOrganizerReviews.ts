// hooks/useOrganizerReviews.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface Review {
  id: number;
  userId: number;
  eventId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    profilePicture: string | null;
  };
}

interface OrganizerReviewsResponse {
  data: {
    event: {
      id: number;
      name: string;
      averageRating: number;
      totalReviews: number;
    };
    reviews: Review[];
  };
  message: string;
}

export const useOrganizerReviews = (eventId: number, token: string | null) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!token || !eventId) return;

      try {
        setLoading(true);
        const response = await axios.get<OrganizerReviewsResponse>(
          `http://localhost:8000/review/organizer/event/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReviews(response.data.data.reviews);
        setEventData(response.data.data.event);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [eventId, token]);

  return { reviews, eventData, loading, error };
};
