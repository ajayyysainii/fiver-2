import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Shield, ArrowRight, CheckCircle2, Users, Briefcase, Lock, Globe, Server, HeartHandshake } from "lucide-react";
import familyBg from "@assets/stock_images/african_family_multi_fa706795.jpg";
import vaultImg from "@assets/stock_images/secure_private_digit_21d68cf7.jpg";
import meetingImg from "@assets/stock_images/professional_busines_653c1134.jpg";
import serverImg from "@assets/stock_images/modern_home_server_h_bc310856.jpg";
import promoVideo from "@assets/Family_Legacy_Platform__Secure_Family_Archive_1767583834324.mp4";
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
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={logoImg} alt="Logo" className="w-12 h-12 object-contain mix-blend-multiply" />
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

      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-center justify-center pt-20 bg-slate-900">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/20 to-white" />
        
        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 text-slate-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] leading-tight tracking-tight">
            Empowering Families with <br/>
            Privacy, Control, and Connection
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
            The self-hosted digital platform for families who value sovereignty and multi-generational legacy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/api/login" className="btn-primary text-lg py-4 px-8 flex items-center gap-2">
              Start Your Legacy <ArrowRight className="w-5 h-5" />
            </a>
            <button 
              onClick={() => document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
            >
              Watch Video
            </button>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div id="video-section" className="max-w-5xl mx-auto px-4 py-24 relative z-30">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-200 aspect-video relative group">
          <video 
            src={promoVideo} 
            className="w-full h-full object-cover"
            controls
            poster={familyBg}
          />
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-display font-bold text-secondary mb-4">Your Legacy. Your Infrastructure. Your Rules.</h2>
          <p className="text-slate-600 max-w-2xl mx-auto italic">
            "FamilyLegacyPlatform is built for families who care about privacy, independence, and long-term planning."
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-white py-24 relative z-30 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5 px-3 py-1">Built for Sovereignty</Badge>
              <h2 className="text-4xl font-display font-bold text-secondary mb-6 leading-tight">What Is FamilyLegacyPlatform?</h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  FamilyLegacyPlatform is a self-hosted digital platform designed to help families organize their legacy, communicate privately, and connect with trusted professionals — all while maintaining full ownership and control of their data.
                </p>
                <p>
                  Unlike traditional SaaS platforms, we do not host your information, manage your servers, or store your data. You receive the software, install it on your own hosting environment, and control everything.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-10">
                {[
                  { icon: Lock, title: "Privacy", desc: "No data leaves your server" },
                  { icon: Globe, title: "Independence", desc: "No forced dependencies" },
                  { icon: Server, title: "Ownership", desc: "You own the database" },
                  { icon: HeartHandshake, title: "Trust", desc: "Direct pro relations" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <item.icon className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-secondary text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl -rotate-2" />
              <img 
                src={vaultImg} 
                alt="Secure Digital Vault" 
                className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3] rotate-1" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hosting Section */}
      <div className="bg-slate-50 py-24 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
            <div className="md:order-2">
              <Badge variant="outline" className="mb-4 text-amber-600 border-amber-200 bg-amber-50 px-3 py-1">Self-Hosted by Design</Badge>
              <h2 className="text-4xl font-display font-bold text-secondary mb-6 leading-tight">You Control the Infrastructure</h2>
              <div className="space-y-4 text-slate-600">
                <p className="text-lg">This platform is intentionally designed as self-hosted software. This means:</p>
                <ul className="space-y-3">
                  {[
                    "You connect your own domain",
                    "You choose your hosting provider",
                    "You manage your own database",
                    "You control your backups and security"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:order-1 relative">
              <div className="absolute -inset-4 bg-amber-500/5 rounded-3xl rotate-2" />
              <img 
                src={serverImg} 
                alt="Self-Hosting Infrastructure" 
                className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3] -rotate-1" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Section */}
      <div className="py-24 relative z-30 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-secondary mb-4">Two Sides. One Trusted Ecosystem.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Connecting families with legacy-focused professionals in a private, paid-only environment.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:border-primary/20 transition-all group">
              <h3 className="text-2xl font-display font-bold text-primary mb-6 flex items-center gap-3">
                <Users className="w-8 h-8" /> Family Platform
              </h3>
              <ul className="space-y-4 text-slate-600 mb-8">
                {[
                  "Private family access & vault",
                  "Internal communication tools",
                  "Legacy organization features",
                  "Secure connection to the Family Marketplace"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <img src={familyBg} alt="Family Experience" className="rounded-xl w-full h-48 object-cover shadow-sm group-hover:shadow-md transition-all mix-blend-multiply" />
            </div>
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:border-amber-400/20 transition-all group">
              <h3 className="text-2xl font-display font-bold text-amber-600 mb-6 flex items-center gap-3">
                <Briefcase className="w-8 h-8" /> Professional Marketplace
              </h3>
              <ul className="space-y-4 text-slate-600 mb-8">
                {[
                  "Create a professional profile",
                  "Post services and content",
                  "Message verified family users",
                  "Build long-term professional relationships"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <img src={meetingImg} alt="Professional Experience" className="rounded-xl w-full h-48 object-cover shadow-sm group-hover:shadow-md transition-all mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>

      {/* Dual Section Content */}
      <div id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-30">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-secondary mb-4">Transparent Licensing</h2>
          <p className="text-slate-500">Simple, predictable pricing for a platform you own.</p>
        </div>
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
