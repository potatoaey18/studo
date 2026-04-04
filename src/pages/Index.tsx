import { useState } from "react";
import Landing from "./Landing";
import Dashboard from "./Dashboard";

const Index = () => {
  const [view, setView] = useState<"landing" | "dashboard">("landing");

  if (view === "dashboard") {
    return <Dashboard onSignOut={() => setView("landing")} />;
  }

  return <Landing onGetStarted={() => setView("dashboard")} />;
};

export default Index;
