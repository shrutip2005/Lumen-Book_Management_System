
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import BookDetail from '../components/BookDetail';
import { Github } from 'lucide-react';

const BookDetails = () => {
  const { isbn } = useParams<{ isbn: string }>();
  
  if (!isbn) {
    return <div>Book not found</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <BookDetail bookId={isbn} />
      
      <footer className="py-4 px-6 border-t mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>Created by Shruti Pethe</p>
          <a 
            href="https://github.com/shrutip2005" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors mt-2 md:mt-0"
          >
            <Github size={16} />
            <span>github.com/shrutip2005</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default BookDetails;
