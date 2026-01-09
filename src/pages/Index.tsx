import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    messages,
    isLoading,
    sendMessage,
    stopGeneration,
    startNewChat,
    loadConversation,
    currentConversationId,
  } = useChat();

  const {
    conversations,
    fetchConversations,
    deleteConversation,
    renameConversation,
  } = useConversations();

  // Refetch conversations when a new one is created
  useEffect(() => {
    if (currentConversationId) {
      fetchConversations();
    }
  }, [currentConversationId, fetchConversations]);

  const handleSelectConversation = async (id: string) => {
    await loadConversation(id);
  };

  const handleDeleteConversation = async (id: string) => {
    const success = await deleteConversation(id);
    if (success && currentConversationId === id) {
      startNewChat();
    }
  };

  const handleRenameConversation = async (id: string, newTitle: string) => {
    await renameConversation(id, newTitle);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={startNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 flex flex-col min-w-0 md:pl-0 pl-0">
        {/* Mobile header spacer */}
        <div className="h-16 md:hidden shrink-0" />
        
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
          onStop={stopGeneration}
        />
      </main>
    </div>
  );
};

export default Index;
