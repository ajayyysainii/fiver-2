import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Shield, Database, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Landing() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (!isLoading && user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">FamilyLegacy</span>
          </div>
          <div className="flex items-center space-x-4">
             <a href="/api/login" className="btn-primary text-sm py-2 px-4">
               Login / Register
             </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-medium mb-8">
            <span className="flex w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            The Future of Digital Sovereignty
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-secondary leading-tight">
            We Distribute Software. <br/>
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              We Do Not Host Data.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
            Take full ownership of your family's digital legacy. 
            Deploy your own private cloud infrastructure with our enterprise-grade blueprints.
            Your data never touches our servers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/api/login" className="btn-primary w-full sm:w-auto text-lg px-8">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a href="#philosophy" className="btn-secondary w-full sm:w-auto text-lg px-8 text-slate-600">
              Learn Our Philosophy
            </a>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[120px]" />
        </div>
      </div>

      {/* Features Grid */}
      <div id="philosophy" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-premium">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Self-Hosted</h3>
              <p className="text-slate-600">
                You own the database. You own the storage. We simply provide the certified software blueprints to run it.
              </p>
            </div>
            
            <div className="card-premium">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Zero Knowledge</h3>
              <p className="text-slate-600">
                Since we don't host your data, we can't see it, sell it, or lose it. True privacy by design.
              </p>
            </div>

            <div className="card-premium">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Legacy Grade</h3>
              <p className="text-slate-600">
                Software built to last generations, not just until the next acquisition or pivot.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 FamilyLegacyPlatform. Built for sovereignty.
          </p>
        </div>
      </div>
    </div>
  );
}
