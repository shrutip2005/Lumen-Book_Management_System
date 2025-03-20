
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AuthProps {
  mode: 'login' | 'register';
  className?: string;
}

const Auth: React.FC<AuthProps> = ({ mode, className }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (mode === 'register') {
        // Validate
        if (!username.trim()) {
          toast.error('Please enter a username');
          return;
        }
        
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        
        await register(username, email, password);
        navigate('/');
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Error is handled in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("max-w-md w-full mx-auto", className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoComplete="email"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>
        
        {mode === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
          </div>
        )}
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Loading...'
            : mode === 'login'
            ? 'Login'
            : 'Register'}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-primary hover:underline"
              >
                Register
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline">
                Login
              </a>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Auth;
