import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  onUpload: (urls: string[]) => void;
  currentImageUrls?: string[];
  multiple?: boolean;
}

export function PhotoUpload({ onUpload, currentImageUrls = [], multiple = true }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentImageUrls.length > 0) {
      setPreviewUrls(currentImageUrls);
    }
  }, [currentImageUrls]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    console.log('PhotoUpload: Starting upload process, valid files:', validFiles.length);
    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of validFiles) {
        console.log('PhotoUpload: Uploading file:', file.name);
        const fileExt = file.name.split('.').pop();
        const fileName = `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}: ${error.message}`,
            variant: "destructive",
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        const newPreviewUrls = multiple ? [...previewUrls, ...uploadedUrls] : uploadedUrls;
        setPreviewUrls(newPreviewUrls);
        onUpload(newPreviewUrls);
        
        toast({
          title: "Success",
          description: `${uploadedUrls.length} photo${uploadedUrls.length > 1 ? 's' : ''} uploaded successfully`,
        });
      } else if (validFiles.length > 0) {
        // Show error only if we had valid files but none uploaded successfully
        toast({
          title: "Upload failed",
          description: "No photos were uploaded successfully",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photos",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviewUrls);
    onUpload(newPreviewUrls);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
        {previewUrls.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Property preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                    disabled={uploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            {multiple && (
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={uploading}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add More Photos
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Property Photos</h3>
            <p className="text-muted-foreground mb-4">
              {multiple ? 'Select multiple images to upload' : 'Drag and drop your image here, or click to browse'}
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading}
              className="mb-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : multiple ? 'Choose Photos' : 'Choose Photo'}
            </Button>
            <p className="text-xs text-muted-foreground">
              PNG, JPG up to 5MB each {multiple ? '(Multiple files supported)' : ''}
            </p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}