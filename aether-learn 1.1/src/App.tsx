import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import CoursesPage from "./pages/CoursesPage";
import ProgressPage from "./pages/ProgressPage";
import NotFound from "./pages/NotFound";

// Layouts
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                
                {/* Guest Only Routes */}
                <Route path="/login" element={<ProtectedRoute guestOnly><LoginPage /></ProtectedRoute>} />
                <Route path="/register" element={<ProtectedRoute guestOnly><RegisterPage /></ProtectedRoute>} />
                <Route path="/forgot-password" element={<ProtectedRoute guestOnly><ForgotPasswordPage /></ProtectedRoute>} />

                {/* Protected Routes with Dashboard Layout */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/quizzes" element={<DashboardPage />} />
                  <Route path="/planner" element={<DashboardPage />} />
                  <Route path="/achievements" element={<ProgressPage />} />
                  <Route path="/settings" element={<DashboardPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
