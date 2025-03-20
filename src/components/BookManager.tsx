
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { deleteBook } from '../utils/api';
import BookForm from './BookForm';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface BookManagerProps {
  books: Book[];
  isLoading: boolean;
  onBooksChange: () => void;
}

const BookManager: React.FC<BookManagerProps> = ({ 
  books, 
  isLoading,
  onBooksChange
}) => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  
  if (!user) return null;

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    
    try {
      await deleteBook(bookToDelete.id, user.id);
      toast.success('Book deleted successfully');
      onBooksChange();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete book');
    } finally {
      setBookToDelete(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button 
          onClick={() => {
            setEditingBook(null);
            setShowAddForm(!showAddForm);
          }}
          className="mb-6"
        >
          <Plus className="mr-2 h-4 w-4" />
          {showAddForm ? 'Cancel' : 'Add New Book'}
        </Button>
        
        {showAddForm && (
          <div className="border border-border rounded-lg p-6 mb-8 animate-fade-in">
            <h3 className="text-lg font-medium mb-4">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h3>
            <BookForm 
              onSuccess={() => {
                setShowAddForm(false);
                setEditingBook(null);
                onBooksChange();
              }}
              book={editingBook}
            />
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            You haven't added any books yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div 
              key={book.id}
              className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg"
            >
              <div className="md:w-1/6">
                <div className="aspect-[3/4] rounded-md overflow-hidden">
                  <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-4/6">
                <h3 className="font-medium text-lg">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                <p className="text-sm mb-2">ISBN: {book.isbn}</p>
                <p className="text-sm line-clamp-2">{book.description}</p>
              </div>
              
              <div className="md:w-1/6 flex md:flex-col gap-2 items-start">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full md:w-auto"
                  onClick={() => {
                    setEditingBook(book);
                    setShowAddForm(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="w-full md:w-auto"
                  onClick={() => setBookToDelete(book)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="w-full md:w-auto"
                  onClick={() => window.open(`/book/${book.isbn}`, '_blank')}
                >
                  <BookOpen className="h-4 w-4 mr-2" /> View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <AlertDialog open={!!bookToDelete} onOpenChange={() => setBookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the book "{bookToDelete?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBook}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookManager;
