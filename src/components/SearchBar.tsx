
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { getBookByISBN } from '../utils/api';

type SearchType = 'title' | 'author' | 'isbn';

interface SearchBarProps {
  onSearch: (query: string, type: SearchType) => void;
  initialQuery?: string;
  initialType?: SearchType;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialQuery = '',
  initialType = 'title',
  className
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<SearchType>(initialType);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setIsSearching(true);
    
    try {
      // For ISBN searches, try direct lookup first
      if (searchType === 'isbn') {
        const cleanedISBN = query.trim().replace(/-/g, '');
        
        // Basic ISBN validation - check if it's a 10 or 13 digit number
        if (/^\d{10}$|^\d{13}$/.test(cleanedISBN)) {
          try {
            const book = await getBookByISBN(cleanedISBN);
            if (book) {
              navigate(`/book/${cleanedISBN}`);
              setIsSearching(false);
              return;
            }
          } catch (error) {
            console.error('ISBN direct lookup failed, falling back to search:', error);
            // Continue to search page if direct lookup fails
          }
        }
      }
      
      // For other searches or if ISBN direct lookup failed
      onSearch(query, searchType);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col md:flex-row gap-3 ${className}`}>
      <div className="flex-1 relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search by ${searchType}...`}
          className="pl-10 w-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
      <Select
        value={searchType}
        onValueChange={(value) => setSearchType(value as SearchType)}
      >
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Search by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="author">Author</SelectItem>
          <SelectItem value="isbn">ISBN</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        type="submit" 
        className="w-full md:w-auto"
        disabled={isSearching}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
};

export default SearchBar;
