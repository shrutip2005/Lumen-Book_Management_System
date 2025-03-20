
import React from 'react';
import Header from '../components/Header';
import Auth from '../components/Auth';
import { Github } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="pt-24 px-6 flex-grow">
        <div className="py-12 max-w-md mx-auto">
          <h1 className="text-3xl font-semibold mb-8 text-center">Create an Account</h1>
          <Auth mode="register" className="animate-fade-in" />
        </div>
      </main>

      <footer className="py-4 px-6 border-t mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>Created by Shruti Pethe</p>
          <a 
            href="https://github.com/shrutip2005" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors mt-2 md:mt-0"
          >
            <Github size={16} />
            <span>github.com/shrutip2005</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
