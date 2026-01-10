import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MessageSquare, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface UserWithConversations {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  conversations: {
    id: string;
    title: string;
    created_at: string;
    messages: {
      id: string;
      role: string;
      content: string;
      created_at: string;
    }[];
  }[];
}

export default function Admin() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithConversations[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsersAndChats();
    }
  }, [isAdmin]);

  const fetchAllUsersAndChats = async () => {
    setLoadingData(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all conversations
      const { data: conversations, error: convsError } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (convsError) throw convsError;

      // Fetch all messages
      const { data: messages, error: msgsError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (msgsError) throw msgsError;

      // Combine data
      const usersWithData: UserWithConversations[] = (profiles || []).map(profile => {
        const userConversations = (conversations || [])
          .filter(c => c.user_id === profile.id)
          .map(conv => ({
            ...conv,
            messages: (messages || []).filter(m => m.conversation_id === conv.id),
          }));

        return {
          id: profile.id,
          email: profile.email,
          display_name: profile.display_name,
          created_at: profile.created_at,
          conversations: userConversations,
        };
      });

      setUsers(usersWithData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const toggleUser = (userId: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const toggleConversation = (convId: string) => {
    setExpandedConversations(prev => {
      const next = new Set(prev);
      if (next.has(convId)) {
        next.delete(convId);
      } else {
        next.add(convId);
      }
      return next;
    });
  };

  const filteredUsers = users.filter(u =>
    (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (u.display_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const totalMessages = users.reduce(
    (acc, u) => acc + u.conversations.reduce((a, c) => a + c.messages.length, 0),
    0
  );

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-sidebar">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage users and conversations</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-sidebar rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-sidebar rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {users.reduce((acc, u) => acc + u.conversations.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Conversations</p>
              </div>
            </div>
          </div>
          <div className="bg-sidebar rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalMessages}</p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by email or name..."
            className="pl-10 bg-sidebar border-border"
          />
        </div>

        {/* Users List */}
        <div className="space-y-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No users found
            </div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="bg-sidebar rounded-lg border border-border overflow-hidden">
                {/* User Header */}
                <button
                  onClick={() => toggleUser(user.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {(user.display_name || user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        {user.display_name || 'No name'}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {user.conversations.length} conversations
                    </span>
                    {expandedUsers.has(user.id) ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Conversations */}
                {expandedUsers.has(user.id) && (
                  <div className="border-t border-border">
                    {user.conversations.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-muted-foreground">No conversations</p>
                    ) : (
                      user.conversations.map(conv => (
                        <div key={conv.id} className="border-b border-border last:border-b-0">
                          <button
                            onClick={() => toggleConversation(conv.id)}
                            className="w-full px-4 py-2 pl-12 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                          >
                            <span className="text-sm text-foreground truncate">{conv.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {conv.messages.length} messages
                              </span>
                              {expandedConversations.has(conv.id) ? (
                                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                              )}
                            </div>
                          </button>

                          {/* Messages */}
                          {expandedConversations.has(conv.id) && (
                            <div className="px-4 py-2 pl-16 bg-background/50 space-y-2 max-h-96 overflow-y-auto">
                              {conv.messages.map(msg => (
                                <div
                                  key={msg.id}
                                  className={cn(
                                    'p-2 rounded text-sm',
                                    msg.role === 'user'
                                      ? 'bg-primary/10 text-foreground'
                                      : 'bg-secondary text-foreground'
                                  )}
                                >
                                  <p className="text-xs text-muted-foreground mb-1">
                                    {msg.role === 'user' ? 'User' : 'AI'}
                                  </p>
                                  <p className="whitespace-pre-wrap break-words">
                                    {msg.content.length > 500
                                      ? msg.content.slice(0, 500) + '...'
                                      : msg.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
