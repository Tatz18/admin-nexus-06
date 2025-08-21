-- First drop all existing policies on properties table
DROP POLICY IF EXISTS "Admins can delete properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can insert properties" ON public.properties; 
DROP POLICY IF EXISTS "Admins can update properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can view all properties" ON public.properties;
DROP POLICY IF EXISTS "Public can view available properties" ON public.properties;
DROP POLICY IF EXISTS "Admin users can manage properties" ON public.properties;
DROP POLICY IF EXISTS "SimpleAuth admin can manage properties" ON public.properties;

-- Enable RLS on properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create new policies that work with existing data structure
-- Allow access for existing admin user (5dc24f73-992e-4717-9d3e-679827894ec5)
CREATE POLICY "Admin can manage all properties" 
ON public.properties 
FOR ALL 
USING (user_id = '5dc24f73-992e-4717-9d3e-679827894ec5'::uuid OR status = 'available') 
WITH CHECK (user_id = '5dc24f73-992e-4717-9d3e-679827894ec5'::uuid);

-- Allow public to view available properties
CREATE POLICY "Public can view available properties" 
ON public.properties 
FOR SELECT 
USING (status = 'available');