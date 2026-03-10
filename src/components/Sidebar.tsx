import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Menu, X as CloseIcon, LogOut, Settings, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { Conversation } from '@/hooks/useConversations';
import logoImg from '@/assets/logo.png';

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
          'fixed left-0 top-0 z-40 h-full w-60 bg-sidebar flex flex-col border-r border-sidebar-border',
          'transition-transform duration-200 ease-out',
          'md:translate-x-0 md:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2.5 px-1 py-1">
            <img src={logoImg} alt="Rin AI" className="w-7 h-7 rounded-md object-cover" />
            <span className="font-semibold text-sm text-sidebar-foreground">Rin AI</span>
          </div>
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onToggle();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground rounded-md border border-sidebar-border hover:bg-sidebar-accent transition-colors"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-thin">
          {conversations.length === 0 ? (
            <p className="text-muted-foreground text-xs text-center py-8 px-3">
              No conversations yet
            </p>
          ) : (
            Object.entries(groupedConversations).map(([dateLabel, convs]) => (
              <div key={dateLabel} className="mb-3">
                <p className="text-[11px] font-medium text-muted-foreground px-2 py-1 uppercase tracking-wider">
                  {dateLabel}
                </p>
                <div className="space-y-px">
                  {convs.map(conversation => (
                    <div
                      key={conversation.id}
                      className={cn(
                        'group relative rounded-md transition-colors',
                        currentConversationId === conversation.id
                          ? 'bg-sidebar-accent'
                          : 'hover:bg-sidebar-accent/50'
                      )}
                    >
                      {editingId === conversation.id ? (
                        <div className="flex items-center gap-1 p-1.5">
                          <Input
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="h-7 text-xs bg-background border-border"
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEdit(conversation.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <button onClick={() => handleSaveEdit(conversation.id)} className="p-1 text-foreground hover:text-foreground/80">
                            <Check className="h-3 w-3" />
                          </button>
                          <button onClick={handleCancelEdit} className="p-1 text-muted-foreground hover:text-foreground">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectConversation(conversation.id);
                            if (window.innerWidth < 768) onToggle();
                          }}
                          className="w-full text-left px-2.5 py-2 pr-14"
                        >
                          <span className="text-sm text-sidebar-foreground truncate block">
                            {conversation.title}
                          </span>
                        </button>
                      )}

                      {editingId !== conversation.id && (
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => { e.stopPropagation(); handleStartEdit(conversation); }}
                            className="p-1 text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); onDeleteConversation(conversation.id); }}
                            className="p-1 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
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
        <div className="p-2 border-t border-sidebar-border space-y-1">
          {isAdmin && (
            <button
              className="w-full flex items-center gap-2 px-2.5 py-2 text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
              onClick={() => navigate('/admin')}
            >
              <Settings className="h-4 w-4" />
              Admin Panel
            </button>
          )}

          <div className="flex items-center gap-2 px-2.5 py-2">
            <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
              <span className="text-xs font-medium text-sidebar-foreground">
                {(profile?.display_name || profile?.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <p className="flex-1 text-sm text-sidebar-foreground truncate min-w-0">
              {profile?.display_name || profile?.email?.split('@')[0]}
            </p>
            <button
              onClick={handleSignOut}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <a
            href="https://github.com/sowmiyan-s"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
          >
            <Github className="h-3 w-3" />
            github.com/sowmiyan-s
          </a>
        </div>
      </aside>
    </>
  );
}
