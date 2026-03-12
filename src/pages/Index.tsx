import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';
import bannerImg from '@/assets/branding/banner.png';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

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

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-[100dvh] bg-[#070708] overflow-hidden text-foreground">
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

      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Desktop Gradient */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
          
          {/* Mobile Banner Background */}
          <div className="md:hidden absolute inset-0 opacity-[0.03] grayscale contrast-125">
            <img src={bannerImg} alt="" className="w-full h-full object-cover blur-3xl scale-125" />
          </div>
          <div className="md:hidden absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        {/* Mobile Header Spacer */}
        <div className="h-16 md:hidden shrink-0" />
        
        <div className="flex-1 min-h-0 relative z-10 flex flex-col">
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            onSend={sendMessage}
            onStop={stopGeneration}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
