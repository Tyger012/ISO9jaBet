import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { UserPlus } from 'lucide-react';

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Initialize form
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // Handle form submission
  const onSubmit = (data: RegisterFormData) => {
    // Remove confirmPassword as it's not needed in the API call
    const { confirmPassword, ...registerData } = data;
    register.mutate(registerData);
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-dark-100 p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-heading font-bold text-accent">ISO9ja<span className="text-primary">Bet</span></h1>
        <p className="text-gray-400 mt-2">Match Prediction & Betting Platform</p>
      </div>
      
      <Card className="w-full max-w-md bg-dark-50 border-gray-700">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Sign up to start predicting and winning</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Choose a username" 
                        className="bg-dark-200 border-gray-700"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-dark-200 border-gray-700"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Create a password" 
                        className="bg-dark-200 border-gray-700"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm your password" 
                        className="bg-dark-200 border-gray-700"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={register.isPending}
              >
                {register.isPending ? (
                  <Spinner className="mr-2" size="sm" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                Create Account
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-400">
                  Already have an account? 
                  <Button 
                    variant="link" 
                    className="text-primary p-0 ml-1"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center text-xs text-gray-500 max-w-md">
        <p>By creating an account, you agree to the terms of service and privacy policy.</p>
        <p className="mt-1">Initial balance: ₦5,000 • Predict to win up to ₦5,000 per match</p>
      </div>
    </div>
  );
}
