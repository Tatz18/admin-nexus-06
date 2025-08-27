import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PhotoUpload } from "./PhotoUpload";

interface PropertyFormProps {
  onSuccess: () => void;
  editProperty?: any;
}

export const PropertyForm = ({ onSuccess, editProperty }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    property_type: "",
    status: "available",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form with edit data
  useEffect(() => {
    const fetchPropertyImages = async () => {
      if (editProperty) {
        console.log("Editing property:", editProperty);
        setFormData({
          title: editProperty.title || "",
          description: editProperty.description || "",
          price: editProperty.price ? editProperty.price.toString() : "",
          location: editProperty.location || "",
          bedrooms: editProperty.bedrooms ? editProperty.bedrooms.toString() : "",
          bathrooms: editProperty.bathrooms ? editProperty.bathrooms.toString() : "",
          square_feet: editProperty.square_feet ? editProperty.square_feet.toString() : "",
          property_type: editProperty.property_type || "",
          status: editProperty.status || "available",
        });
        
        // Fetch all images for this property
        const { data: images, error } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', editProperty.id)
          .order('display_order', { ascending: true });
          
        if (images && !error) {
          setImageUrls(images.map(img => img.image_url));
        } else if (editProperty.image_url) {
          // Fallback to legacy single image
          setImageUrls([editProperty.image_url]);
        }
      } else {
        // Reset form for new property
        setFormData({
          title: "",
          description: "",
          price: "",
          location: "",
          bedrooms: "",
          bathrooms: "",
          square_feet: "",
          property_type: "",
          status: "available",
        });
        setImageUrls([]);
      }
    };

    fetchPropertyImages();
  }, [editProperty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        ...formData,
        user_id: '5dc24f73-992e-4717-9d3e-679827894ec5', // Existing admin user ID
        price: formData.price ? parseFloat(formData.price) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        image_url: imageUrls.length > 0 ? imageUrls[0] : null, // Keep first image for legacy compatibility
      };

      let propertyId = editProperty?.id;

      if (editProperty) {
        // Update existing property
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq('id', editProperty.id);

        if (error) throw error;

        // Delete existing images
        await supabase
          .from('property_images')
          .delete()
          .eq('property_id', editProperty.id);
      } else {
        // Create new property
        const { data, error } = await supabase
          .from("properties")
          .insert(propertyData)
          .select()
          .single();

        if (error) throw error;
        propertyId = data.id;
      }

      // Insert property images
      if (imageUrls.length > 0 && propertyId) {
        const imageData = imageUrls.map((url, index) => ({
          property_id: propertyId,
          image_url: url,
          display_order: index,
          alt_text: `${formData.title} - Image ${index + 1}`
        }));

        const { error: imageError } = await supabase
          .from('property_images')
          .insert(imageData);

        if (imageError) {
          console.error("Error saving property images:", imageError);
          toast({
            title: "Warning",
            description: "Property saved but some images failed to save",
            variant: "destructive",
          });
        }
      }

      // Reset form only if creating new property
      if (!editProperty) {
        setFormData({
          title: "",
          description: "",
          price: "",
          location: "",
          bedrooms: "",
          bathrooms: "",
          square_feet: "",
          property_type: "",
          status: "available",
        });
        setImageUrls([]);
      }

      toast({
        title: "Success",
        description: editProperty ? "Property updated successfully" : "Property added successfully",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Property Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter property title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Enter location"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="Enter price"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="property_type">Property Type</Label>
          <Select value={formData.property_type} onValueChange={(value) => handleInputChange("property_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="plot">Plot</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={(e) => handleInputChange("bedrooms", e.target.value)}
            placeholder="Number of bedrooms"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={(e) => handleInputChange("bathrooms", e.target.value)}
            placeholder="Number of bathrooms"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="square_feet">Square Feet</Label>
          <Input
            id="square_feet"
            type="number"
            value={formData.square_feet}
            onChange={(e) => handleInputChange("square_feet", e.target.value)}
            placeholder="Area in square feet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="block text-sm font-medium text-foreground mb-2">
          Property Photos
        </Label>
        <PhotoUpload 
          onUpload={setImageUrls}
          currentImageUrls={imageUrls}
          multiple={true}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter property description"
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading 
          ? (editProperty ? "Updating Property..." : "Adding Property...") 
          : (editProperty ? "Update Property" : "Add Property")
        }
      </Button>
    </form>
  );
};