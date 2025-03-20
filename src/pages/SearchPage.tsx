
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import { 
  getBooksByTitle, 
  getBooksByAuthor, 
  getBookByISBN 
} from '../utils/api';
import { toast } from 'sonner';

type SearchType = 'title' | 'author' | 'isbn';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Parse search params from URL
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') as SearchType || 'title';

  useEffect(() => {
    // If URL has search parameters, perform search
    if (queryParam) {
      performSearch(queryParam, typeParam);
    }
  }, [queryParam, typeParam]);

  const performSearch = async (query: string, type: SearchType) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      let results;
      
      switch (type) {
        case 'title':
          results = await getBooksByTitle(query);
          break;
        case 'author':
          results = await getBooksByAuthor(query);
          break;
        case 'isbn':
          try {
            const book = await getBookByISBN(query);
            results = book ? [book] : [];
          } catch (error) {
            results = [];
          }
          break;
        default:
          results = await getBooksByTitle(query);
      }
      
      setSearchResults(Array.isArray(results) ? results : [results].filter(Boolean));
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string, type: SearchType) => {
    performSearch(query, type);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="py-12">
          <h1 className="text-3xl font-semibold mb-8 text-center">Search Books</h1>
          
          <SearchBar 
            onSearch={handleSearch}
            initialQuery={queryParam}
            initialType={typeParam}
            className="mb-12"
          />
          
          {hasSearched && (
            <div className="animate-fade-in">
              <BookList 
                books={searchResults} 
                title={`${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'} found`}
                loading={loading}
              />
            </div>
          )}
          
          {!hasSearched && (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">
              <p>Search for books by title, author, or ISBN</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
