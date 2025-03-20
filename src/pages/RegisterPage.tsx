
import React from 'react';
import Header from '../components/Header';
import Auth from '../components/Auth';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 px-6">
        <div className="py-12 max-w-md mx-auto">
          <h1 className="text-3xl font-semibold mb-8 text-center">Create an Account</h1>
          <Auth mode="register" className="animate-fade-in" />
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
