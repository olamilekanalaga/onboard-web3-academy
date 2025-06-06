
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMobileDetection } from "./hooks/useMobileDetection";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import NotFound from "./pages/NotFound";
import MobileApp from "./components/mobile/MobileApp";
import MobileExplore from "./components/mobile/MobileExplore";
import MobileCourses from "./components/mobile/MobileCourses";
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
            <Routes>
              <Route path="/" element={<MobileApp />} />
              <Route path="/mobile/home" element={<MobileHome />} />
              <Route path="/mobile/explore" element={<MobileExplore />} />
              <Route path="/mobile/courses" element={<MobileCourses />} />
              <Route path="/mobile/progress" element={<MobileProgress />} />
              <Route path="/mobile/profile" element={<MobileProfile />} />
              <Route path="*" element={<MobileApp />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<Course />} />
              <Route path="/course/:courseId" element={<Course />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
