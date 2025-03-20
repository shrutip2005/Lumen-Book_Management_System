
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, LogIn, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12',
        isScrolled
          ? 'bg-white/80 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and navigation */}
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="flex items-center space-x-2 font-semibold text-xl"
          >
            <BookOpen className="h-6 w-6 text-book" />
            <span className="tracking-tight">Lumen</span>
          </Link>

          {/* Desktop navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  location.pathname === '/'
                    ? 'text-book'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Books
              </Link>
              <Link
                to="/search"
                className={cn(
                  'text-sm font-medium transition-colors duration-200',
                  location.pathname === '/search'
                    ? 'text-book'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Search
              </Link>
            </nav>
          )}
        </div>

        {/* Auth buttons or user info */}
        {!isMobile ? (
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.username}</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="text-sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="relative z-50"
          >
            {showMobileMenu ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-0 bg-white z-40 animate-fade-in">
          <div className="flex flex-col items-center justify-center h-full space-y-8 py-20">
            <Link
              to="/"
              className="text-lg font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Books
            </Link>
            <Link
              to="/search"
              className="text-lg font-medium"
              onClick={() => setShowMobileMenu(false)}
            >
              Search
            </Link>
            
            <div className="pt-4 border-t border-border w-24 flex justify-center">
              {isAuthenticated ? (
                <>
                  <div className="flex flex-col items-center space-y-4">
                    <Link
                      to="/profile"
                      className="text-lg font-medium"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Profile
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        logout();
                        setShowMobileMenu(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <Link
                    to="/login"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Button variant="outline" className="w-32">Login</Button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Button className="w-32">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
