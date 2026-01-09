import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch conversations:', error);
    } else {
      setConversations(data || []);
    }
    setIsLoading(false);
  }, []);

  const deleteConversation = async (id: string) => {
    const { error } = await supabase.from('conversations').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete conversation:', error);
      return false;
    }
    setConversations(prev => prev.filter(c => c.id !== id));
    return true;
  };

  const renameConversation = async (id: string, newTitle: string) => {
    const { error } = await supabase
      .from('conversations')
      .update({ title: newTitle })
      .eq('id', id);

    if (error) {
      console.error('Failed to rename conversation:', error);
      return false;
    }
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title: newTitle } : c))
    );
    return true;
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    fetchConversations,
    deleteConversation,
    renameConversation,
  };
}
