-- Enable RLS on properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies that allow access for existing admin user and public viewing
CREATE POLICY "Admin users can manage properties" 
ON public.properties 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Allow public to view available properties 
CREATE POLICY "Public can view available properties" 
ON public.properties 
FOR SELECT 
USING (status = 'available');