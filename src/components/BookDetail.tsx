import React, { useState, useEffect } from 'react';
import { getBookByISBN, getBookReviews } from '../utils/api';
import { Star, Calendar, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import ReviewForm from './ReviewForm';
import { toast } from 'sonner';
import { deleteReview } from '../utils/api';

interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  reviews: Review[];
}

interface BookDetailProps {
  bookId: string;
}

const BookDetail: React.FC<BookDetailProps> = ({ bookId }) => {
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        setLoading(true);
        const bookData = await getBookByISBN(bookId) as Book;
        
        if (bookData) {
          setBook(bookData);
          
          // Fetch reviews separately
          setReviewsLoading(true);
          try {
            const reviewsData = await getBookReviews(bookData.id) as Review[];
            setReviews(reviewsData || []);
            // Update the book object with the reviews array
            setBook(prev => prev ? { ...prev, reviews: reviewsData || [] } : null);
          } catch (reviewError) {
            console.error('Error fetching reviews:', reviewError);
            toast.error('Unable to load reviews');
            setReviews([]);
          } finally {
            setReviewsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        toast.error('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookAndReviews();
    }
  }, [bookId]);

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!book || !user) return;
    
    try {
      await deleteReview(book.id, reviewId, user.id);
      
      // Update the reviews and book state
      const updatedReviews = reviews.filter(r => r.id !== reviewId);
      setReviews(updatedReviews);
      
      // Also update the book object with the filtered reviews
      setBook({
        ...book,
        reviews: updatedReviews
      });
      
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const onReviewSubmitted = (newReview: Review) => {
    if (!book) return;
    
    let updatedReviews;
    
    // If editing, replace the existing review
    if (editingReview) {
      updatedReviews = reviews.map(r => 
        r.id === newReview.id ? newReview : r
      );
    } else {
      // Add new review
      updatedReviews = [...reviews, newReview];
    }
    
    // Update both the reviews array and the book object
    setReviews(updatedReviews);
    setBook({
      ...book,
      reviews: updatedReviews
    });
    
    setShowReviewForm(false);
    setEditingReview(null);
    
    // Show success message
    toast.success(editingReview ? 'Review updated successfully' : 'Review added successfully');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pt-24 px-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/3 aspect-[3/4] rounded-xl" />
          <div className="w-full md:w-2/3 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-24" />
            <div className="pt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto pt-24 px-6 text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Book Not Found</h2>
        <p className="text-muted-foreground">The book you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const avgRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto pt-24 px-6 pb-16 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-1/3">
          <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
            <img 
              src={book?.cover} 
              alt={book?.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-semibold mb-2">{book?.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">{book?.author}</p>
          
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex items-center space-x-1">
              <Star className={`h-5 w-5 ${avgRating > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">
                {avgRating > 0 ? avgRating.toFixed(1) : 'No ratings yet'}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>ISBN: {book?.isbn}</span>
            </div>
          </div>
          
          <p className="text-base leading-relaxed mb-8">{book?.description}</p>
          
          {isAuthenticated && (
            <Button 
              onClick={() => {
                setEditingReview(null);
                setShowReviewForm(!showReviewForm);
              }}
              className="mb-8"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          )}
          
          {showReviewForm && book && (
            <div className="mb-8 animate-slide-up">
              <ReviewForm 
                bookId={book.id} 
                userId={user?.id || ''} 
                onSubmitted={onReviewSubmitted} 
                existingReview={editingReview}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-border pt-8">
        <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
        
        {reviewsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium">{review.username}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < review.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {review.createdAt}
                      </span>
                    </div>
                  </div>
                  
                  {isAuthenticated && user?.id === review.userId && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditReview(review)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this book!</p>
            
            {!isAuthenticated && (
              <p className="text-sm mt-2">
                <a href="/login" className="text-primary hover:underline">
                  Login
                </a> to write a review.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
