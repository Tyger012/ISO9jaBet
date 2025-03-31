import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBets from "./pages/MyBets";
import Leaderboard from "./pages/Leaderboard";
import Withdraw from "./pages/Withdraw";
import VIP from "./pages/VIP";
import LuckySpin from "./pages/LuckySpin";
import NotFound from "@/pages/not-found";
import AuthGuard from "./components/AuthGuard";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/">
        <AuthGuard>
          <Layout>
            <Home />
          </Layout>
        </AuthGuard>
      </Route>
      <Route path="/my-bets">
        <AuthGuard>
          <Layout>
            <MyBets />
          </Layout>
        </AuthGuard>
      </Route>
      <Route path="/leaderboard">
        <AuthGuard>
          <Layout>
            <Leaderboard />
          </Layout>
        </AuthGuard>
      </Route>
      <Route path="/withdraw">
        <AuthGuard>
          <Layout>
            <Withdraw />
          </Layout>
        </AuthGuard>
      </Route>
      <Route path="/vip">
        <AuthGuard>
          <Layout>
            <VIP />
          </Layout>
        </AuthGuard>
      </Route>
      <Route path="/lucky-spin">
        <AuthGuard>
          <Layout>
            <LuckySpin />
          </Layout>
        </AuthGuard>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
