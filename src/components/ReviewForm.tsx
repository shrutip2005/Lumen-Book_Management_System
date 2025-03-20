
import React, { useState } from 'react';
import { addOrUpdateReview } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewFormProps {
  bookId: string;
  userId: string;
  onSubmitted: (review: Review) => void;
  existingReview?: Review | null;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  userId,
  onSubmitted,
  existingReview
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim() === '') {
      setError('Please enter a review comment');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const reviewData = {
        userId,
        rating,
        comment,
        reviewId: existingReview?.id
      };
      
      const response = await addOrUpdateReview(bookId, reviewData);
      onSubmitted(response as Review);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium mb-1">Rating</label>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 focus:outline-none transition-colors"
            >
              <Star
                className={`h-6 w-6 ${
                  i < (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground self-center">
            {rating ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium">
          Review
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Write your review here..."
          className="resize-none"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting
          ? 'Submitting...'
          : existingReview
          ? 'Update Review'
          : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
