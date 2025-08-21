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
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form with edit data
  useEffect(() => {
    if (editProperty) {
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
        image_url: editProperty.image_url || "",
      });
    }
  }, [editProperty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        ...formData,
        user_id: 'admin', // SimpleAuth admin identifier
        price: formData.price ? parseFloat(formData.price) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
      };

      let error;
      if (editProperty) {
        // Update existing property
        const { error: updateError } = await supabase
          .from("properties")
          .update(propertyData)
          .eq('id', editProperty.id);
        error = updateError;
      } else {
        // Create new property
        const { error: insertError } = await supabase
          .from("properties")
          .insert(propertyData);
        error = insertError;
      }

      if (error) throw error;

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
          image_url: "",
        });
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

      <PhotoUpload
        currentImageUrl={formData.image_url}
        onUploadSuccess={(url) => handleInputChange("image_url", url)}
      />

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