import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, InfoIcon } from 'lucide-react';

export function WithdrawalForm() {
  const { user, requestWithdrawal } = useUser();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    accountNumber: '',
    bankName: '',
    accountName: '',
    amount: 0,
    activationKey: ''
  });
  
  const userBalance = user?.balance || 0;
  const minimumWithdrawal = 30000;
  const canWithdraw = userBalance >= minimumWithdrawal;
  const feesAmount = 3000;
  const maxWithdrawal = userBalance - feesAmount;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleBankChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      bankName: value
    }));
  };
  
  const handleSubmit = async () => {
    // Validate form
    if (!formData.accountNumber || !formData.bankName || !formData.accountName || !formData.amount || !formData.activationKey) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields',
        variant: 'destructive',
      });
      return;
    }
    
    if (formData.amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid withdrawal amount',
        variant: 'destructive',
      });
      return;
    }
    
    if (formData.amount > maxWithdrawal) {
      toast({
        title: 'Amount Too High',
        description: `The maximum you can withdraw is ₦${maxWithdrawal.toLocaleString()} (after fees)`,
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await requestWithdrawal.mutateAsync(formData);
      
      // Reset form on success
      setFormData({
        accountNumber: '',
        bankName: '',
        accountName: '',
        amount: 0,
        activationKey: ''
      });
    } catch (error) {
      // Error handled in mutation
    }
  };
  
  return (
    <section className="px-4 py-6 bg-dark-200">
      <div className="container mx-auto">
        <h2 className="text-xl font-heading font-bold mb-4">Withdraw Your Winnings</h2>
        
        <Card className="bg-dark-50 shadow border border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Wallet className="text-primary mr-2 h-5 w-5" />
                <span className="font-medium">Available Balance:</span>
              </div>
              <span className="text-xl font-heading font-bold text-primary">₦{userBalance.toLocaleString()}</span>
            </div>
            
            {!canWithdraw && (
              <div className="p-4 bg-dark-100 rounded-lg border border-yellow-700/30 mb-4">
                <div className="flex items-start">
                  <InfoIcon className="text-yellow-500 mt-1 mr-3 h-5 w-5" />
                  <div>
                    <p className="text-yellow-500 font-medium">Withdrawal Requirements</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Keep predicting until your balance reaches ₦{minimumWithdrawal.toLocaleString()} to withdraw. 
                      You need ₦{(minimumWithdrawal - userBalance).toLocaleString()} more.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-dark-100 p-4 rounded-lg border border-gray-700">
              <h3 className="font-medium text-white mb-3">Withdrawal Form</h3>
              
              <div className="space-y-3">
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Account Number</Label>
                  <Input
                    type="text"
                    name="accountNumber"
                    placeholder="Enter account number"
                    className="w-full bg-dark-50 text-white border border-gray-700 focus:ring-primary"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    disabled={!canWithdraw}
                  />
                </div>
                
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Bank Name</Label>
                  <Select 
                    value={formData.bankName} 
                    onValueChange={handleBankChange}
                    disabled={!canWithdraw}
                  >
                    <SelectTrigger className="w-full bg-dark-50 text-white border border-gray-700 focus:ring-primary">
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPay">OPay</SelectItem>
                      <SelectItem value="First Bank">First Bank</SelectItem>
                      <SelectItem value="GTBank">GTBank</SelectItem>
                      <SelectItem value="Access Bank">Access Bank</SelectItem>
                      <SelectItem value="UBA">UBA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Account Name</Label>
                  <Input
                    type="text"
                    name="accountName"
                    placeholder="Enter account name"
                    className="w-full bg-dark-50 text-white border border-gray-700 focus:ring-primary"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    disabled={!canWithdraw}
                  />
                </div>
                
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Amount (₦)</Label>
                  <Input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    className="w-full bg-dark-50 text-white border border-gray-700 focus:ring-primary"
                    value={formData.amount || ''}
                    onChange={handleInputChange}
                    min={1}
                    max={maxWithdrawal}
                    disabled={!canWithdraw}
                  />
                </div>
                
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Withdrawal Activation Key</Label>
                  <Input
                    type="text"
                    name="activationKey"
                    placeholder="Enter activation key"
                    className="w-full bg-dark-50 text-white border border-gray-700 focus:ring-primary"
                    value={formData.activationKey}
                    onChange={handleInputChange}
                    disabled={!canWithdraw}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  className={`w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold ${!canWithdraw ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                  disabled={!canWithdraw || requestWithdrawal.isPending}
                >
                  {requestWithdrawal.isPending ? 'Processing...' : 'Request Withdrawal'}
                </Button>
                <p className="text-xs text-center text-gray-400 mt-2">Account Box Breaking Fee: ₦{feesAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
