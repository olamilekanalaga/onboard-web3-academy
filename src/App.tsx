
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMobileDetection } from "./hooks/useMobileDetection";
import { MobileUserProvider } from "./contexts/MobileUserContext";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import Gamification from "./pages/Gamification";
import NotFound from "./pages/NotFound";
import MobileApp from "./components/mobile/MobileApp";
import MobileAuthGuard from "./components/mobile/MobileAuthGuard";
import MobileExplore from "./components/mobile/MobileExplore";
import MobileCourses from "./components/mobile/MobileCourses";
import MobileCourse from "./components/mobile/MobileCourse";
import MobileProgress from "./components/mobile/MobileProgress";
import MobileProfile from "./components/mobile/MobileProfile";
import MobileHome from "./components/mobile/MobileHome";

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useMobileDetection();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isMobile ? (
            <MobileUserProvider>
              <Routes>
                {/* Mobile routes - all protected by auth guard */}
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

                {/* Root route - onboarding flow */}
                <Route path="/" element={<MobileApp />} />

                {/* Catch-all route - redirect to onboarding */}
                <Route path="*" element={<MobileApp />} />
              </Routes>
            </MobileUserProvider>
          ) : (
            <Routes>
              {/* Web routes */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<Course />} />
              <Route path="/course/:courseId" element={<Course />} />
              <Route path="/gamification" element={<Gamification />} />

              {/* Root route */}
              <Route path="/" element={<Index />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
