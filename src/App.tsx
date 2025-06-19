
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMobileDetection } from "./hooks/useMobileDetection";
import { MobileUserProvider } from "./contexts/MobileUserContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SocialVerificationProvider } from "./contexts/SocialVerificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import Gamification from "./pages/Gamification";
import Profile from "./pages/Profile";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import AuthGuard from "./components/auth/AuthGuard";
import MobileApp from "./components/mobile/MobileApp";
import MobileAuthGuard from "./components/mobile/MobileAuthGuard";
import MobileExplore from "./components/mobile/MobileExplore";
import MobileCourses from "./components/mobile/MobileCourses";
import MobileCourse from "./components/mobile/MobileCourse";
import MobileProgress from "./components/mobile/MobileProgress";
import MobileProfile from "./components/mobile/MobileProfile";
import MobileSettings from "./components/mobile/MobileSettings";
import MobileHome from "./components/mobile/MobileHome";
import MobileAuth from "./components/mobile/MobileAuth";
import MobileGamification from "./components/mobile/MobileGamification";
import MobileDemo from "./components/mobile/MobileDemo";
// import PWAInstallPrompt from "./components/PWAInstallPrompt"; // Removed temporarily

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useMobileDetection();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <SocialVerificationProvider>
                {isMobile ? (
                  <MobileUserProvider>
                    <Routes>
                      {/* Mobile auth route */}
                      <Route path="/auth" element={<MobileAuth />} />

                      {/* Mobile routes - all protected by auth guard except for course routes */}
                      <Route path="/mobile/home" element={
                        <MobileAuthGuard>
                          <MobileHome />
                        </MobileAuthGuard>
                      } />
                      <Route path="/mobile/explore" element={
                        <MobileAuthGuard>
                          <MobileExplore />
                        </MobileAuthGuard>
                      } />
                      <Route path="/mobile/courses" element={
                        <MobileAuthGuard>
                          <MobileCourses />
                        </MobileAuthGuard>
                      } />
                      <Route path="/mobile/course/:courseId" element={
                        <MobileAuthGuard>
                          <MobileCourse />
                        </MobileAuthGuard>
                      } />
                      <Route path="/course/:courseId" element={
                        <MobileAuthGuard>
                          <MobileCourse />
                        </MobileAuthGuard>
                      } />
                      <Route path="/courses/:courseId" element={
                        <MobileAuthGuard>
                          <MobileCourse />
                        </MobileAuthGuard>
                      } />
                      <Route path="/courses" element={
                        <MobileAuthGuard>
                          <MobileCourses />
                        </MobileAuthGuard>
                      } />
                      <Route path="/demo" element={
                        <MobileAuthGuard>
                          <MobileDemo />
                        </MobileAuthGuard>
                      } />
                      <Route path="/mobile/progress" element={
                        <MobileAuthGuard>
                          <MobileProgress />
                        </MobileAuthGuard>
                      } />
                      <Route path="/mobile/profile" element={
                        <MobileAuthGuard>
                          <MobileProfile />
                        </MobileAuthGuard>
                      } />
                      <Route path="/profile" element={
                        <MobileAuthGuard>
                          <MobileProfile />
                        </MobileAuthGuard>
                      } />
                      <Route path="/mobile/settings" element={
                        <MobileAuthGuard>
                          <MobileSettings />
                        </MobileAuthGuard>
                      } />
                      <Route path="/settings" element={
                        <MobileAuthGuard>
                          <MobileSettings />
                        </MobileAuthGuard>
                      } />
                      <Route path="/mobile/gamification" element={
                        <MobileAuthGuard>
                          <MobileGamification />
                        </MobileAuthGuard>
                      } />
                      <Route path="/gamification" element={
                        <MobileAuthGuard>
                          <MobileGamification />
                        </MobileAuthGuard>
                      } />

                      {/* Root route - onboarding flow */}
                      <Route path="/" element={<MobileApp />} />

                      {/* Catch-all route - redirect to onboarding */}
                      <Route path="*" element={<MobileApp />} />
                    </Routes>
                  </MobileUserProvider>
                ) : (
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />

                    {/* Protected routes */}
                    <Route path="/courses" element={
                      <AuthGuard>
                        <Courses />
                      </AuthGuard>
                    } />
                    <Route path="/courses/:courseId" element={
                      <AuthGuard>
                        <Course />
                      </AuthGuard>
                    } />
                    <Route path="/course/:courseId" element={
                      <AuthGuard>
                        <Course />
                      </AuthGuard>
                    } />
                    <Route path="/demo" element={
                      <AuthGuard>
                        <Demo />
                      </AuthGuard>
                    } />
                    <Route path="/gamification" element={
                      <AuthGuard>
                        <Gamification />
                      </AuthGuard>
                    } />
                    <Route path="/profile" element={
                      <AuthGuard>
                        <Profile />
                      </AuthGuard>
                    } />
                    <Route path="/settings" element={
                      <AuthGuard>
                        <Settings />
                      </AuthGuard>
                    } />

                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                )}
              </SocialVerificationProvider>
            </AuthProvider>
            {/* <PWAInstallPrompt /> */}
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
