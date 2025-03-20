
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { BookX } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md animate-fade-in">
          <BookX className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button size="lg">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
