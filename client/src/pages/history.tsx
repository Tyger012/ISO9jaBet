import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useMatches } from '@/hooks/useMatches';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { Bet, Transaction } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trophy, XCircle, CheckCircle2, Calendar, Clock } from 'lucide-react';

export default function History() {
  const { myBets, isLoadingBets } = useMatches();
  
  // Get user transactions
  const { 
    data: transactions = [], 
    isLoading: isLoadingTransactions 
  } = useQuery<Transaction[]>({
    queryKey: ['/api/my-transactions'],
  });
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-NG', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <MainLayout>
      <section className="px-4 py-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-heading font-bold mb-4">My History</h1>
          
          <Tabs defaultValue="bets" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 bg-dark-50">
              <TabsTrigger value="bets" className="data-[state=active]:bg-primary">Betting History</TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-primary">Transactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bets">
              {isLoadingBets ? (
                <div className="flex justify-center items-center p-12">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  {myBets.length === 0 ? (
                    <Card className="bg-dark-50 border-gray-700">
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-400 mb-3">You haven't placed any bets yet</p>
                        <Button onClick={() => window.location.href = '/matches'}>
                          Start Betting Now
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    myBets.map((bet: Bet) => (
                      <Card key={bet.id} className="bg-dark-50 border-gray-700 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4 flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Match ID: {bet.matchId}</span>
                                {bet.status === 'won' && (
                                  <span className="flex items-center text-green-500 text-sm">
                                    <Trophy className="h-4 w-4 mr-1" />
                                    Won
                                  </span>
                                )}
                                {bet.status === 'lost' && (
                                  <span className="flex items-center text-red-500 text-sm">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Lost
                                  </span>
                                )}
                                {bet.status === 'pending' && (
                                  <span className="flex items-center text-yellow-500 text-sm">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Pending
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                Prediction: <span className="font-medium">
                                  {bet.prediction === 'home' ? 'Home Win' : 
                                   bet.prediction === 'away' ? 'Away Win' : 'Draw'}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400">
                                Odds: <span className="font-medium">{bet.odds}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-gray-400 text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(bet.createdAt)}
                              </div>
                            </div>
                          </div>
                          
                          {bet.status !== 'pending' && (
                            <div className={`p-3 ${bet.status === 'won' ? 'bg-green-900/20' : 'bg-red-900/20'} border-t border-gray-700`}>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">
                                  {bet.status === 'won' ? 'Won:' : 'Lost:'}
                                </span>
                                <span className={`font-heading font-bold ${bet.status === 'won' ? 'text-green-500' : 'text-red-500'}`}>
                                  {bet.status === 'won' ? '+₦5,000' : '-₦2,000'}
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="transactions">
              {isLoadingTransactions ? (
                <div className="flex justify-center items-center p-12">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <Card className="bg-dark-50 border-gray-700">
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-400">No transactions found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    transactions.map((transaction: Transaction) => (
                      <Card key={transaction.id} className="bg-dark-50 border-gray-700 overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {transaction.type === 'win' && 'Bet Win'}
                                {transaction.type === 'loss' && 'Bet Loss'}
                                {transaction.type === 'withdrawal' && 'Withdrawal'}
                                {transaction.type === 'lucky_spin' && 'Lucky Spin Bonus'}
                                {transaction.type === 'vip_activation' && 'VIP Activation'}
                                {transaction.type === 'fee' && 'Service Fee'}
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                {transaction.details}
                              </div>
                              <div className="text-sm text-gray-400 flex items-center mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                                  transaction.status === 'completed' ? 'bg-green-900/20 text-green-500' : 
                                  transaction.status === 'pending' ? 'bg-yellow-900/20 text-yellow-500' : 
                                  'bg-red-900/20 text-red-500'
                                }`}>
                                  {transaction.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                  {transaction.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                  {transaction.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-heading font-bold ${
                                transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {transaction.amount > 0 ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatDate(transaction.createdAt)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
}
