import { useProfile, useSimulatePayment, useSelectTier } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { Shell } from "@/components/layout/Shell";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Download, 
  Server, 
  CreditCard, 
  Check, 
  ShieldCheck, 
  HardDrive,
  Globe,
  Database,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  if (!isAuthLoading && !user) {
    window.location.href = "/";
    return null;
  }

  if (!isProfileLoading && !profile) {
    setLocation("/onboarding");
    return null;
  }

  if (isProfileLoading || !profile) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  return (
    <Shell>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-secondary mb-2">
          Welcome back, {user?.firstName}
        </h1>
        <div className="flex items-center space-x-2 text-slate-500">
          <span>Account Type:</span>
          <Badge variant="info" className="capitalize">{profile.role}</Badge>
        </div>
      </header>

      {profile.role === 'family' ? (
        <FamilyDashboard profile={profile} />
      ) : (
        <ProDashboard profile={profile} />
      )}
    </Shell>
  );
}

// ==========================================
// FAMILY DASHBOARD
// ==========================================
function FamilyDashboard({ profile }: { profile: any }) {
  const pay = useSimulatePayment();
  const { toast } = useToast();

  const handlePay = () => {
    pay.mutate("onetime", {
      onSuccess: () => {
        toast({
          title: "Payment Successful",
          description: "Welcome to the family. Your license is active.",
          variant: "default",
        });
      }
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "The secure container package is downloading...",
    });
  };

  if (!profile.hasPaidOneTimeFee) {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card-premium border-l-4 border-l-primary">
          <h2 className="text-2xl font-bold mb-4">Platform Activation</h2>
          <p className="text-slate-600 mb-6">
            To begin distributing your family's private infrastructure, a one-time platform license fee is required.
            This grants you perpetual access to the software updates.
          </p>
          <div className="flex items-end mb-8">
            <span className="text-4xl font-bold text-secondary">$200</span>
            <span className="text-slate-500 mb-1 ml-2">/ one-time</span>
          </div>
          <button 
            onClick={handlePay}
            disabled={pay.isPending}
            className="btn-primary w-full"
          >
            {pay.isPending ? "Processing..." : "Purchase License"}
          </button>
        </div>
        
        <div className="card-premium bg-slate-50 border-dashed">
          <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
            <Server className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-400">Software Access Locked</h3>
            <p className="text-slate-400 mt-2">Complete activation to access downloads.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status Card */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-semibold text-slate-600">Platform License</h3>
             <Badge variant="success">Active</Badge>
           </div>
           <p className="text-3xl font-bold text-secondary">$10<span className="text-sm font-normal text-slate-400">/mo</span></p>
           <p className="text-xs text-slate-400 mt-2">Maintenance active</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-semibold text-slate-600">Infrastructure</h3>
             <Badge variant="neutral">Self-Hosted</Badge>
           </div>
           <div className="flex items-center space-x-2 text-slate-600">
             <HardDrive className="w-5 h-5" />
             <span>Local / Private Cloud</span>
           </div>
        </div>
      </div>

      {/* Downloads Section */}
      <div className="card-premium">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Download className="w-6 h-6 mr-3 text-primary" />
            Software Distribution
          </h2>
        </div>
        
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 text-sm text-amber-800">
              <p className="font-bold mb-1">IMPORTANT NOTICE:</p>
              <p>FamilyLegacyPlatform is self-hosted software. Hosting, domain, and database setup are your responsibility.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-secondary">Family Core Container</h4>
                <p className="text-sm text-slate-500">v2.4.0 • Docker Image • 450MB</p>
              </div>
            </div>
            <button onClick={handleDownload} className="btn-secondary text-sm py-2">
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card-premium">
        <h2 className="text-xl font-bold mb-6">Deployment Guide</h2>
        <div className="space-y-6">
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            </div>
            <div>
              <h4 className="font-bold text-secondary">Prepare Infrastructure</h4>
              <p className="text-slate-600 mt-1 text-sm">Provision a VPS (DigitalOcean, AWS, or local server) with Docker installed.</p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
            </div>
            <div>
              <h4 className="font-bold text-secondary">Configure DNS</h4>
              <p className="text-slate-600 mt-1 text-sm">Point your chosen domain (e.g., family.legacy) to your server IP.</p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
            </div>
            <div>
              <h4 className="font-bold text-secondary">Deploy Container</h4>
              <p className="text-slate-600 mt-1 text-sm">Load the downloaded image and run the startup script provided in the README.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PRO DASHBOARD
// ==========================================
function ProDashboard({ profile }: { profile: any }) {
  const pay = useSimulatePayment();
  const selectTier = useSelectTier();
  const { toast } = useToast();
  const { data: marketplaceValidation } = useQuery<{ valid: boolean; message: string }>({
    queryKey: ['/api/marketplace/validate'],
    enabled: !!profile && profile.role === 'pro',
  });

  const handlePay = () => {
    pay.mutate("onetime", {
      onSuccess: () => {
        toast({ title: "Onboarding Complete", description: "Professional account activated." });
      }
    });
  };

  const handleSubscribe = (tier: string) => {
    selectTier.mutate(tier);
    pay.mutate("subscription");
    toast({ title: "Subscription Active", description: `You are now on the ${tier} plan.` });
  };

  if (!profile.hasPaidOneTimeFee) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="card-premium p-12">
          <ShieldCheck className="w-20 h-20 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold mb-4">Professional Partner Program</h2>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
             Join our network of certified legacy professionals. 
             This requires a one-time onboarding fee which covers training, 
             certification, and white-label setup.
          </p>
          <div className="text-5xl font-bold text-secondary mb-8">$20,000</div>
          <button onClick={handlePay} disabled={pay.isPending} className="btn-primary text-lg px-12">
            {pay.isPending ? "Processing..." : "Pay Onboarding Fee"}
          </button>
        </div>
      </div>
    );
  }

  if (profile.subscriptionTier === 'none') {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Select Your Tier</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {['gold', 'platinum', 'uranium'].map((tier) => (
            <div key={tier} className={cn(
              "card-premium hover:-translate-y-2 relative overflow-hidden",
              tier === 'uranium' && "border-primary/50 ring-1 ring-primary/20"
            )}>
              {tier === 'uranium' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600" />
              )}
              <h3 className="text-xl font-bold capitalize mb-2">{tier}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">
                  ${tier === 'gold' ? '100' : tier === 'platinum' ? '150' : '1,000'}
                </span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="text-sm flex items-center text-slate-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  {tier === 'gold' ? 'Up to 10 Families' : tier === 'platinum' ? 'Up to 50 Families' : 'Unlimited Families'}
                </li>
                <li className="text-sm flex items-center text-slate-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  White Label Dashboard
                </li>
              </ul>
              <button 
                onClick={() => handleSubscribe(tier)} 
                className={cn("w-full py-2 rounded-lg font-semibold transition-colors", 
                tier === 'uranium' ? "btn-primary" : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                )}
              >
                Select {tier}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-premium">
            <h2 className="text-xl font-bold mb-4">Partner Resources</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-bold text-lg mb-2">Backend Dashboard Setup Guide</h3>
              <p className="text-slate-600 mb-4">
                Complete documentation on setting up the multi-tenant backend for your clients.
              </p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 text-sm text-amber-800">
                <p className="font-bold mb-1">IMPORTANT NOTICE:</p>
                <p>FamilyLegacyPlatform is self-hosted software. Hosting, domain, and database setup are your responsibility.</p>
              </div>
              <div className="prose prose-sm text-slate-600">
                <p>1. Download the Partner Marketplace Module below.</p>
                <p>2. Deploy to your secure infrastructure.</p>
                <p>3. Configure the white-label settings in `config.yaml`.</p>
              </div>
              <button className="btn-secondary mt-6">
                <Download className="w-4 h-4 mr-2" />
                Download Partner Module
              </button>
            </div>
          </div>

          <div className="card-premium">
            <h2 className="text-xl font-bold mb-4">Marketplace Access</h2>
            {marketplaceValidation?.valid ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">Connection Active: You can now post content and message family users.</p>
                </div>
                <button className="btn-primary w-full">Open Marketplace Portal</button>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-slate-400">Marketplace Locked</h3>
                <p className="text-sm text-slate-400 mt-2">{marketplaceValidation?.message || "Verify your subscription to connect."}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
             <div className="flex justify-between items-start mb-8">
               <ShieldCheck className="w-10 h-10 text-primary" />
               <Badge className="bg-white/10 text-white border-white/20 capitalize">
                 {profile.subscriptionTier} Partner
               </Badge>
             </div>
             <div>
               <p className="text-slate-400 text-sm">Partner Status</p>
               <p className="text-2xl font-bold">Active & Certified</p>
             </div>
           </div>

           <div className="card-premium">
             <h3 className="font-bold mb-4">Quick Stats</h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center pb-4 border-b">
                 <span className="text-sm text-slate-500">Active Clients</span>
                 <span className="font-bold">0</span>
               </div>
               <div className="flex justify-between items-center pb-4 border-b">
                 <span className="text-sm text-slate-500">Marketplace Leads</span>
                 <span className="font-bold">0</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
