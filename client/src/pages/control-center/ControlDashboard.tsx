import { useDashboardStats } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  Activity,
  TicketCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Revenue Today",
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.revenueToday / 100),
      description: "+20.1% from yesterday",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      description: `+${stats.newUsers} new users today`,
      icon: Users,
      trend: "up"
    },
    {
      title: "System Health",
      value: stats.systemHealth,
      description: "All systems operational",
      icon: Activity,
      isStatus: true
    },
    {
      title: "Open Tickets",
      value: stats.openTickets,
      description: "Requires attention",
      icon: TicketCheck,
      trend: stats.openTickets > 5 ? "down" : "up"
    }
  ];

  // Mock data for the chart
  const data = [
    { name: "Mon", revenue: 4000 },
    { name: "Tue", revenue: 3000 },
    { name: "Wed", revenue: 2000 },
    { name: "Thu", revenue: 2780 },
    { name: "Fri", revenue: 1890 },
    { name: "Sat", revenue: 2390 },
    { name: "Sun", revenue: 3490 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card key={index} className="dashboard-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold font-display">
                  {card.isStatus ? (
                    <StatusBadge status={card.value.toString()} className="text-sm px-3 py-1" />
                  ) : card.value}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {card.trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
                {card.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 dashboard-card">
          <CardHeader>
            <CardTitle className="font-display">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 dashboard-card">
          <CardHeader>
            <CardTitle className="font-display">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Active Campaigns</p>
                  <p className="text-sm text-muted-foreground">{stats.activeCampaigns} running</p>
                </div>
                <div className="ml-auto font-medium">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Monthly Revenue</p>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.revenueMonth / 100)}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  +12%
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Conversion Rate</p>
                  <p className="text-sm text-muted-foreground">{stats.conversionRate}%</p>
                </div>
                <div className="ml-auto font-medium">
                  +2.1%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
