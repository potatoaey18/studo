import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { supabase } from "@/lib/supabase";
import { Analytics } from "@vercel/analytics/react";
import Dashboard from "./pages/Dashboard.tsx";
import Auth from "./pages/Auth.tsx";
import Landing from "./pages/Landing.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import InvitePage from "./pages/InvitePage.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      setSession(session);
      if (!session) { setShowAuth(false); return; }

      const pendingInvite = localStorage.getItem("pending_invite");
      if (pendingInvite) {
        localStorage.removeItem("pending_invite");
        const { data: project } = await supabase
          .from("projects").select("*").eq("invite_code", pendingInvite).single();
        if (project) {
          await supabase.from("project_members").insert({
            project_id: project.id,
            user_id: session.user.id,
            email: session.user.email,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return null;

  return (
    <>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/invite/:code" element={<InvitePage />} />
                <Route path="/about" element={<About onBack={() => window.history.back()} />} />
                <Route path="/contact" element={<Contact onBack={() => window.history.back()} />} />
                <Route
                  path="/"
                  element={
                    session ? <Dashboard onSignOut={handleSignOut} /> :
                    showAuth ? <Auth onSuccess={() => setShowAuth(false)} /> :
                    <Landing
                      onGetStarted={() => setShowAuth(true)}
                      onAbout={() => window.location.href = "/about"}
                      onContact={() => window.location.href = "/contact"}
                    />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
      <Analytics />
    </>
  );
};

export default App;