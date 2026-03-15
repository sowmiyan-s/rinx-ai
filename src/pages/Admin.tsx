import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, MessageSquare, Search, ChevronDown, ChevronRight,
  Shield, ShieldCheck, Trash2, RefreshCw, BarChart3, Clock, Mail,
  UserCheck, UserX, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const ADMIN_PASSWORD = '123321';

interface UserWithConversations {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  roles: string[];
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
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [users, setUsers] = useState<UserWithConversations[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'stats'>('users');
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Invalid access code');
    }
  };

  const fetchAllData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [profilesRes, conversationsRes, messagesRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('conversations').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at', { ascending: true }),
        supabase.from('user_roles').select('*'),
      ]);

      const profiles = profilesRes.data || [];
      const conversations = conversationsRes.data || [];
      const messages = messagesRes.data || [];
      const roles = rolesRes.data || [];

      const usersWithData: UserWithConversations[] = profiles.map(profile => {
        const userConversations = conversations
          .filter(c => c.user_id === profile.id)
          .map(conv => ({
            ...conv,
            messages: messages.filter(m => m.conversation_id === conv.id),
          }));

        const userRoles = roles
          .filter(r => r.user_id === profile.id)
          .map(r => r.role);

        return {
          id: profile.id,
          email: profile.email,
          display_name: profile.display_name,
          created_at: profile.created_at,
          roles: userRoles,
          conversations: userConversations,
        };
      });

      setUsers(usersWithData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  const toggleRole = async (userId: string, currentRoles: string[]) => {
    setRoleUpdating(userId);
    const isCurrentlyAdmin = currentRoles.includes('admin');

    try {
      if (isCurrentlyAdmin) {
        // Remove admin role
        await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
        toast({ title: 'Role updated', description: 'Admin role removed' });
      } else {
        // Add admin role
        await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
        toast({ title: 'Role updated', description: 'Admin role granted' });
      }
      // Refresh
      await fetchAllData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update role', variant: 'destructive' });
    } finally {
      setRoleUpdating(null);
    }
  };

  const deleteConversation = async (convId: string) => {
    try {
      await supabase.from('messages').delete().eq('conversation_id', convId);
      await supabase.from('conversations').delete().eq('id', convId);
      toast({ title: 'Deleted', description: 'Conversation removed' });
      await fetchAllData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const toggleUser = (userId: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  const toggleConversation = (convId: string) => {
    setExpandedConversations(prev => {
      const next = new Set(prev);
      next.has(convId) ? next.delete(convId) : next.add(convId);
      return next;
    });
  };

  const filteredUsers = users.filter(u =>
    (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (u.display_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const totalConversations = users.reduce((acc, u) => acc + u.conversations.length, 0);
  const totalMessages = users.reduce(
    (acc, u) => acc + u.conversations.reduce((a, c) => a + c.messages.length, 0), 0
  );
  const adminCount = users.filter(u => u.roles.includes('admin')).length;

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // --- Password Gate ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-destructive/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 w-full max-w-sm">
          <div className="glass rounded-3xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-destructive" />
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Admin Access</h1>
              <p className="text-xs text-muted-foreground">Enter access code to continue</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                placeholder="Access code"
                className="h-12 bg-secondary/50 border-border text-foreground rounded-xl text-center text-lg tracking-[0.3em] font-mono"
                autoFocus
              />
              {passwordError && (
                <p className="text-xs text-destructive text-center font-medium">{passwordError}</p>
              )}
              <Button type="submit" className="w-full h-11 rounded-xl font-bold text-sm">
                Authenticate
              </Button>
            </form>
            <Button variant="ghost" onClick={() => navigate('/')} className="w-full text-xs text-muted-foreground">
              ← Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Loading ---
  if (loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --- Main Admin Panel ---
  return (
    <div className="min-h-screen bg-background text-foreground overflow-y-auto">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-sidebar-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-foreground">Admin Console</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={fetchAllData} className="rounded-xl" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <div className="px-3 py-1.5 rounded-lg bg-accent border border-border">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-accent-foreground">Secure</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Users', value: users.length, icon: Users, color: 'text-blue-400' },
              { label: 'Admins', value: adminCount, icon: ShieldCheck, color: 'text-amber-400' },
              { label: 'Conversations', value: totalConversations, icon: MessageSquare, color: 'text-emerald-400' },
              { label: 'Messages', value: totalMessages, icon: BarChart3, color: 'text-purple-400' },
            ].map(stat => (
              <div key={stat.label} className="glass rounded-2xl p-4 glass-hover">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 glass rounded-xl w-fit">
            {(['users', 'stats'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === 'users' ? 'User Management' : 'Analytics'}
              </button>
            ))}
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="pl-11 h-12 bg-secondary/30 border-border rounded-xl"
                />
              </div>

              <div className="space-y-2">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-16 glass rounded-2xl">
                    <UserX className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">No users found</p>
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <div key={user.id} className="glass rounded-2xl overflow-hidden glass-hover">
                      {/* User Row */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        <button onClick={() => toggleUser(user.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                          <div className="w-10 h-10 rounded-xl bg-accent border border-border flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-foreground">
                              {(user.display_name || user.email || 'U')[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-foreground truncate">
                                {user.display_name || 'Unnamed User'}
                              </p>
                              {user.roles.includes('admin') && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold uppercase text-amber-400">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3" /> {user.email}
                              </span>
                              <span className="flex items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3" /> {formatDate(user.created_at)}
                              </span>
                            </div>
                          </div>
                        </button>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] font-bold text-muted-foreground mr-2 hidden sm:block">
                            {user.conversations.length} chats
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            disabled={roleUpdating === user.id}
                            onClick={() => toggleRole(user.id, user.roles)}
                            title={user.roles.includes('admin') ? 'Remove admin' : 'Make admin'}
                          >
                            {user.roles.includes('admin') ? (
                              <ShieldCheck className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Shield className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                          <button onClick={() => toggleUser(user.id)} className="p-2 rounded-lg hover:bg-accent transition-colors">
                            {expandedUsers.has(user.id) ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Conversations */}
                      {expandedUsers.has(user.id) && (
                        <div className="border-t border-border bg-secondary/20">
                          {user.conversations.length === 0 ? (
                            <div className="px-6 py-6 text-center">
                              <p className="text-xs text-muted-foreground">No conversations</p>
                            </div>
                          ) : (
                            <div className="p-3 space-y-1">
                              {user.conversations.map(conv => (
                                <div key={conv.id} className="rounded-xl bg-secondary/30 border border-border overflow-hidden">
                                  <div className="flex items-center px-4 py-2.5">
                                    <button
                                      onClick={() => toggleConversation(conv.id)}
                                      className="flex items-center gap-3 flex-1 min-w-0 text-left"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                      <span className="text-xs font-bold text-foreground truncate">{conv.title}</span>
                                      <span className="text-[10px] text-muted-foreground shrink-0">
                                        {conv.messages.length} msgs
                                      </span>
                                    </button>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => deleteConversation(conv.id)}
                                        title="Delete conversation"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                      {expandedConversations.has(conv.id) ? (
                                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                      )}
                                    </div>
                                  </div>

                                  {expandedConversations.has(conv.id) && (
                                    <div className="px-4 pb-4 pt-1 space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
                                      {conv.messages.map(msg => (
                                        <div
                                          key={msg.id}
                                          className={cn(
                                            'p-3 rounded-xl border text-xs',
                                            msg.role === 'user'
                                              ? 'bg-primary/5 border-primary/10'
                                              : 'bg-secondary/50 border-border'
                                          )}
                                        >
                                          <div className="flex items-center gap-2 mb-1.5">
                                            <div className={cn(
                                              "w-1.5 h-1.5 rounded-full",
                                              msg.role === 'user' ? "bg-blue-400" : "bg-muted-foreground/40"
                                            )} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                              {msg.role === 'user' ? 'User' : 'Assistant'}
                                            </span>
                                            <span className="text-[9px] text-muted-foreground/50 ml-auto">
                                              {formatDate(msg.created_at)}
                                            </span>
                                          </div>
                                          <p className="text-[12px] leading-relaxed whitespace-pre-wrap break-words text-foreground/80">
                                            {msg.content.length > 600 ? msg.content.slice(0, 600) + '…' : msg.content}
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
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> User Activity Overview
                </h2>
                <div className="space-y-3">
                  {users
                    .sort((a, b) => b.conversations.length - a.conversations.length)
                    .slice(0, 10)
                    .map(user => {
                      const msgCount = user.conversations.reduce((a, c) => a + c.messages.length, 0);
                      const maxMsgs = Math.max(...users.map(u => u.conversations.reduce((a, c) => a + c.messages.length, 0)), 1);
                      return (
                        <div key={user.id} className="flex items-center gap-3">
                          <div className="w-32 truncate text-xs text-muted-foreground font-medium">
                            {user.display_name || user.email || 'Unknown'}
                          </div>
                          <div className="flex-1 h-6 bg-secondary/50 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary/30 to-primary/60 rounded-lg flex items-center px-2 transition-all duration-500"
                              style={{ width: `${Math.max((msgCount / maxMsgs) * 100, 4)}%` }}
                            >
                              <span className="text-[10px] font-bold text-foreground">{msgCount}</span>
                            </div>
                          </div>
                          <div className="w-16 text-right">
                            <span className="text-[10px] text-muted-foreground">{user.conversations.length} chats</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass rounded-2xl p-6 space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <UserCheck className="w-4 h-4" /> Recent Signups
                  </h3>
                  {users.slice(0, 5).map(user => (
                    <div key={user.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{user.display_name || 'Unnamed'}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{formatDate(user.created_at)}</span>
                    </div>
                  ))}
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Admin Users
                  </h3>
                  {users.filter(u => u.roles.includes('admin')).length === 0 ? (
                    <p className="text-xs text-muted-foreground py-4 text-center">No admin users</p>
                  ) : (
                    users.filter(u => u.roles.includes('admin')).map(user => (
                      <div key={user.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{user.display_name || 'Unnamed'}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-[9px] font-bold text-amber-400">Admin</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
