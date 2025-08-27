-- Create property_images table to support multiple images per property
CREATE TABLE public.property_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Create policies for property_images
CREATE POLICY "Admin can manage all property images" 
ON public.property_images 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_images.property_id 
    AND properties.user_id = '5dc24f73-992e-4717-9d3e-679827894ec5'::uuid
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_images.property_id 
    AND properties.user_id = '5dc24f73-992e-4717-9d3e-679827894ec5'::uuid
  )
);

CREATE POLICY "Public can view images of available properties" 
ON public.property_images 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_images.property_id 
    AND properties.status = 'available'
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_property_images_updated_at
  BEFORE UPDATE ON public.property_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_property_images_display_order ON public.property_images(property_id, display_order);