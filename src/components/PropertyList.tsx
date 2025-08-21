import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Home, MapPin, Bed, Bath, Square } from "lucide-react";

interface PropertyListProps {
  properties: any[];
  onUpdate: () => void;
  onEdit: (property: any) => void;
}

export const PropertyList = ({ properties, onUpdate, onEdit }: PropertyListProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    setLoading(id);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete property');
      }

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      onUpdate();
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "sold":
        return "destructive";
      case "rented":
        return "secondary";
      default:
        return "default";
    }
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <Home className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No properties found</h3>
        <p className="text-muted-foreground">Start by adding your first property.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          {property.image_url && (
            <div className="aspect-video bg-muted">
              <img
                src={property.image_url}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
              </div>
              <Badge variant={getStatusColor(property.status)}>
                {property.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {property.price && (
              <div className="text-2xl font-bold text-primary">
                {formatPrice(property.price)}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-muted-foreground">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.bathrooms}</span>
                </div>
              )}
              {property.square_feet && (
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.square_feet} sq ft</span>
                </div>
              )}
            </div>

            {property.property_type && (
              <Badge variant="outline" className="capitalize">
                {property.property_type}
              </Badge>
            )}

            {property.description && (
              <CardDescription className="line-clamp-3">
                {property.description}
              </CardDescription>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(property)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(property.id)}
                disabled={loading === property.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};