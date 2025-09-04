-- Create storage policies for property-images bucket that allow public uploads
-- This will allow the localStorage auth system to work with Supabase storage

-- Allow anyone to upload to property-images bucket
CREATE POLICY "Allow public uploads to property-images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'property-images');

-- Allow anyone to view property-images (bucket is already public)
CREATE POLICY "Allow public read access to property-images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'property-images');

-- Allow anyone to update property-images
CREATE POLICY "Allow public updates to property-images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'property-images');

-- Allow anyone to delete property-images
CREATE POLICY "Allow public deletes from property-images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'property-images');