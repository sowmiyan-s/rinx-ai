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
    <div className="min-h-screen bg-[#070708] text-foreground">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 bg-sidebar/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">Admin Console</h1>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Manage & Audit Ecosystem</p>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">System Secure</span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-16 h-16" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">Total Users</p>
              <p className="text-4xl font-bold text-foreground tabular-nums tracking-tighter">{users.length}</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase text-green-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live Status
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MessageSquare className="w-16 h-16" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">Conversations</p>
              <p className="text-4xl font-bold text-foreground tabular-nums tracking-tighter">
                {users.reduce((acc, u) => acc + u.conversations.length, 0)}
              </p>
              <p className="mt-4 text-[10px] font-bold uppercase text-muted-foreground/40 italic">Active Sessions</p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="flex gap-1 items-center justify-center h-16 w-16">
                  <div className="w-1 h-8 bg-foreground rounded-full opacity-20" />
                  <div className="w-1 h-12 bg-foreground rounded-full opacity-20" />
                  <div className="w-1 h-6 bg-foreground rounded-full opacity-20" />
                </div>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">Total Signals</p>
              <p className="text-4xl font-bold text-foreground tabular-nums tracking-tighter">{totalMessages}</p>
              <p className="mt-4 text-[10px] font-bold uppercase text-muted-foreground/40 italic">Data processed</p>
            </div>
          </div>

          {/* Search & Audit List */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Audit users by identity or email..."
                className="pl-12 h-14 bg-white/[0.02] backdrop-blur-xl border-white/5 focus:border-white/10 text-foreground text-sm font-medium rounded-2xl transition-all"
              />
            </div>

            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/20">No matching identities found</p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className="bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden transition-all group/user shadow-2xl">
                    {/* User Header */}
                    <button
                      onClick={() => toggleUser(user.id)}
                      className="w-full px-6 py-4 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute -inset-0.5 bg-primary/20 rounded-full blur opacity-0 group-hover/user:opacity-100 transition duration-500" />
                          <div className="relative w-10 h-10 rounded-full bg-primary/10 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {(user.display_name || user.email || 'U')[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-foreground">
                            {user.display_name || 'Anonymous Identity'}
                          </p>
                          <p className="text-[11px] font-medium text-muted-foreground/60">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-bold text-foreground">{user.conversations.length}</p>
                          <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/40">Sessions</p>
                        </div>
                        <div className={cn(
                          "p-2 rounded-xl transition-all",
                          expandedUsers.has(user.id) ? "bg-white/10 text-foreground" : "text-muted-foreground/40 group-hover/user:text-foreground"
                        )}>
                          {expandedUsers.has(user.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>

                    {/* Conversations List */}
                    {expandedUsers.has(user.id) && (
                      <div className="border-t border-white/5 bg-black/20 animate-in fade-in slide-in-from-top-2 duration-300">
                        {user.conversations.length === 0 ? (
                          <div className="px-10 py-6">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/20">Archive empty for this identity</p>
                          </div>
                        ) : (
                          <div className="p-4 space-y-1">
                            {user.conversations.map(conv => (
                              <div key={conv.id} className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden group/conv">
                                <button
                                  onClick={() => toggleConversation(conv.id)}
                                  className="w-full px-6 py-3 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
                                >
                                  <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="p-1.5 rounded-lg bg-white/5 group-hover/conv:bg-primary/10 transition-colors">
                                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground group-hover/conv:text-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-foreground truncate">{conv.title}</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 whitespace-nowrap">
                                      {conv.messages.length} signals
                                    </span>
                                    {expandedConversations.has(conv.id) ? (
                                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                    )}
                                  </div>
                                </button>

                                {/* Signals Audit */}
                                {expandedConversations.has(conv.id) && (
                                  <div className="px-6 pb-6 pt-2 space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
                                    {conv.messages.map(msg => (
                                      <div
                                        key={msg.id}
                                        className={cn(
                                          'p-4 rounded-2xl border transition-all',
                                          msg.role === 'user'
                                            ? 'bg-primary/5 border-primary/10 text-foreground'
                                            : 'bg-white/5 border-white/5 text-foreground/80'
                                        )}
                                      >
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            msg.role === 'user' ? "bg-primary" : "bg-muted-foreground/60"
                                          )} />
                                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                                            {msg.role === 'user' ? 'Identity Signal' : 'AI Output'}
                                          </p>
                                        </div>
                                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words font-medium">
                                          {msg.content.length > 800
                                            ? msg.content.slice(0, 800) + '...'
                                            : msg.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
