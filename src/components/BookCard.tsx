
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  cover: string;
  reviews: any[];
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  cover,
  reviews,
  className
}) => {
  // Calculate average rating
  const avgRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <Link
      to={`/book/${id}`}
      className={cn(
        'group rounded-xl overflow-hidden book-card-hover',
        className
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center space-x-1 text-white">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">
              {avgRating ? avgRating.toFixed(1) : 'No ratings'}
            </span>
            <span className="text-xs text-white/70">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-base mb-1 truncate">{title}</h3>
        <p className="text-sm text-muted-foreground">{author}</p>
      </div>
    </Link>
  );
};

export default BookCard;
