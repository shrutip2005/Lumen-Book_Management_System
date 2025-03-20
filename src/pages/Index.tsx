
import React, { useEffect, useState } from 'react';
import BookList from '../components/BookList';
import Header from '../components/Header';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Animate content appearance after a small delay
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero section */}
        <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <div className={`max-w-3xl mx-auto text-center transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Discover your next favorite book
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Browse our curated collection of literary classics and contemporary bestsellers.
            </p>
            <Link to="/search">
              <Button size="lg" className="rounded-full px-8">
                Explore Books
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Books section */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className={`transition-all duration-700 delay-300 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <BookList title="Featured Books" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
