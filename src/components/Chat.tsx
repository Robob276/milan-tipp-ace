import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  display_name?: string;
}

const Chat: React.FC = () => {
  const { currentPlayer } = usePlayer();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        async (payload) => {
          const newMsg = payload.new as ChatMessage;
          // Fetch display name for the new message from players
          const { data: player } = await supabase
            .from('players')
            .select('name')
            .eq('id', newMsg.user_id)
            .single();
          
          setMessages((prev) => [...prev, { ...newMsg, display_name: player?.name }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      // Fetch player names for all unique user_ids
      const userIds = [...new Set(messagesData?.map((m) => m.user_id) || [])];
      const { data: players } = await supabase
        .from('players')
        .select('id, name')
        .in('id', userIds);

      const playerMap = new Map(players?.map((p) => [p.id, p.name]));

      const messagesWithNames = messagesData?.map((m) => ({
        ...m,
        display_name: playerMap.get(m.user_id) || 'Unbekannt',
      })) || [];

      setMessages(messagesWithNames);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentPlayer || sending) return;

    setSending(true);
    try {
      const { error } = await supabase.from('chat_messages').insert({
        user_id: currentPlayer.id,
        message: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    messages.forEach((msg) => {
      const date = format(new Date(msg.created_at), 'yyyy-MM-dd');
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Tippgruppen-Chat</h2>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Lade Nachrichten...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Noch keine Nachrichten. Starte die Unterhaltung!
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex justify-center mb-3">
                    <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                      {format(new Date(date), 'EEEE, d. MMMM yyyy', { locale: de })}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {msgs.map((msg) => {
                      const isOwn = msg.user_id === currentPlayer?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 ${
                              isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {!isOwn && (
                              <p className="text-xs font-semibold text-primary mb-1">
                                {msg.display_name}
                              </p>
                            )}
                            <p className="text-sm break-words">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}
                            >
                              {format(new Date(msg.created_at), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSend} className="border-t p-3 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nachricht schreiben..."
            className="flex-1"
            maxLength={500}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
