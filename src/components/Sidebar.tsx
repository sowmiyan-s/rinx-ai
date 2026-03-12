import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Menu, X as CloseIcon, LogOut, Settings, Github, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { Conversation } from '@/hooks/useConversations';
import logoImg from '@/assets/branding/logo.png';
import bannerImg from '@/assets/branding/banner.png';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const groupedConversations = conversations.reduce((groups, conv) => {
    const label = formatDate(conv.updated_at);
    if (!groups[label]) groups[label] = [];
    groups[label].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-3 left-3 z-50 md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        onClick={onToggle}
      >
        {isOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 bg-sidebar/80 backdrop-blur-xl flex flex-col border-r border-white/5',
          'transition-transform duration-300 ease-in-out',
          'md:translate-x-0 md:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Background Decoration */}
        <div className="md:hidden absolute inset-0 z-0 opacity-[0.05] pointer-events-none overflow-hidden">
          <img src={bannerImg} alt="" className="w-full h-full object-cover blur-2xl grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-sidebar via-transparent to-sidebar" />
        </div>

        {/* Header */}
        <div className="relative z-10 p-4 space-y-4">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <img src={logoImg} alt="Rin AI" className="relative w-8 h-8 rounded-lg object-cover shadow-lg border border-white/10" />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-sidebar-foreground">Rin AI</span>
          </div>
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onToggle();
            }}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-semibold text-sidebar-foreground rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all active:scale-[0.98] group shadow-xl"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              <span>New conversation</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-muted-foreground/60 border border-white/5 group-hover:text-primary transition-colors">⌘K</span>
          </button>
        </div>

        {/* Conversations */}
        <div className="relative z-10 flex-1 overflow-y-auto px-3 py-2 scrollbar-thin space-y-6">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-2">
              <MessageSquare className="h-8 w-8 text-muted-foreground/20" />
              <p className="text-muted-foreground/40 text-xs font-medium uppercase tracking-widest">
                Empty archive
              </p>
            </div>
          ) : (
            Object.entries(groupedConversations).map(([dateLabel, convs]) => (
              <div key={dateLabel} className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground/30 px-3 py-2 uppercase tracking-[0.2em]">
                  {dateLabel}
                </p>
                <div className="space-y-1">
                  {convs.map(conversation => (
                    <div
                      key={conversation.id}
                      className={cn(
                        'group relative rounded-xl transition-all duration-200',
                        currentConversationId === conversation.id
                          ? 'bg-white/[0.05] shadow-lg shadow-black/20 ring-1 ring-white/10'
                          : 'hover:bg-white/[0.03]'
                      )}
                    >
                      {editingId === conversation.id ? (
                        <div className="flex items-center gap-2 p-2">
                          <Input
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="h-8 text-xs bg-black/40 border-white/10 focus:ring-1 focus:ring-primary/40 rounded-lg"
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEdit(conversation.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <button onClick={() => handleSaveEdit(conversation.id)} className="p-1.5 text-primary hover:scale-110 transition-transform">
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectConversation(conversation.id);
                            if (window.innerWidth < 768) onToggle();
                          }}
                          className="w-full text-left px-3 py-2.5 pr-14"
                        >
                          <span className={cn(
                            'text-[13px] truncate block transition-colors font-medium',
                            currentConversationId === conversation.id
                              ? 'text-sidebar-foreground'
                              : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground'
                          )}>
                            {conversation.title}
                          </span>
                        </button>
                      )}

                      {editingId !== conversation.id && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={e => { e.stopPropagation(); handleStartEdit(conversation); }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground/60 hover:text-foreground transition-all"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); onDeleteConversation(conversation.id); }}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground/60 hover:text-destructive transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-2 bg-black/[0.1] backdrop-blur-md">
          {isAdmin && (
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-sidebar-foreground hover:bg-white/[0.05] rounded-xl transition-all"
              onClick={() => navigate('/admin')}
            >
              <Settings className="h-4 w-4" />
              Admin Access
            </button>
          )}

          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-all group">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-8 h-8 rounded-full bg-primary/10 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-primary">
                  {(profile?.display_name || profile?.email || 'U')[0].toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-sidebar-foreground truncate">
                {profile?.display_name || profile?.email?.split('@')[0]}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tight">Pro Account</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground/60 hover:text-foreground transition-all"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <a
            href="https://github.com/sowmiyan-s"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40 hover:text-primary transition-all group"
          >
            <div className="flex items-center gap-2">
              <Github className="h-3.5 w-3.5" />
              <span>sowmiyan-s</span>
            </div>
            <ArrowUp className="h-3 w-3 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </aside>
    </>
  );
}
