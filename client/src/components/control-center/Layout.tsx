import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  TicketCheck,
  Megaphone,
  Bot,
  Activity,
  Menu,
  Bell,
  MessageSquare,
  Archive,
  ListTodo,
  Briefcase,
  Mail,
  Settings,
  Shield,
  Cpu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavSection {
  title: string;
  items: { label: string; href: string; icon: any }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Command Center",
    items: [
      { label: "Dashboard", href: "/control-center", icon: LayoutDashboard },
      { label: "System Health", href: "/control-center/system", icon: Activity },
    ],
  },
  {
    title: "Family Operations",
    items: [
      { label: "Tasks & Decisions", href: "/control-center/tasks", icon: ListTodo },
      { label: "Assets & Projects", href: "/control-center/assets", icon: Briefcase },
      { label: "Communication", href: "/control-center/communication", icon: Mail },
    ],
  },
  {
    title: "AI Assistants",
    items: [
      { label: "Family Assistants", href: "/control-center/assistants", icon: MessageSquare },
      { label: "Agents", href: "/control-center/agents", icon: Bot },
    ],
  },
  {
    title: "Knowledge",
    items: [
      { label: "Legacy Vault", href: "/control-center/vault", icon: Archive },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Users", href: "/control-center/users", icon: Users },
      { label: "Tickets", href: "/control-center/tickets", icon: TicketCheck },
      { label: "Campaigns", href: "/control-center/campaigns", icon: Megaphone },
      { label: "Integrations", href: "/control-center/integrations", icon: Settings },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap(s => s.items);

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const NavContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold font-display tracking-tight leading-tight" data-testid="text-app-title">
              Family Legacy
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
              Command Center
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-2 space-y-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-1 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/70">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href ||
                    (item.href !== "/" && location.startsWith(item.href));
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        data-testid={`nav-${item.href.replace(/\//g, '') || 'dashboard'}`}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                          ${isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 space-y-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20">
          <Cpu className="w-3.5 h-3.5 text-green-500" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono font-semibold text-green-600 dark:text-green-400 tracking-wider">ALKULOUS CORE</p>
            <p className="text-[9px] font-mono text-muted-foreground">Ollama Local</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>

        <div className="flex items-center gap-3 p-2 rounded-md">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="text-xs font-semibold">RA</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Reed Admin</p>
            <p className="text-[11px] text-muted-foreground truncate">Founder</p>
          </div>
        </div>
      </div>
    </div>
  );

  const currentLabel = ALL_NAV_ITEMS.find(i =>
    i.href === location || (i.href !== "/" && location.startsWith(i.href))
  )?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-background">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50" data-testid="button-mobile-menu">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <NavContent />
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-40">
        <NavContent />
      </div>

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 px-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold font-display" data-testid="text-page-title">
            {currentLabel}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full ring-2 ring-background" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

// Export alias for CCLayout
export const CCLayout = Layout;
