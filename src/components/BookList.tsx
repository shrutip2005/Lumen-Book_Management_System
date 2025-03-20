
import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import { getAllBooks } from '../utils/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  reviews: any[];
  isbn?: string; // Make isbn optional to maintain compatibility
}

interface BookListProps {
  books?: Book[];
  title?: string;
  loading?: boolean;
  onBookClick?: (book: Book) => void; // Add this prop to the interface
}

const BookList: React.FC<BookListProps> = ({ 
  books: propBooks, 
  title = "All Books", 
  loading: propLoading,
  onBookClick 
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(propLoading !== undefined ? propLoading : true);

  useEffect(() => {
    if (propBooks) {
      setBooks(propBooks);
      setLoading(false);
      return;
    }

    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getAllBooks();
        setBooks(data as Book[]);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [propBooks]);

  // Handle book click with optional callback
  const handleBookClick = (book: Book) => {
    if (onBookClick) {
      onBookClick(book);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              cover={book.cover}
              reviews={book.reviews}
              onClick={() => handleBookClick(book)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books found</p>
        </div>
      )}
    </div>
  );
};

export default BookList;
