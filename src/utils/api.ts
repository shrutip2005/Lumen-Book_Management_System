
import axios from 'axios';

// Mock data - in a real app, this would be fetched from an API
const BOOKS_DATA = [
  {
    id: '1',
    isbn: '9780451524935',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel that examines the consequences of totalitarianism, mass surveillance, and repressive regimentation.',
    cover: 'https://images.unsplash.com/photo-1504610926078-a1611febcad3?q=80&w=500&auto=format&fit=crop',
    reviews: [
      { id: '101', userId: 'user1', username: 'BookLover', rating: 5, comment: 'A timeless masterpiece that remains relevant today.', createdAt: '2023-01-15' },
      { id: '102', userId: 'user2', username: 'LitFan', rating: 4, comment: 'Thought-provoking and chilling. A must-read.', createdAt: '2023-02-10' }
    ]
  },
  {
    id: '2',
    isbn: '9780544003415',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    description: 'An epic high-fantasy novel that follows the quest to destroy the One Ring, which was created by the Dark Lord Sauron.',
    cover: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=500&auto=format&fit=crop',
    reviews: [
      { id: '103', userId: 'user3', username: 'FantasyReader', rating: 5, comment: 'The foundational work of modern fantasy. Incredible world-building.', createdAt: '2023-03-05' }
    ]
  },
  {
    id: '3',
    isbn: '9780061120084',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A novel that examines racism and moral growth in the American South through the eyes of a young girl.',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop',
    reviews: [
      { id: '104', userId: 'user1', username: 'BookLover', rating: 5, comment: 'A powerful story with unforgettable characters.', createdAt: '2023-04-20' }
    ]
  },
  {
    id: '4',
    isbn: '9780316769174',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A novel about the teenage angst and alienation of its protagonist, Holden Caulfield.',
    cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=500&auto=format&fit=crop',
    reviews: []
  },
  {
    id: '5',
    isbn: '9780143127550',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A novel set during the Roaring Twenties that explores themes of decadence, idealism, and the American Dream.',
    cover: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=500&auto=format&fit=crop',
    reviews: [
      { id: '105', userId: 'user2', username: 'LitFan', rating: 4, comment: 'Beautifully written with complex characters.', createdAt: '2023-05-12' }
    ]
  },
  {
    id: '6',
    isbn: '9780307474278',
    title: 'The Road',
    author: 'Cormac McCarthy',
    description: 'A post-apocalyptic novel following a father and son as they journey through a devastated America.',
    cover: 'https://images.unsplash.com/photo-1510172951991-856a62a9cde1?q=80&w=500&auto=format&fit=crop',
    reviews: [
      { id: '106', userId: 'user3', username: 'FantasyReader', rating: 5, comment: 'Haunting and poetic. One of McCarthy\'s best.', createdAt: '2023-06-08' }
    ]
  }
];

// Mock users
const USERS = [
  { id: 'user1', username: 'BookLover', email: 'booklover@example.com', password: 'password123' },
  { id: 'user2', username: 'LitFan', email: 'litfan@example.com', password: 'password123' },
  { id: 'user3', username: 'FantasyReader', email: 'fantasy@example.com', password: 'password123' }
];

// Task 1: Get all books
export const getAllBooks = async () => {
  // In a real app, this would be an API call like:
  // return axios.get('/api/books').then(response => response.data);
  
  // Simulating network delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(BOOKS_DATA);
    }, 300);
  });
};

// Task 2: Get book by ISBN
export const getBookByISBN = async (isbn: string) => {
  // Simulating a promise-based API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = BOOKS_DATA.find(book => book.isbn === isbn);
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    }, 300);
  });
};

// Task 3: Get books by author
export const getBooksByAuthor = async (author: string) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const books = BOOKS_DATA.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase())
      );
      resolve(books);
    }, 300);
  });
};

// Task 4: Get books by title
export const getBooksByTitle = async (title: string) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const books = BOOKS_DATA.filter(book => 
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      resolve(books);
    }, 300);
  });
};

// Task 5: Get book reviews
export const getBookReviews = async (bookId: string) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const book = BOOKS_DATA.find(book => book.id === bookId);
      if (book) {
        resolve(book.reviews);
      } else {
        resolve([]);
      }
    }, 300);
  });
};

// Task 6 & 7: Authentication functions
export const registerUser = async (userData: { username: string; email: string; password: string }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if user already exists
      const existingUser = USERS.find(user => user.email === userData.email);
      if (existingUser) {
        reject(new Error('User with this email already exists'));
      } else {
        const newUser = {
          id: `user${USERS.length + 1}`,
          ...userData
        };
        USERS.push(newUser);
        
        // Return user without password
        const { password, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      }
    }, 500);
  });
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USERS.find(
        user => user.email === credentials.email && user.password === credentials.password
      );
      
      if (user) {
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

// Task 8: Add/modify book review
export const addOrUpdateReview = async (
  bookId: string, 
  reviewData: { userId: string; rating: number; comment: string; reviewId?: string }
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookIndex = BOOKS_DATA.findIndex(book => book.id === bookId);
      
      if (bookIndex === -1) {
        reject(new Error('Book not found'));
        return;
      }
      
      const book = BOOKS_DATA[bookIndex];
      const user = USERS.find(user => user.id === reviewData.userId);
      
      if (!user) {
        reject(new Error('User not found'));
        return;
      }
      
      // If reviewId is provided, update existing review
      if (reviewData.reviewId) {
        const reviewIndex = book.reviews.findIndex(review => review.id === reviewData.reviewId);
        
        if (reviewIndex === -1) {
          reject(new Error('Review not found'));
          return;
        }
        
        // Check if the user owns the review
        if (book.reviews[reviewIndex].userId !== reviewData.userId) {
          reject(new Error('You can only edit your own reviews'));
          return;
        }
        
        // Update the review
        book.reviews[reviewIndex] = {
          ...book.reviews[reviewIndex],
          rating: reviewData.rating,
          comment: reviewData.comment,
        };
        
        resolve(book.reviews[reviewIndex]);
      } else {
        // Add new review
        const newReview = {
          id: `${Date.now()}`,
          userId: reviewData.userId,
          username: user.username,
          rating: reviewData.rating,
          comment: reviewData.comment,
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        book.reviews.push(newReview);
        resolve(newReview);
      }
    }, 500);
  });
};

// Task 9: Delete book review
export const deleteReview = async (bookId: string, reviewId: string, userId: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookIndex = BOOKS_DATA.findIndex(book => book.id === bookId);
      
      if (bookIndex === -1) {
        reject(new Error('Book not found'));
        return;
      }
      
      const book = BOOKS_DATA[bookIndex];
      const reviewIndex = book.reviews.findIndex(review => review.id === reviewId);
      
      if (reviewIndex === -1) {
        reject(new Error('Review not found'));
        return;
      }
      
      // Check if the user owns the review
      if (book.reviews[reviewIndex].userId !== userId) {
        reject(new Error('You can only delete your own reviews'));
        return;
      }
      
      // Delete the review
      book.reviews.splice(reviewIndex, 1);
      resolve({ success: true });
    }, 500);
  });
};

// For Node.js methods (Tasks 10-13)
// These would normally be implemented in a Node.js backend, but for demonstration
// we'll include them here as they're similar to the browser functions

// Task 10: Get all books (Async/Await)
export const getAllBooksAsync = async () => {
  try {
    // In a real app with Node.js backend:
    // const response = await axios.get('https://api.example.com/books');
    // return response.data;
    
    return await getAllBooks();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Task 11: Search by ISBN (Promises)
export const searchByISBN = (isbn: string) => {
  // Using Promises syntax
  return getBookByISBN(isbn)
    .then(book => book)
    .catch(error => {
      console.error('Error searching by ISBN:', error);
      throw error;
    });
};

// Task 12: Search by Author
export const searchByAuthor = async (author: string) => {
  try {
    return await getBooksByAuthor(author);
  } catch (error) {
    console.error('Error searching by author:', error);
    throw error;
  }
};

// Task 13: Search by Title
export const searchByTitle = async (title: string) => {
  try {
    return await getBooksByTitle(title);
  } catch (error) {
    console.error('Error searching by title:', error);
    throw error;
  }
};
