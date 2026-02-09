import { useCampaigns } from "@/hooks/use-campaigns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/control-center/StatusBadge";
import { Loader2, Megaphone, Target, MousePointer, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Marketing Campaigns</h1>
        <p className="text-muted-foreground text-sm">Track ad performance and ROI</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns?.map((campaign) => {
          const spendPercent = Math.min((campaign.spend || 0) / campaign.budget * 100, 100);
          const roi = campaign.roi ? campaign.roi / 100 : 0;
          
          return (
            <Card key={campaign.id} className="dashboard-card flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold text-foreground line-clamp-1">
                    {campaign.name}
                  </CardTitle>
                  <StatusBadge status={campaign.status} />
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Megaphone className="w-4 h-4" />
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-6 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget Spent</span>
                    <span className="font-medium font-mono">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((campaign.spend || 0) / 100)} 
                      <span className="text-muted-foreground"> / {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(campaign.budget / 100)}</span>
                    </span>
                  </div>
                  <Progress value={spendPercent} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MousePointer className="w-3 h-3" /> Clicks
                    </p>
                    <p className="text-lg font-bold font-mono">{campaign.clicks?.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Target className="w-3 h-3" /> Conversions
                    </p>
                    <p className="text-lg font-bold font-mono">{campaign.conversions?.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> CPA
                    </p>
                    <p className="text-lg font-bold font-mono">
                      {campaign.conversions ? 
                        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((campaign.spend || 0) / 100 / campaign.conversions) 
                        : "$0.00"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className={`text-lg font-bold font-mono ${roi >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {roi > 0 ? "+" : ""}{roi}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
