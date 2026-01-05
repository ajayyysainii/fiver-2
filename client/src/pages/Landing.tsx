import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Shield, ArrowRight, CheckCircle2, Users, Briefcase } from "lucide-react";
import familyBg from "@assets/stock_images/african_family_multi_fa706795.jpg";
import { Badge } from "@/components/ui/badge";

import logoImg from "@assets/ChatGPT_Image_Dec_30,_2025_at_11_07_14_PM_1767577414931.png";

export default function Landing() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (!isLoading && user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={logoImg} alt="Logo" className="w-12 h-12 object-contain" />
            <span className="font-display font-bold text-xl tracking-tight text-secondary">FamilyLegacyPlatform</span>
          </div>
          <div className="flex items-center space-x-4">
             {user ? (
               <div className="flex items-center gap-4">
                 <Link href="/dashboard" className="btn-secondary text-sm py-2 px-4">
                   Dashboard
                 </Link>
                 <a href="/api/logout" className="text-sm text-slate-500 hover:text-primary transition-colors">
                   Logout
                 </a>
               </div>
             ) : (
               <a href="/api/login" className="btn-primary text-sm py-2 px-4">
                 Login / Register
               </a>
             )}
          </div>
        </div>
      </nav>

      {/* Hero with Family Background */}
      <div className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat brightness-[0.45] contrast-[1.1]"
          style={{ 
            backgroundImage: `url(${familyBg})`
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/20 to-[#faf9f6]" />
        
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center text-slate-100">
          <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 drop-shadow-[0_8px_8px_rgba(0,0,0,0.8)] leading-tight tracking-tight">
            Empowering Families with <br/>
            Privacy, Control, and Connection
          </h1>
        </div>
      </div>

      {/* Dual Section Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-30 pb-24">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Family Side */}
          <div className="flex flex-col">
            <div className="card-premium h-full flex flex-col p-6 bg-white border-t-4 border-t-primary shadow-2xl scale-95 origin-top">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold text-secondary">Family Membership</h2>
              </div>
              
              <p className="text-slate-600 text-base mb-6 leading-relaxed">
                “Access the full FamilyLegacyPlatform — a self-hosted solution giving families complete control over their private legacy, communications, and marketplace.”
              </p>

              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  "Full platform download & self-hosting",
                  "Secure family communications & private marketplace access",
                  "Encrypted vault for multi-generational media",
                  "No data storage on our servers — ever."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-secondary">$200</span>
                  <span className="text-slate-500 text-sm font-medium uppercase tracking-wider mt-1">one-time setup</span>
                  <div className="w-full h-px bg-slate-200 my-4" />
                  <span className="text-2xl font-bold text-primary">$10/mo</span>
                  <span className="text-slate-500 text-xs mt-1">platform subscription</span>
                </div>
              </div>

              <a href="/api/login" className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Professional Side */}
          <div className="flex flex-col">
            <div className="card-premium h-full flex flex-col p-6 bg-white border-t-4 border-t-amber-500 shadow-2xl scale-95 origin-top">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-50 p-2 rounded-full">
                  <Briefcase className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-display font-bold text-secondary">Professional Membership</h2>
              </div>
              
              <p className="text-slate-600 text-base mb-6 leading-relaxed">
                “Join the FamilyLegacyPlatform Marketplace as a trusted professional with exclusive access to paid family members seeking your services.”
              </p>

              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  "Marketplace access only — post, message, and connect",
                  "Direct engagement with high-net-worth family heads",
                  "Showcase professional services (Legal, Wealth, Heritage)",
                  "Verified partner certification badge"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-amber-50/50 rounded-2xl p-8 border border-amber-100 text-center mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-secondary">$20,000</span>
                  <span className="text-amber-700/70 text-sm font-medium uppercase tracking-wider mt-1">one-time onboarding</span>
                  <div className="w-full h-px bg-amber-200/50 my-4" />
                  <div className="flex gap-4 items-baseline">
                    <span className="text-xs text-slate-500 uppercase">Plans from</span>
                    <span className="text-2xl font-bold text-amber-600">$100/mo</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] bg-white">GOLD $100</Badge>
                    <Badge variant="outline" className="text-[10px] bg-white">PLATINUM $150</Badge>
                    <Badge variant="outline" className="text-[10px] bg-white">URANIUM $1,000</Badge>
                  </div>
                </div>
              </div>

              <a href="/api/login" className="btn-secondary w-full text-lg py-4 border-amber-200 text-amber-800 flex items-center justify-center gap-2 hover:bg-amber-50">
                Apply Now <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Disclaimer */}
        <div className="mt-16 text-center max-w-2xl mx-auto space-y-6">
          <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-500 text-left bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="space-y-2">
              <p className="font-bold text-secondary uppercase tracking-wider">Privacy & Data</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>No data is transmitted to FamilyLegacyPlatform servers</li>
                <li>No data storage by FamilyLegacyPlatform</li>
                <li>Marketplace is communication-only</li>
              </ul>
            </div>
            <div className="space-y-2 text-[10px] leading-tight opacity-80">
              <p className="font-bold text-secondary uppercase tracking-wider">Liability Disclaimer</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>FamilyLegacyPlatform is not responsible for: Services, Meetups, Outcomes, or Agreements between users</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-slate-400 italic leading-relaxed">
            “FamilyLegacyPlatform is self-hosted software. Hosting, domain, and database setup are your responsibility.”
          </p>
          <div className="pt-8 text-xs text-slate-300 border-t border-slate-100">
            © 2024 FamilyLegacyPlatform. Built for sovereignty.
          </div>
        </div>
      </div>
    </div>
  );
}
