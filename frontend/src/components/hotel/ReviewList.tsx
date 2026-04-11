import { useState, useEffect } from 'react';
import type { Review } from '../../types';
import { getHotelReviews, createReview } from '../../api/reviews';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, getInitials } from '../../lib/utils';
import StarRating from '../ui/StarRating';
import Button from '../ui/Button';

interface ReviewListProps {
  hotelId: string;
  avgRating: number;
  reviewCount: number;
}

export default function ReviewList({ hotelId, avgRating, reviewCount }: ReviewListProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getHotelReviews(hotelId)
      .then(data => setReviews(data.reviews))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hotelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const review = await createReview(hotelId, { rating, comment });
      setReviews(prev => [review, ...prev]);
      setShowForm(false);
      setComment('');
      setRating(5);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-semibold text-apple-text">{avgRating || '-'}</div>
          <StarRating rating={Math.round(avgRating)} size="sm" />
          <p className="text-xs text-apple-text-secondary mt-1">{reviewCount} reviews</p>
        </div>

        {user && (
          <Button variant="secondary" size="sm" onClick={() => setShowForm(!showForm)}>
            Write a Review
          </Button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-apple-bg border border-apple-border rounded-2xl p-5 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-apple-text mb-2">Your Rating</label>
            <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            required
            rows={3}
            className="w-full px-4 py-3 bg-white border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue resize-none"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Review list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 bg-apple-border-light rounded w-1/4" />
              <div className="h-3 bg-apple-border-light rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-apple-border-light pb-4 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-apple-blue/10 text-apple-blue rounded-full flex items-center justify-center text-sm font-medium">
                  {getInitials(review.user.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-apple-text">{review.user.name}</p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-xs text-apple-text-secondary">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-apple-text-secondary leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-apple-text-secondary">No reviews yet. Be the first to share your experience!</p>
      )}
    </div>
  );
}
