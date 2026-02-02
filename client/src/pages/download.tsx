import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Shield, Server, Heart, Globe } from "lucide-react";
import { Shell } from "@/components/layout/Shell";

export default function DownloadPage() {
  const handleDownload = async (type: 'wordpress' | 'standalone') => {
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
