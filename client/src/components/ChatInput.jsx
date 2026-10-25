import React, { useState, useRef, useEffect } from 'react';

/**
 * ChatInput renders the auto-growing pill input pinned at the bottom
 */
function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-grow textarea up to ~5 lines (~120px max)
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isDisabled = !text.trim() || isLoading;

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <div className="input-pill-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Nebula..."
          rows={1}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <button
          type="submit"
          className="send-button"
          disabled={isDisabled}
          title="Send message"
          aria-label="Send message"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 14-8-4 14-3.5-3.5L5 12Z" />
            <path d="m11.5 14.5 7.5-10.5" />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default ChatInput;
