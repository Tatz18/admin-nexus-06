import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PropertyForm } from "@/components/PropertyForm";
import { PropertyList } from "@/components/PropertyList";
import { BlogForm } from "@/components/BlogForm";
import { useSimpleAuth } from "@/components/SimpleAuth";
import { Plus, Home, FileText, LogOut, Calendar, Eye, Edit, Trash2, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Dashboard = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("properties");
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [blogs, setBlogs] = useState<any>([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [previewBlog, setPreviewBlog] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, signOut } = useSimpleAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const statusConfig = {
    published: {
      label: "Published",
      className: "bg-green-100 text-green-700 border-green-300",
      dot: "bg-green-600",
    },
    draft: {
      label: "Draft",
      className: "bg-yellow-100 text-yellow-700 border-yellow-300",
      dot: "bg-yellow-500",
    },
    archived: {
      label: "Archived",
      className: "bg-gray-100 text-gray-700 border-gray-300",
      dot: "bg-gray-500",
    },
  } as const;

  useEffect(() => {
    // Only redirect if we've finished initial loading and are definitely not authenticated
    if (!dashboardLoading && !isAuthenticated) {
      navigate("/auth");
    } else if (isAuthenticated) {
      fetchProperties();
      fetchBlogs();
    }
    setDashboardLoading(false);
  }, [isAuthenticated, navigate, dashboardLoading]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (
            id,
            image_url,
            display_order,
            alt_text
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive",
      });
    }
  };

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error: any) {
      console.log("Blog fetch error (table might not exist):", error);
      setBlogs([]);
    }
  };

  const handleBlogDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    setLoading(id);
    try {
      // Get blog data for storage cleanup
      const { data: blog, error: fetchError } = await supabase
        .from("blogs")
        .select("featured_image_url")
        .eq("id", id)
        .single();
      
        if(fetchError){
          console.error("Error fetching blog:", fetchError);
        }      
        // Clean up storage file if exists
        if (blog?.featured_image_url) {
          try {
            const url = blog.featured_image_url.split('/storage/v1/object/public/blogs/');
            const filePath = url[1];
          
            await supabase.storage
              .from('blogs')
              .remove([filePath]);
          } catch (storageError) {
            console.warn("Storage cleanup failed:", storageError);
          }
        }

      // Delete blog from database
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete Blog');
      }    

      toast({
        title: "Success",
        description: "Blog deleted successfully",
      });
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-1">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex flex-col">
            <div className="bg-white/5 p-1 rounded-lg inline-block">
              <img 
                src="/lovable-uploads/d61cc3d8-5271-4eb9-92c5-efdda9c24652.png" 
                alt="Phoenix Realesthatic" 
                className="h-30 w-auto max-w-sm"
                onError={(e) => {
                  console.error('Dashboard logo failed to load:', e);
                  const img = e.currentTarget;
                  const fallback = img.nextElementSibling as HTMLElement;
                  img.style.display = 'none';
                  if (fallback) fallback.style.display = 'block';
                }}
                onLoad={() => console.log('Dashboard logo loaded successfully')}
              />
              <div className="hidden text-lg font-bold text-primary">Phoenix Realesthatic</div>
            </div>
            <p className="text-muted-foreground text-xs -mt-1">Manage your properties and content</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
              <p className="text-xs text-muted-foreground">
                {properties.filter(p => p.status === 'available').length} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogs.length}</div>
              <p className="text-xs text-muted-foreground">Total published posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <span className="text-lg">₹</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{properties.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-muted-foreground">Total property value</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Properties Management</h2>
                <p className="text-muted-foreground">Manage your property listings</p>
              </div>
              <Button onClick={() => {
                setShowForm(!showForm);
                setEditingProperty(null);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                {showForm ? "Hide Form" : "Add Property"}
              </Button>
            </div>

            {(showForm || editingProperty) && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {editingProperty ? "Edit Property" : "Add New Property"}
                </h3>
                <PropertyForm 
                  editProperty={editingProperty}
                  onSuccess={() => {
                    setShowForm(false);
                    setEditingProperty(null);
                    fetchProperties();
                  }} 
                />
              </div>
            )}

            <PropertyList 
              properties={properties} 
              onUpdate={fetchProperties}
              onEdit={(property) => {
                console.log("Editing property:", property);
                setEditingProperty(property);
                setShowForm(false);
              }}
            />
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Blog Management</h2>
                <p className="text-muted-foreground">Create and manage blog posts</p>
              </div>
              <Button onClick={() => {
                setShowBlogForm(!showBlogForm); 
                setEditingBlog(null);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                {showBlogForm ? "Hide Form" : "Add Blog"}
              </Button>
            </div>
            {(showBlogForm || editingBlog) && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {editingBlog ? "Edit Blog" : "Add New Blog"}
                </h3>
                <BlogForm 
                  editBlog={editingBlog}
                  onSuccess={() => {
                    setShowBlogForm(false);
                    setEditingBlog(null);
                    fetchBlogs();
                  }} 
                />
              </div>
            )}

        <Dialog open={!!previewBlog} onOpenChange={() => setPreviewBlog(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
            {previewBlog && (
              <div className="bg-background rounded-xl shadow-lg">
                {/* ===== Sticky Header ===== */}
                <DialogHeader className="sticky top-0 z-50 bg-background border-b px-6 py-4">
                  <div className="flex items-start justify-between gap-4">

                    {/* Title */}
                    <DialogTitle className="text-2xl font-bold leading-tight pr-32">
                      {previewBlog?.title}
                    </DialogTitle>

                    {/* Right Actions */}
                    {previewBlog && (
                      <div className="absolute top-4 right-6 flex items-center gap-2">
                        
                        {/* Status */}
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border
                            ${statusConfig[previewBlog.status].className}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${statusConfig[previewBlog.status].dot}`}
                          />
                          {statusConfig[previewBlog.status].label}
                        </span>

                        {/* Close Button */}
                        <button
                          onClick={() => setPreviewBlog(null)}
                          className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                          aria-label="Close"
                        >
                          <XCircle />
                        </button>
                      </div>
                    )}

                  </div>
                </DialogHeader>

                {/* Featured Image */}
                {previewBlog.featured_image_url && (
                  <div className="relative overflow-hidden rounded-lg border bg-muted">
                    <img
                      src={previewBlog.featured_image_url}
                      alt={previewBlog.title}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}

                {/* Body */}
                <div className="p-3 space-y-3">
                  <h1 className="text-3xl font-bold tracking-tight leading-tight">
                    {previewBlog.title}
                  </h1>
                  {/* Slug */}
                  <div className="flex items-center gap-3 text-sm">
                    <code className="bg-muted px-3 py-1 rounded-md text-xs">
                      {previewBlog.slug}
                    </code>
                  </div>

                  {/* Subtitle */}
                  {previewBlog.excerpt && (
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                      {previewBlog.excerpt}
                    </p>
                  )}

                  {/* ===== Divider ===== */}
                  <div className="border-t" />

                  {/* Content */}
                  <div>
                    <div
                      className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: previewBlog.content }}
                    />
                  </div>

                  {/* Footer Meta */}
                  <div className="border-t pt-4 flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Created {new Date(previewBlog.created_at).toLocaleDateString()}
                    </span>
                    <span>
                      Updated {new Date(previewBlog.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>Manage your blog content</CardDescription>
              </CardHeader>
              <CardContent>
                {blogs.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No blog posts</h3>
                    <p className="text-muted-foreground">Start by creating your first blog post.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="relative border rounded-lg p-4 flex flex-col justify-between overflow-hidden">
                        <div className={`absolute top-6 right-[-48px] w-40 text-center transform rotate-45 text-xs font-bold shadow-lg ${statusConfig[blog.status].className}`}>
                          {statusConfig[blog.status].label}
                        </div>
                        
                        {blog.featured_image_url && (
                          <div className="bg-muted rounded-md mb-3 h-48 flex items-center justify-center">
                          <img
                            src={blog.featured_image_url}
                            alt={blog.title}
                            className="max-h-full max-w-full object-contain rounded-md"
                          />
                          </div>
                        )}

                        <div>
                          <h1 className="font-medium">{blog.title}</h1>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(blog.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 py-2 place-items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPreviewBlog(blog)}
                            disabled={!blog.featured_image_url && !blog.content}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setEditingBlog(blog);
                              setShowBlogForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleBlogDelete(blog.id)}
                            disabled={loading === blog.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
