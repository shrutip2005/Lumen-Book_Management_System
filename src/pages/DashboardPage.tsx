
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { getUserBooks } from '../utils/api';
import BookManager from '../components/BookManager';
import UserReviews from '../components/UserReviews';
import { BookOpen, Library, Star, User } from 'lucide-react';

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  reviews: any[];
  createdBy: string;
}

const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('books');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
    const fetchUserBooks = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const books = await getUserBooks(user.id) as Book[];
        setUserBooks(books);
      } catch (error) {
        console.error('Error fetching user books:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated && user) {
      fetchUserBooks();
    }
  }, [isAuthenticated, user, navigate]);

  const refreshBooks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const books = await getUserBooks(user.id) as Book[];
      setUserBooks(books);
    } catch (error) {
      console.error('Error refreshing books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="pt-24 px-6 max-w-7xl mx-auto flex-grow">
        <div className="py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-semibold mb-2 flex items-center">
                  <User className="h-8 w-8 mr-3 text-primary" />
                  Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome back, {user.username}!
                </p>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full md:w-auto grid-cols-2">
                <TabsTrigger value="books" className="flex items-center gap-2">
                  <Library className="h-4 w-4" />
                  <span className="hidden md:inline">My Books</span>
                  <span className="md:hidden">Books</span>
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="hidden md:inline">My Reviews</span>
                  <span className="md:hidden">Reviews</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="books" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">My Books</CardTitle>
                    <CardDescription>
                      Create, edit and manage your book collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BookManager 
                      books={userBooks} 
                      isLoading={loading}
                      onBooksChange={refreshBooks}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">My Reviews</CardTitle>
                    <CardDescription>
                      Reviews you've written across all books
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserReviews userId={user.id} username={user.username} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;
