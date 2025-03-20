
import React, { useState, useEffect } from 'react';
import { getAllBooks, deleteReview } from '../utils/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Star, BookOpen, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface UserReview extends Review {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  bookIsbn: string;
}

interface UserReviewsProps {
  userId: string;
  username: string;
}

const UserReviews: React.FC<UserReviewsProps> = ({ userId, username }) => {
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewToDelete, setReviewToDelete] = useState<UserReview | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        setLoading(true);
        const books = await getAllBooks() as Book[];
        
        // Collect all reviews by this user
        const reviews: UserReview[] = [];
        books.forEach(book => {
          book.reviews.forEach((review: Review) => {
            if (review.userId === userId) {
              reviews.push({
                ...review,
                bookId: book.id,
                bookTitle: book.title,
                bookAuthor: book.author,
                bookCover: book.cover,
                bookIsbn: book.isbn
              });
            }
          });
        });
        
        setUserReviews(reviews);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserReviews();
  }, [userId]);

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    
    try {
      await deleteReview(reviewToDelete.bookId, reviewToDelete.id, userId);
      
      // Update the local state
      setUserReviews(prev => prev.filter(r => r.id !== reviewToDelete.id));
      
      toast.success('Review deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review');
    } finally {
      setReviewToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (userReviews.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">
          You haven't written any reviews yet.
        </p>
        <Button 
          onClick={() => navigate('/')}
        >
          Browse Books
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {userReviews.map((review) => (
        <div 
          key={review.id} 
          className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg"
        >
          <div className="md:w-1/6">
            <div className="aspect-[3/4] rounded-md overflow-hidden">
              <img 
                src={review.bookCover} 
                alt={review.bookTitle} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-4/6">
            <a href={`/book/${review.bookIsbn}`} className="hover:underline">
              <h3 className="font-medium mb-1">{review.bookTitle}</h3>
            </a>
            <p className="text-sm text-muted-foreground mb-2">
              by {review.bookAuthor}
            </p>
            
            <div className="flex items-center space-x-2 mb-3">
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
                {review.createdAt}
              </span>
            </div>
            
            <p className="text-sm">{review.comment}</p>
          </div>
          
          <div className="md:w-1/6 flex md:flex-col gap-2 items-start">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full md:w-auto"
              onClick={() => navigate(`/book/${review.bookIsbn}`)}
            >
              <BookOpen className="h-4 w-4 mr-2" /> View Book
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm"
              className="w-full md:w-auto"
              onClick={() => setReviewToDelete(review)}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
      ))}
      
      <AlertDialog open={!!reviewToDelete} onOpenChange={() => setReviewToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your review for "{reviewToDelete?.bookTitle}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReview}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserReviews;
