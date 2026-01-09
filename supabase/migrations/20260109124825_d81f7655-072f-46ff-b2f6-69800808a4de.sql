-- Fix chat_messages DELETE policy to only allow deleting own messages
DROP POLICY IF EXISTS "Anyone can delete own messages" ON public.chat_messages;

CREATE POLICY "Players can delete own messages" 
ON public.chat_messages 
FOR DELETE 
USING (user_id = public.current_player_id());