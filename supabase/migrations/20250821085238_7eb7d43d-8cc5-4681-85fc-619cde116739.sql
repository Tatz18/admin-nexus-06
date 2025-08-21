-- Enable RLS on properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Update policies to work with SimpleAuth admin system
-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can delete properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can insert properties" ON public.properties; 
DROP POLICY IF EXISTS "Admins can update properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can view all properties" ON public.properties;
DROP POLICY IF EXISTS "Public can view available properties" ON public.properties;

-- Create new policies that work with SimpleAuth (user_id = 'admin')
CREATE POLICY "SimpleAuth admin can manage properties" 
ON public.properties 
FOR ALL 
USING (user_id = 'admin' OR status = 'available') 
WITH CHECK (user_id = 'admin');

-- Allow public to view available properties
CREATE POLICY "Public can view available properties" 
ON public.properties 
FOR SELECT 
USING (status = 'available');