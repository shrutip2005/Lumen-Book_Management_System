
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import { searchByTitle, searchByAuthor, searchByISBN } from '../utils/api';
import { toast } from 'sonner';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  reviews: any[];
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = (searchParams.get('type') as 'title' | 'author' | 'isbn') || 'title';
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
  
  // Perform search when URL parameters change
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, initialType);
    }
  }, [initialQuery, initialType]);
  
  const performSearch = async (query: string, type: 'title' | 'author' | 'isbn') => {
    setLoading(true);
    setSearchPerformed(true);
    
    try {
      let results;
      
      if (type === 'title') {
        results = await searchByTitle(query);
      } else if (type === 'author') {
        results = await searchByAuthor(query);
      } else if (type === 'isbn') {
        // For ISBN search, use the Promise-based approach
        results = await searchByISBN(query)
          .then(book => (book ? [book] : []))
          .catch(error => {
            console.error('Error searching by ISBN:', error);
            return [];
          });
      } else {
        results = [];
      }
      
      setBooks(results as Book[]);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (query: string, type: 'title' | 'author' | 'isbn') => {
    // Update URL parameters
    setSearchParams({ q: query, type });
    
    // Perform the search
    performSearch(query, type);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Books</h1>
          
          <SearchBar 
            onSearch={handleSearch}
            initialQuery={initialQuery}
            initialType={initialType}
          />
        </div>
        
        {searchPerformed && (
          <div className="max-w-7xl mx-auto">
            <BookList
              books={books}
              title={`Search Results ${initialQuery ? `for "${initialQuery}"` : ''}`}
              loading={loading}
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
