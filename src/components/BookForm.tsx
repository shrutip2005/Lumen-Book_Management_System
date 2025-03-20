
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { addBook, updateBook, uploadImage } from '../utils/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UploadCloud, Image } from 'lucide-react';

const bookSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  author: z.string().min(2, 'Author must be at least 2 characters'),
  isbn: z.string().refine((val) => {
    // Basic ISBN validation (10 or 13 digits, can include hyphens)
    const cleaned = val.replace(/-/g, '');
    return /^\d{10}$|^\d{13}$/.test(cleaned);
  }, 'ISBN must be valid (10 or 13 digits)'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  cover: z.string().url('Cover must be a valid URL'),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  description: string;
  cover: string;
}

interface BookFormProps {
  onSuccess: () => void;
  book?: Book | null;
}

const BookForm: React.FC<BookFormProps> = ({ onSuccess, book }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultValues: BookFormValues = {
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    description: book?.description || '',
    cover: book?.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop',
  };
  
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues,
  });
  
  if (!user) return null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      form.setValue('cover', imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: BookFormValues) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      if (book) {
        // Update existing book
        await updateBook(book.id, user.id, data);
        toast.success('Book updated successfully');
      } else {
        // Add new book - ensure all required properties are present
        await addBook({
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          description: data.description,
          cover: data.cover,
          createdBy: user.id,
        });
        toast.success('Book added successfully');
      }
      
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Book title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 9780123456789" 
                      {...field} 
                      disabled={!!book} // Disable ISBN editing for existing books
                    />
                  </FormControl>
                  <FormDescription>
                    10 or 13 digit ISBN number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <div className="flex flex-col space-y-4">
                    {field.value && (
                      <div className="w-32 h-44 overflow-hidden rounded border border-border">
                        <img 
                          src={field.value} 
                          alt="Book cover preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input {...field} placeholder="Cover image URL" />
                      </FormControl>
                      
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleUploadClick}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>Uploading...</>
                        ) : (
                          <>
                            <UploadCloud className="h-4 w-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Book description" 
                  {...field} 
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess()}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Saving...' 
              : book ? 'Update Book' : 'Add Book'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookForm;
