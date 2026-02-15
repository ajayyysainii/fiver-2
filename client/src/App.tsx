import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import DownloadPage from "@/pages/download";
import CartPage from "@/pages/Cart";
import ChatWidget from "@/components/ui/ChatWidget";
import CartDrawer from "@/components/ui/CartDrawer";
import { CartProvider } from "@/hooks/use-cart";

// Control Center Pages
import ControlDashboard from "@/pages/control-center/ControlDashboard";
import Users from "@/pages/control-center/Users";
import Tickets from "@/pages/control-center/Tickets";
import Campaigns from "@/pages/control-center/Campaigns";
import Agents from "@/pages/control-center/Agents";
import SystemMetrics from "@/pages/control-center/SystemMetrics";
import Assistants from "@/pages/control-center/Assistants";
import AssistantChat from "@/pages/control-center/AssistantChat";
import Vault from "@/pages/control-center/Vault";
import TasksDecisions from "@/pages/control-center/TasksDecisions";
import Assets from "@/pages/control-center/Assets";
import Communication from "@/pages/control-center/Communication";
import Integrations from "@/pages/control-center/Integrations";
import { CCLayout } from "@/components/control-center/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/downloads" component={DownloadPage} />
      <Route path="/cart" component={CartPage} />

      {/* Control Center Routes */}
      <Route path="/control-center">
        <CCLayout>
          <ControlDashboard />
        </CCLayout>
      </Route>
      <Route path="/control-center/users">
        <CCLayout>
          <Users />
        </CCLayout>
      </Route>
      <Route path="/control-center/tickets">
        <CCLayout>
          <Tickets />
        </CCLayout>
      </Route>
      <Route path="/control-center/campaigns">
        <CCLayout>
          <Campaigns />
        </CCLayout>
      </Route>
      <Route path="/control-center/agents">
        <CCLayout>
          <Agents />
        </CCLayout>
      </Route>
      <Route path="/control-center/system">
        <CCLayout>
          <SystemMetrics />
        </CCLayout>
      </Route>
      <Route path="/control-center/assistants">
        <CCLayout>
          <Assistants />
        </CCLayout>
      </Route>
      <Route path="/control-center/assistants/:id/chat">
        {(params) => (
          <CCLayout>
            <AssistantChat />
          </CCLayout>
        )}
      </Route>
      <Route path="/control-center/vault">
        <CCLayout>
          <Vault />
        </CCLayout>
      </Route>
      <Route path="/control-center/tasks">
        <CCLayout>
          <TasksDecisions />
        </CCLayout>
      </Route>
      <Route path="/control-center/assets">
        <CCLayout>
          <Assets />
        </CCLayout>
      </Route>
      <Route path="/control-center/communication">
        <CCLayout>
          <Communication />
        </CCLayout>
      </Route>
      <Route path="/control-center/integrations">
        <CCLayout>
          <Integrations />
        </CCLayout>
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <CartDrawer />
          <ChatWidget />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
