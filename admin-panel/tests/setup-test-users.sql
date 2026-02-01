-- Admin Panel E2E Test Users Setup Script
-- Run this script in your Supabase SQL Editor to create test users

-- ============================================
-- 1. Create Test Admin User
-- ============================================

-- First, check if user already exists and delete if needed
DELETE FROM auth.users WHERE email = 'test@example.com';

-- Create test admin user
-- Note: You'll need to update the password hash or use Supabase Auth API
-- This is a placeholder - use Supabase Dashboard to create users manually
-- or use the Auth API from your application

-- Alternative: Use Supabase Auth API
-- POST https://your-project.supabase.co/auth/v1/signup
-- {
--   "email": "test@example.com",
--   "password": "testpassword123"
-- }

-- ============================================
-- 2. Create Test Super Admin User
-- ============================================

-- First, check if user already exists and delete if needed
DELETE FROM auth.users WHERE email = 'superadmin@example.com';

-- Create test super admin user
-- Same as above - use Supabase Dashboard or Auth API

-- ============================================
-- 3. Assign Roles (if you have a user_roles table)
-- ============================================

-- Example role assignment (adjust based on your schema)
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'
-- FROM auth.users
-- WHERE email = 'test@example.com';

-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'super_admin'
-- FROM auth.users
-- WHERE email = 'superadmin@example.com';

-- ============================================
-- 4. Verify Users Created
-- ============================================

SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email IN ('test@example.com', 'superadmin@example.com');

-- ============================================
-- NOTES
-- ============================================
-- 
-- For security reasons, Supabase doesn't allow direct password insertion via SQL.
-- You have three options to create test users:
--
-- Option 1: Use Supabase Dashboard
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Enter email and password
-- 4. Confirm email automatically
--
-- Option 2: Use Supabase Auth API
-- Use the signup endpoint with your service role key
--
-- Option 3: Use the provided Node.js script
-- Run: node tests/setup-test-users.js
--
