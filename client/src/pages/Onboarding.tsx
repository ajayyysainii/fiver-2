import { useAuth } from "@/hooks/use-auth";
import { useProfile, useCreateProfile, type UserRole } from "@/hooks/use-profile";
import { useLocation } from "wouter";
import { Users, Briefcase, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Onboarding() {
  const { user, isLoading } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const createProfile = useCreateProfile();
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  // If already has profile, skip onboarding
  if (!isProfileLoading && profile) {
    setLocation("/dashboard");
    return null;
  }

  const handleContinue = async () => {
    if (!selectedRole) return;
    await createProfile.mutateAsync(selectedRole);
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-secondary mb-4">Choose Your Path</h1>
          <p className="text-lg text-slate-600">Select how you intend to use the FamilyLegacy Platform.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Family Card */}
          <button
            onClick={() => setSelectedRole("family")}
            className={cn(
              "relative text-left p-8 rounded-2xl border-2 transition-all duration-300 bg-white group hover:shadow-xl",
              selectedRole === "family" 
                ? "border-primary ring-4 ring-primary/10 shadow-lg" 
                : "border-slate-200 hover:border-primary/50"
            )}
          >
            {selectedRole === "family" && (
              <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
              <Users className="w-7 h-7 text-primary group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-3">Family Leader</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              I want to secure my family's digital legacy. I will be the custodian of our private cloud.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-slate-500">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Single Family License
              </li>
              <li className="flex items-center text-sm text-slate-500">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                One-time platform fee
              </li>
            </ul>
          </button>

          {/* Professional Card */}
          <button
            onClick={() => setSelectedRole("pro")}
            className={cn(
              "relative text-left p-8 rounded-2xl border-2 transition-all duration-300 bg-white group hover:shadow-xl",
              selectedRole === "pro" 
                ? "border-primary ring-4 ring-primary/10 shadow-lg" 
                : "border-slate-200 hover:border-primary/50"
            )}
          >
             {selectedRole === "pro" && (
              <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Briefcase className="w-7 h-7 text-indigo-600 group-hover:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-secondary mb-3">Professional</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              I am an advisor, lawyer, or wealth manager. I want to offer this platform to my clients.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-slate-500">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Multi-Client Management
              </li>
              <li className="flex items-center text-sm text-slate-500">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                White-label capabilities
              </li>
            </ul>
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole || createProfile.isPending}
            className="btn-primary w-full md:w-auto min-w-[200px]"
          >
            {createProfile.isPending ? "Creating Profile..." : "Continue to Dashboard"}
            {!createProfile.isPending && <ArrowRight className="ml-2 w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
