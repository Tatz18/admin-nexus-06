import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText, Users, LogIn } from "lucide-react";


const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/d61cc3d8-5271-4eb9-92c5-efdda9c24652.png" 
              alt="Phoenix Realesthatic" 
              className="h-16 w-auto"
            />
          </div>
          <Link to="/auth">
            <Button>
              <LogIn className="h-4 w-4 mr-2" />
              Admin Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Property Management Dashboard
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Manage your real estate listings, blogs, and business operations
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 py-3">
              Access Dashboard
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Property Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Add, edit, and manage your property listings with detailed information,
                images, and pricing.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create and manage blog posts to engage with your audience and
                improve SEO.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track property performance, visitor statistics, and business
                metrics in real-time.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Login Info */}
        <Card className="mt-12 bg-muted/50">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This is a secure admin dashboard for authorized personnel only.
            </p>
            <Link to="/auth">
              <Button variant="outline">
                Go to Login Page
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;