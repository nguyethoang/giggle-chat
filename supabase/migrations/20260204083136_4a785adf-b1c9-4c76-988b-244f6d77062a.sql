-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view their own friendships" ON public.friendships;

-- Create new policy that allows viewing friendships in both directions
CREATE POLICY "Users can view their friendships" 
ON public.friendships 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = friend_id);