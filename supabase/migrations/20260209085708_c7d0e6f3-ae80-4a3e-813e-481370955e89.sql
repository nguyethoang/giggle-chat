
-- Drop existing RESTRICTIVE SELECT policies on profiles
DROP POLICY IF EXISTS "Users can view own profile and friends profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles with pending requests" ON public.profiles;

-- Recreate as PERMISSIVE policies restricted to authenticated users
CREATE POLICY "Users can view own profile and friends profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (auth.uid() = user_id) OR are_friends(auth.uid(), user_id)
);

CREATE POLICY "Users can view profiles with pending requests"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM friendships
    WHERE (
      (friendships.user_id = auth.uid() AND friendships.friend_id = profiles.user_id)
      OR (friendships.friend_id = auth.uid() AND friendships.user_id = profiles.user_id)
    )
  )
);
