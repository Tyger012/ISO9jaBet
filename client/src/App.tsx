import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { BettingProvider } from "./context/BettingContext";

// Pages
import Home from "@/pages/home";
import Matches from "@/pages/matches";
import History from "@/pages/history";
import Wallet from "@/pages/wallet";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/matches" component={Matches} />
      <Route path="/history" component={History} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BettingProvider>
          <Router />
          <Toaster />
        </BettingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
