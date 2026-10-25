import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

/**
 * ChatWindow manages main chat viewport, message scroll, empty state, and input
 */
function ChatWindow({
  messages,
  isLoading,
  error,
  onSend,
  onToggleSidebar
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message whenever messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, error]);

  const isEmpty = messages.length === 0;

  return (
    <main className="chat-window">
      {/* Top Bar with Mobile Menu Toggle */}
      <header className="chat-header">
        <button
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Open sidebar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="header-title">Nebula</div>
      </header>

      {/* Messages Scroll Area */}
      <div className="chat-scroll-area">
        <div className="chat-column">
          {isEmpty ? (
            /* Centered Empty State */
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3a9 9 0 0 1 9 9" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h1 className="empty-heading">Nebula</h1>
              <p className="empty-subtext">How can I help you today?</p>
            </div>
          ) : (
            /* Message List */
            <div className="messages-list">
              {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
              ))}

              {/* Animated Loading Typing Indicator */}
              {isLoading && <TypingIndicator />}

              {/* Inline Friendly Error Message */}
              {error && (
                <div className="inline-error-banner" role="alert">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Pinned Bottom Input Area */}
      <footer className="chat-footer">
        <div className="footer-inner">
          <ChatInput onSend={onSend} isLoading={isLoading} />
        </div>
      </footer>
    </main>
  );
}

export default ChatWindow;
