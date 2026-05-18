import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateTaskPage from "@/pages/CreateTaskPage";
import CreatedTasksPage from "@/pages/CreatedTasksPage";
import AssignedTasksPage from "@/pages/AssignedTasksPage";
import MarketplacePage from "@/pages/MarketplacePage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      <Route path="/">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/tasks/create">
        <ProtectedRoute>
          <CreateTaskPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/tasks/created">
        <ProtectedRoute>
          <CreatedTasksPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/tasks/assigned">
        <ProtectedRoute>
          <AssignedTasksPage />
        </ProtectedRoute>
      </Route>

      <Route path="/tasks/marketplace">
        <ProtectedRoute>
          <MarketplacePage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
