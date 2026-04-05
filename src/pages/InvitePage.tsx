import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const InvitePage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    supabase.auth.onAuthStateChange((_e, s) => setSession(s));

    if (code) {
      supabase.from("projects").select("*").eq("invite_code", code).single()
        .then(({ data, error }) => {
          if (error || !data) setError("Invalid or expired invite link.");
          else setProject(data);
          setLoading(false);
        });
    }
  }, [code]);

  const handleJoin = async () => {
    if (!session) {
      // Store invite code and redirect to auth
      localStorage.setItem("pending_invite", code!);
      navigate("/");
      return;
    }

    setJoining(true);
    const { error } = await supabase.from("project_members").insert({
      project_id: project.id,
      user_id: session.user.id,
      email: session.user.email,
    });

    if (error && !error.message.includes("duplicate")) {
      setError("Failed to join project.");
    } else {
      navigate("/");
    }
    setJoining(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pt-8">
          <h1 className="font-display text-3xl font-bold">Studo</h1>
          <p className="text-muted-foreground text-sm mt-1">Project Invitation</p>
        </CardHeader>
        <CardContent className="px-8 pb-8 space-y-6 text-center">
          {error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">You've been invited to join</p>
                <p className="font-display text-2xl font-bold">{project?.name}</p>
              </div>
              {!session && (
                <p className="text-xs text-muted-foreground">You'll need to sign in or create an account first.</p>
              )}
              <Button className="w-full h-11" onClick={handleJoin} disabled={joining}>
                {joining ? <Loader2 className="h-4 w-4 animate-spin" /> : session ? "Join Project" : "Sign In to Join"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitePage;