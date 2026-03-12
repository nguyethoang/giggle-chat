-- Add status column to friendships table for approval workflow
ALTER TABLE public.friendships 
ADD COLUMN status text NOT NULL DEFAULT 'pending' 
CHECK (status IN ('pending', 'accepted', 'declined'));

-- Update existing friendships to 'accepted' (grandfathered in)
UPDATE public.friendships SET status = 'accepted';

-- Drop existing update policy and create new one that allows friend to accept/decline
DROP POLICY IF EXISTS "Users can update their friendships" ON public.friendships;

-- Users can update friendships they initiated (e.g., toggle favorite)
CREATE POLICY "Users can update friendships they initiated" 
ON public.friendships 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Recipients can accept/decline friend requests (update status)
CREATE POLICY "Recipients can respond to friend requests" 
ON public.friendships 
FOR UPDATE 
USING (auth.uid() = friend_id AND status = 'pending');

-- Allow users to delete declined requests or requests they sent
DROP POLICY IF EXISTS "Users can remove friends" ON public.friendships;

CREATE POLICY "Users can remove friendships" 
ON public.friendships 
FOR DELETE 
USING (auth.uid() = user_id OR auth.uid() = friend_id);