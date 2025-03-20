
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllBooks } from '../utils/api';
import { User, Book, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    const fetchUserReviews = async () => {
      try {
        setLoading(true);
        const books = await getAllBooks() as any[];
        
        // Collect all reviews by this user
        const reviews: any[] = [];
        books.forEach(book => {
          book.reviews.forEach((review: any) => {
            if (review.userId === user?.id) {
              reviews.push({
                ...review,
                bookId: book.id,
                bookTitle: book.title,
                bookAuthor: book.author,
                bookCover: book.cover
              });
            }
          });
        });
        
        setUserReviews(reviews);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && user) {
      fetchUserReviews();
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="pt-24 px-6 max-w-7xl mx-auto flex-grow">
        <div className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
              <div>
                <h1 className="text-3xl font-semibold mb-2 flex items-center">
                  <User className="h-8 w-8 mr-3 text-book" />
                  {user.username}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl">Your Reviews</CardTitle>
                <CardDescription>
                  Reviews you've written across all books
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading your reviews...
                  </div>
                ) : userReviews.length > 0 ? (
                  <div className="space-y-6">
                    {userReviews.map((review) => (
                      <div 
                        key={review.id} 
                        className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg"
                      >
                        <div className="md:w-1/4">
                          <a href={`/book/${review.bookId}`} className="block">
                            <div className="aspect-[3/4] rounded-md overflow-hidden">
                              <img 
                                src={review.bookCover} 
                                alt={review.bookTitle} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </a>
                        </div>
                        
                        <div className="md:w-3/4">
                          <a href={`/book/${review.bookId}`} className="hover:underline">
                            <h3 className="font-medium mb-1">{review.bookTitle}</h3>
                          </a>
                          <p className="text-sm text-muted-foreground mb-3">
                            by {review.bookAuthor}
                          </p>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {review.createdAt}
                            </span>
                          </div>
                          
                          <p className="text-sm">{review.comment}</p>
                          
                          <div className="mt-4 flex space-x-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/book/${review.bookId}`)}
                            >
                              View Book
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">
                      You haven't written any reviews yet.
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => navigate('/')}
                    >
                      Browse Books
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
