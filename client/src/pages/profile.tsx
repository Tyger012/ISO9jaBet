import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { VIPActivation } from '@/components/VIPActivation';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMatches } from '@/hooks/useMatches';
import { Spinner } from '@/components/ui/spinner';
import { User, Settings, LogOut, Trophy, History } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { myBets } = useMatches();
  
  // Calculate betting stats
  const totalBets = myBets.length;
  const wonBets = myBets.filter(bet => bet.status === 'won').length;
  const lostBets = myBets.filter(bet => bet.status === 'lost').length;
  const pendingBets = myBets.filter(bet => bet.status === 'pending').length;
  const winRate = totalBets > 0 ? Math.round((wonBets / (wonBets + lostBets)) * 100) : 0;
  
  const userInitials = user?.username 
    ? user.username.slice(0, 2).toUpperCase() 
    : 'U';
    
  const userBalance = user?.balance ? user.balance.toLocaleString() : '0';
  const isVip = user?.isVip || false;
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';
  
  const handleLogout = () => {
    logout.mutate();
  };
  
  if (!user) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center p-12">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <section className="px-4 py-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-heading font-bold mb-4">My Profile</h1>
          
          {/* Profile Header */}
          <Card className="bg-gradient-to-r from-dark-50 to-dark-100 border-gray-700 mb-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                <Avatar className="h-20 w-20 bg-primary/20 border-4 border-dark-100">
                  <AvatarFallback className="text-xl font-medium">{userInitials}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h2 className="text-xl font-heading font-bold">{user.username}</h2>
                    {isVip && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1">{user.email}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-dark-100 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400">Balance</p>
                      <p className="text-lg font-heading font-bold text-primary">₦{userBalance}</p>
                    </div>
                    <div className="bg-dark-100 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400">Win Rate</p>
                      <p className="text-lg font-heading font-bold text-accent">{winRate}%</p>
                    </div>
                    <div className="bg-dark-100 rounded-lg p-3 text-center md:col-span-1 col-span-2">
                      <p className="text-xs text-gray-400">Member Since</p>
                      <p className="text-sm font-medium">{joinDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 md:self-start">
                  <Button variant="outline" className="bg-dark-50 border-gray-700" onClick={() => window.location.href = '/wallet'}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Stats & Activity */}
          <Tabs defaultValue="stats" className="w-full mb-6">
            <TabsList className="grid grid-cols-2 bg-dark-50">
              <TabsTrigger value="stats" className="data-[state=active]:bg-primary">
                <Trophy className="h-4 w-4 mr-2" />
                Betting Stats
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-primary">
                <History className="h-4 w-4 mr-2" />
                Recent Activity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats">
              <Card className="bg-dark-50 border-gray-700">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-dark-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400">Total Bets</p>
                      <p className="text-2xl font-heading font-bold text-white mt-1">{totalBets}</p>
                    </div>
                    <div className="bg-dark-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400">Won</p>
                      <p className="text-2xl font-heading font-bold text-green-500 mt-1">{wonBets}</p>
                    </div>
                    <div className="bg-dark-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400">Lost</p>
                      <p className="text-2xl font-heading font-bold text-red-500 mt-1">{lostBets}</p>
                    </div>
                    <div className="bg-dark-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-400">Pending</p>
                      <p className="text-2xl font-heading font-bold text-yellow-500 mt-1">{pendingBets}</p>
                    </div>
                  </div>
                  
                  {totalBets > 0 ? (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Win Rate</h3>
                      <div className="h-4 bg-dark-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${winRate}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-400">{winRate}%</span>
                        <span className="text-xs text-gray-400">{wonBets} of {wonBets + lostBets} bets won</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 text-center p-4 bg-dark-100 rounded-lg">
                      <p className="text-gray-400">You haven't placed any bets yet</p>
                      <Button className="mt-2" onClick={() => window.location.href = '/matches'}>
                        Start Betting
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card className="bg-dark-50 border-gray-700">
                <CardContent className="p-6">
                  {myBets.length > 0 ? (
                    <div className="space-y-4">
                      {myBets.slice(0, 5).map(bet => (
                        <div key={bet.id} className="flex items-center p-3 bg-dark-100 rounded-lg border border-gray-700">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                            bet.status === 'won' ? 'bg-green-900/20 text-green-500' :
                            bet.status === 'lost' ? 'bg-red-900/20 text-red-500' :
                            'bg-yellow-900/20 text-yellow-500'
                          }`}>
                            {bet.status === 'won' && <Trophy className="h-4 w-4" />}
                            {bet.status === 'lost' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>}
                            {bet.status === 'pending' && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">Match ID: {bet.matchId}</span>
                              <span className="text-xs text-gray-400">{new Date(bet.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              Prediction: {bet.prediction.charAt(0).toUpperCase() + bet.prediction.slice(1)} (Odds: {bet.odds})
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="text-center mt-4">
                        <Button variant="outline" className="bg-dark-50 border-gray-700" onClick={() => window.location.href = '/history'}>
                          View All Activity
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-dark-100 rounded-lg">
                      <p className="text-gray-400">No recent activity</p>
                      <Button className="mt-2" onClick={() => window.location.href = '/matches'}>
                        Start Betting
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* VIP Section */}
          <VIPActivation />
        </div>
      </section>
    </MainLayout>
  );
}
