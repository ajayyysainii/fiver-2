import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Shield, Server, Heart, Globe, Lock, ShoppingCart } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import { useProfile } from "@/hooks/use-profile";
import { useCart, PRODUCTS } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function DownloadPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { addItem, items } = useCart();
  const [, setLocation] = useLocation();

  const hasPaid = profile?.hasPaidOneTimeFee ?? false;

  const handleDownload = async (type: 'wordpress' | 'standalone') => {
    if (!hasPaid) {
      return; // Prevent download if not paid
    }
    try {
      const response = await fetch(`/api/download/${type}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'wordpress'
        ? 'family-legacy-wordpress-plugin.zip'
        : 'family-legacy-platform.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handlePayNow = () => {
    // Determine the appropriate onboarding product based on user's role
    const productId = profile?.role === 'pro'
      ? 'professional-onboarding-fee'
      : 'family-onboarding-fee';

    const onboardingProduct = PRODUCTS.find(p => p.id === productId);
    if (onboardingProduct && !items.some(item => item.id === onboardingProduct.id)) {
      addItem(onboardingProduct);
    }
    setLocation('/cart');
  };

  // Loading state
  if (isAuthLoading || isProfileLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-slate-500">Loading...</div>
        </div>
      </Shell>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <Shell>
        <div className="max-w-2xl mx-auto text-center py-20">
          <Lock className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-8">
            Please log in to access downloads.
          </p>
          <Button onClick={() => setLocation('/')}>
            Go to Home
          </Button>
        </div>
      </Shell>
    );
  }

  // Not paid state - show locked downloads
  if (!hasPaid) {
    return (
      <Shell>
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4">
              Your Family Legacy Platform Downloads
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              This platform will be installed on your own hosting. Your data stays with you. Always.
            </p>
          </header>

          {/* Payment Required Notice */}
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg mb-1 text-amber-800">Payment Required</h3>
                <p className="text-sm text-amber-700 mb-4">
                  Complete your onboarding payment to unlock download access. Once paid, you'll have full access to all platform downloads.
                </p>
                <Button onClick={handlePayNow} className="bg-amber-600 hover:bg-amber-700">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Complete Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Locked Download Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 opacity-60 pointer-events-none">
            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center mb-2 relative">
                  <Heart className="h-5 w-5 text-slate-400" />
                  <Lock className="h-4 w-4 text-slate-500 absolute -bottom-1 -right-1" />
                </div>
                <CardTitle className="font-display text-slate-400">WordPress (Recommended)</CardTitle>
                <CardDescription className="text-slate-400">
                  Best for most families. Works on regular web hosting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full" variant="outline">
                  <Lock className="mr-2 h-4 w-4" />
                  Locked - Payment Required
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center mb-2 relative">
                  <Server className="h-5 w-5 text-slate-400" />
                  <Lock className="h-4 w-4 text-slate-500 absolute -bottom-1 -right-1" />
                </div>
                <CardTitle className="font-display text-slate-400">Advanced / Custom Hosting</CardTitle>
                <CardDescription className="text-slate-400">
                  For advanced users with VPS or custom servers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled variant="outline" className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Locked - Payment Required
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/50 border-0">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display text-lg mb-2">Your Privacy, Protected</h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                The Family Legacy Platform does not store your data. All memory, media, and history
                live on your own server. We cannot access your family's information.
              </p>
            </CardContent>
          </Card>
        </div>
      </Shell>
    );
  }

  // Paid state - show downloads
  return (
    <Shell>
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4">
            Your Family Legacy Platform Downloads
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            This platform will be installed on your own hosting. Your data stays with you. Always.
          </p>
        </header>

        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg mb-1">Connect Your Own Domain</h3>
              <p className="text-sm text-muted-foreground">
                After installation, you'll need to connect your own domain name to your hosting.
                This keeps your family's memories at an address you own and control forever.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="hover-elevate">
            <CardHeader>
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-2">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="font-display">WordPress (Recommended)</CardTitle>
              <CardDescription>
                Best for most families. Works on regular web hosting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleDownload('wordpress')}
                className="w-full"
                data-testid="button-download-wordpress"
              >
                <Download className="mr-2 h-4 w-4" />
                Download WordPress Plugin
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center mb-2">
                <Server className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="font-display">Advanced / Custom Hosting</CardTitle>
              <CardDescription>
                For advanced users with VPS or custom servers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => handleDownload('standalone')}
                className="w-full"
                data-testid="button-download-standalone"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Standalone Platform
              </Button>
            </CardContent>
          </Card>
        </div>

        <section className="mb-12">
          <h2 className="font-display text-xl mb-6 text-center">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-6">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-medium">
                1
              </div>
              <p className="text-sm text-muted-foreground">Upload files to your hosting</p>
            </div>
            <div className="text-center p-6">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-medium">
                2
              </div>
              <p className="text-sm text-muted-foreground">Connect your own database</p>
            </div>
            <div className="text-center p-6">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-medium">
                3
              </div>
              <p className="text-sm text-muted-foreground">Add your domain and start preserving</p>
            </div>
          </div>
        </section>

        <Card className="bg-muted/50 border-0">
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-display text-lg mb-2">Your Privacy, Protected</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              The Family Legacy Platform does not store your data. All memory, media, and history
              live on your own server. We cannot access your family's information.
            </p>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
