import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/LoadingScreen";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Landing } from "@/pages/Landing";
import { Portfolio } from "@/pages/Portfolio";
import { Projects } from "@/pages/Projects";
import { Contact } from "@/pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AnimatePresence mode="wait">
            {showLoading ? (
              <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
            ) : (
              <BrowserRouter key="app">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/:username" element={<Portfolio />} />
                  <Route path="/:username/projects" element={<Projects />} />
                  <Route path="/:username/contact" element={<Contact />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            )}
          </AnimatePresence>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
