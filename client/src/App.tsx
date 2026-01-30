import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FlagFootballScorer from "@/pages/flag-football";
import SeasonStats from "@/pages/season-stats";
import SurfstungLanding from "@/pages/surfstung";
import PitchPage from "@/pages/pitch";
import SponsorInquiry from "@/pages/sponsor-inquiry";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={FlagFootballScorer}/>
      <Route path="/stats" component={SeasonStats}/>
      <Route path="/season-stats" component={SeasonStats}/>
      <Route path="/surfstung" component={SurfstungLanding}/>
      <Route path="/pitch" component={PitchPage}/>
      <Route path="/sponsor-inquiry" component={SponsorInquiry}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
