import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

/**
 * Root Nebula App component
 * Coordinates state between Sidebar and ChatWindow
 */
function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch list of chats for the sidebar
  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      if (!res.ok) throw new Error('Failed to load chat history');
      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  };

  // Load messages for a selected chat
  const handleSelectChat = async (id) => {
    if (id === activeChatId) {
      setIsSidebarOpen(false);
      return;
    }
    setError(null);
    setActiveChatId(id);
    setIsSidebarOpen(false);

    try {
      const res = await fetch(`/api/chats/${id}`);
      if (!res.ok) throw new Error('Could not load chat messages');
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Start a new blank chat
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setError(null);
    setIsSidebarOpen(false);
  };

  // Send a message to AI backend
  const handleSendMessage = async (text) => {
    setError(null);
    // Optimistically show user message right away
    const optimisticUserMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, optimisticUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatId: activeChatId
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response from Nebula AI');
      }

      // Update active chat ID if this was a new conversation
      if (!activeChatId && data._id) {
        setActiveChatId(data._id);
      }

      // Sync the messages returned by server (persisted in MongoDB)
      setMessages(data.messages);
      // Refresh chat list in sidebar
      fetchChats();
    } catch (err) {
      setError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a chat from MongoDB and update state
  const handleDeleteChat = async (id) => {
    try {
      const res = await fetch(`/api/chats/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete chat');

      setChats((prev) => prev.filter((c) => c._id !== id));

      // If active chat was deleted, reset to new blank chat
      if (activeChatId === id) {
        handleNewChat();
      }
    } catch (err) {
      setError('Could not delete chat session');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        error={error}
        onSend={handleSendMessage}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
    </div>
  );
}

export default App;
