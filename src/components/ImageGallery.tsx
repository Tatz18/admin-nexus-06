import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Image {
  id: string;
  image_url: string;
  display_order: number;
  alt_text?: string;
}

interface ImageGalleryProps {
  images: Image[];
  onRemove?: (imageId: string) => void;
  editable?: boolean;
  className?: string;
}

export function ImageGallery({ images, onRemove, editable = false, className }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);

  if (images.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No images available
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowLightbox(true);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : sortedImages.length - 1));
    } else {
      setSelectedImageIndex((prev) => (prev < sortedImages.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Image */}
        {sortedImages.length > 0 && (
          <div className="relative group">
            <img
              src={sortedImages[0].image_url}
              alt={sortedImages[0].alt_text || "Property image"}
              className="w-full h-64 md:h-80 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => handleImageClick(0)}
            />
            {editable && onRemove && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(sortedImages[0].id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Thumbnail Grid */}
        {sortedImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {sortedImages.slice(1).map((image, index) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.image_url}
                  alt={image.alt_text || `Property image ${index + 2}`}
                  className="w-full h-20 object-cover rounded-md cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleImageClick(index + 1)}
                />
                {editable && onRemove && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-1 -right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(image.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={sortedImages[selectedImageIndex].image_url}
              alt={sortedImages[selectedImageIndex].alt_text || "Property image"}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setShowLightbox(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation arrows */}
            {sortedImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {sortedImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}