import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
//import ReactQuill from "react-quill";
//import "react-quill/dist/quill.snow.css";
import { supabase } from "@/integrations/supabase/client";

interface BlogFormProps {
  onSuccess: () => void;
  editBlog?: {
    id: string;
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featured_image_url?: string | null;
    status?: "draft" | "published" | "archived";
  };
}

interface BlogFormState {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  blog_image: File | null;
  status: "draft" | "published" | "archived";
}

/*
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};
*/

export const BlogForm = ({ onSuccess, editBlog }: BlogFormProps) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<BlogFormState>({
    title: "",
    content: "",
    excerpt: "",
    slug: "",
    blog_image: null,
    status: "draft",
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  /* Edit mode */

  useEffect(() => {
    if (!editBlog) return;

    setFormData({
      title: editBlog.title ?? "",
      content: editBlog.content ?? "",
      excerpt: editBlog.excerpt ?? "",
      slug: editBlog.slug ?? "",
      blog_image: null,
      status: editBlog.status ?? "draft",
    });

    if (editBlog.featured_image_url) {
      setImagePreview(editBlog.featured_image_url);
    }

  }, [editBlog]);


  const handleChange = (field: keyof BlogFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /*
  const isQuillEmpty = (value: string) => {
    return (
      !value ||
      value === "<p><br></p>" ||
      value.replace(/<(.|\n)*?>/g, "").trim().length === 0
    );
  };
  */

  const uploadBlogImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("blogs")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("blogs")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  /* Submit Data */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /*
    if (isQuillEmpty(formData.content)) {
      toast({
        title: "Content required",
        description: "Please enter blog content",
        variant: "destructive",
      });
      return;
    }
    */

    setLoading(true);

    try {
      let featuredImageUrl = editBlog?.featured_image_url  ?? null;

      if (formData.blog_image) {
        featuredImageUrl = await uploadBlogImage(formData.blog_image);
      }

      const blogData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim() || null,
        content: formData.content,
        status: formData.status,
        featured_image_url: featuredImageUrl,
      };

      if (editBlog) {
        if (!editBlog.id) {
          throw new Error("Blog ID missing. Cannot update.");
        }

        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", editBlog.id);

        if (error) throw error;
      } else {
        // CREATE new blog
        const { error } = await supabase
          .from("blogs")
          .insert(blogData);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: editBlog
          ? "Blog updated successfully"
          : "Blog created successfully",
      });

      onSuccess();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-card p-6 rounded-lg border"
    >
      {/* Title & Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Blog Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter blog title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            placeholder="my-blog-post"
            required
          />
        </div>
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Sub Title</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => handleChange("excerpt", e.target.value)}
          placeholder="Enter sub title"
          className="min-h-[120px]"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label>Blog Content</Label>
        <Textarea
          id="excerpt"
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="Enter content"
          className="min-h-[120px]"
        />
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-foreground">
          Blog Image
        </Label>

        <Input
          type="file"
          accept="image/*"
          required={!editBlog}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Set file
            setFormData((prev) => ({
              ...prev,
              blog_image: file,
            }));

            // Create preview
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            toast({
              title: "Image uploaded",
              description: "File uploaded successfully",
            });
          }}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-40 w-full object-cover rounded-md border"
            />
          </div>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            handleChange("status", value as BlogFormState["status"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? editBlog
            ? "Updating Blog..."
            : "Adding Blog..."
          : editBlog
          ? "Update Blog"
          : "Add Blog"}
      </Button>
    </form>
  );
};


