
import React from 'react';
import Header from '../components/Header';
import Auth from '../components/Auth';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 px-6">
        <div className="py-12 max-w-md mx-auto">
          <h1 className="text-3xl font-semibold mb-8 text-center">Login</h1>
          <Auth mode="login" className="animate-fade-in" />
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
