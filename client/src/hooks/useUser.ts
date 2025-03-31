import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<User>({
    queryKey: ['/api/me'],
    retry: false,
  });
  
  const login = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest('POST', '/api/login', credentials);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/me'], data);
      toast({
        title: 'Welcome back!',
        description: `You've successfully logged in.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
    },
  });
  
  const register = useMutation({
    mutationFn: async (userData: { username: string; email: string; password: string }) => {
      const res = await apiRequest('POST', '/api/register', userData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/me'], data);
      toast({
        title: 'Account created!',
        description: 'Your account has been successfully created.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Could not create your account',
        variant: 'destructive',
      });
    },
  });
  
  const logout = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/logout', {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.removeQueries();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  type VipActivationPayload = string | {
    activationKey: string;
    hasMadePayment?: boolean;
  };

  const activateVip = useMutation({
    mutationFn: async (payload: VipActivationPayload) => {
      // If payload is a string, treat it as the activation key
      const requestData = typeof payload === 'string' 
        ? { activationKey: payload } 
        : payload;
        
      const res = await apiRequest('POST', '/api/activate-vip', requestData);
      return res.json();
    },
    onSuccess: (data) => {
      // Only update user data if it's available (not available for payment notification)
      if (data.user) {
        queryClient.setQueryData(['/api/me'], data.user);
        toast({
          title: 'VIP Status Activated!',
          description: 'You now have access to exclusive VIP benefits.',
        });
      } else if (data.success) {
        // This is for the payment notification case
        toast({
          title: 'Payment Notification Sent',
          description: data.message || 'Your payment notification has been sent to admin.',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'VIP Activation Failed',
        description: error.message || 'Could not activate VIP status',
        variant: 'destructive',
      });
    },
  });
  
  const spinLuckyWheel = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/lucky-spin', {});
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/me'], data.user);
      toast({
        title: 'Lucky Spin Result!',
        description: `Congratulations! You've won ₦${data.spinResult.amount}`,
      });
      return data.spinResult.amount;
    },
    onError: (error: Error) => {
      toast({
        title: 'Spin Failed',
        description: error.message || 'Could not spin the lucky wheel',
        variant: 'destructive',
      });
      return null;
    },
  });
  
  const requestWithdrawal = useMutation({
    mutationFn: async (withdrawalData: {
      accountNumber: string;
      bankName: string;
      accountName: string;
      amount: number;
      activationKey: string;
    }) => {
      const res = await apiRequest('POST', '/api/request-withdrawal', withdrawalData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/me'], data.user);
      toast({
        title: 'Withdrawal Requested!',
        description: 'Your withdrawal request has been submitted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Withdrawal Failed',
        description: error.message || 'Could not process your withdrawal request',
        variant: 'destructive',
      });
    },
  });
  
  return {
    user,
    isLoading,
    isError,
    error,
    login,
    register,
    logout,
    activateVip,
    spinLuckyWheel,
    requestWithdrawal,
    refetch,
    isAuthenticated: !!user,
  };
}
