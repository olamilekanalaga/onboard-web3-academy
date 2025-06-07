import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TestConnection from "./pages/TestConnection";
import { AuthProvider } from "./contexts/AuthContext";
import AdminAuthGuard from "./components/AdminAuthGuard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<TestConnection />} />

            {/* Protected admin routes */}
            <Route path="/" element={
              <AdminAuthGuard>
                <Dashboard />
              </AdminAuthGuard>
            } />

            {/* Catch-all route */}
            <Route path="*" element={
              <AdminAuthGuard>
                <Dashboard />
              </AdminAuthGuard>
            } />
          </Routes>
        </AuthProvider>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
