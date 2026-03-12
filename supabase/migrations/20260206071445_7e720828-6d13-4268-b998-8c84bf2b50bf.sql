-- Fix: Restrict profile visibility to only friends and self
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

-- Create a security definer function to check if two users are friends
CREATE OR REPLACE FUNCTION public.are_friends(_user_id_1 uuid, _user_id_2 uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.friendships
    WHERE status = 'accepted'
      AND (
        (user_id = _user_id_1 AND friend_id = _user_id_2)
        OR (user_id = _user_id_2 AND friend_id = _user_id_1)
      )
  )
$$;

-- Create restricted policy: users can view their own profile OR profiles of accepted friends
CREATE POLICY "Users can view own profile and friends profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR public.are_friends(auth.uid(), user_id)
);

-- Also allow viewing profiles when there's a pending request (needed for friend requests UI)
CREATE POLICY "Users can view profiles with pending requests"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.friendships
    WHERE (user_id = auth.uid() AND friend_id = profiles.user_id)
       OR (friend_id = auth.uid() AND user_id = profiles.user_id)
  )
);