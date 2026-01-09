import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Menu, X as CloseIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/hooks/useConversations';

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={onToggle}
      >
        {isOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out',
          'md:translate-x-0 md:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              RinX AI
            </h1>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onToggle();
            }}
            className="mb-4 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-primary-foreground font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1">
            {conversations.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No conversations yet
              </p>
            ) : (
              conversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={cn(
                    'group relative rounded-lg transition-colors',
                    currentConversationId === conversation.id
                      ? 'bg-sidebar-accent'
                      : 'hover:bg-sidebar-accent/50'
                  )}
                >
                  {editingId === conversation.id ? (
                    <div className="flex items-center gap-2 p-2">
                      <Input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="h-8 text-sm bg-background"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveEdit(conversation.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0"
                        onClick={() => handleSaveEdit(conversation.id)}
                      >
                        <Check className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onSelectConversation(conversation.id);
                        if (window.innerWidth < 768) onToggle();
                      }}
                      className="w-full text-left p-3 pr-20"
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {conversation.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(conversation.updated_at)}
                          </p>
                        </div>
                      </div>
                    </button>
                  )}

                  {editingId !== conversation.id && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={e => {
                          e.stopPropagation();
                          handleStartEdit(conversation);
                        }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={e => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-sidebar-border">
            <p className="text-xs text-muted-foreground text-center">
              Powered by Mistral AI
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
