import { useSystemMetrics } from "@/hooks/use-system-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Cpu, HardDrive, Clock, AlertTriangle } from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function SystemMetrics() {
  const { data: metrics, isLoading } = useSystemMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  if (!metrics) return null;

  const cpuData = [
    { name: "Used", value: metrics.cpu },
    { name: "Free", value: 100 - metrics.cpu }
  ];

  const memData = [
    { name: "Used", value: metrics.memory },
    { name: "Free", value: 100 - metrics.memory }
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">System Metrics</h1>
        <p className="text-muted-foreground text-sm">Real-time infrastructure monitoring</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard 
          title="CPU Load" 
          value={`${metrics.cpu}%`} 
          icon={Cpu} 
          status={metrics.cpu > 80 ? "critical" : "normal"}
        />
        <MetricCard 
          title="Memory Usage" 
          value={`${metrics.memory}%`} 
          icon={HardDrive} 
          status={metrics.memory > 80 ? "critical" : "normal"}
        />
        <MetricCard 
          title="Uptime" 
          value={`${Math.floor(metrics.uptime / 3600)}h ${Math.floor((metrics.uptime % 3600) / 60)}m`} 
          icon={Clock} 
        />
        <MetricCard 
          title="Error Rate" 
          value={`${metrics.errors}/min`} 
          icon={AlertTriangle} 
          status={metrics.errors > 5 ? "critical" : "normal"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Resource Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around h-[200px]">
            <div className="w-1/2 h-full flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-2xl font-bold">{metrics.cpu}%</span>
                  <p className="text-xs text-muted-foreground">CPU</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cpuData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {cpuData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-1/2 h-full flex flex-col items-center justify-center relative">
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-2xl font-bold">{metrics.memory}%</span>
                  <p className="text-xs text-muted-foreground">RAM</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={memData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {memData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Audit Logs</CardTitle>
          </CardHeader>
          <div className="overflow-auto max-h-[250px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.logs?.map((log) => (
                  <TableRow key={log.id} className="dense-table-row text-xs">
                    <TableCell className="font-mono font-medium">{log.action}</TableCell>
                    <TableCell className="text-muted-foreground">{log.entity} {log.entityId && `#${log.entityId}`}</TableCell>
                    <TableCell className="text-right text-muted-foreground font-mono">
                      {log.createdAt ? format(new Date(log.createdAt), "HH:mm:ss") : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, status = "normal" }: any) {
  return (
    <Card className={`dashboard-card ${status === "critical" ? "border-red-500/50 bg-red-500/5" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${status === "critical" ? "text-red-500" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold font-mono ${status === "critical" ? "text-red-600 dark:text-red-400" : ""}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
