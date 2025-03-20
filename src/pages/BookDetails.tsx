
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer'; 
import BookDetail from '../components/BookDetail';

const BookDetails = () => {
  const { isbn } = useParams<{ isbn: string }>();
  
  if (!isbn) {
    return <div>Book not found</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <BookDetail bookId={isbn} />
      <Footer />
    </div>
  );
};

export default BookDetails;
