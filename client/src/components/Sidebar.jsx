import React from 'react';

/**
 * Sidebar component listing chat history with New Chat and Delete actions
 */
function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onClose
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header with Brand and New Chat button */}
        <div className="sidebar-header">
          <div className="brand-row">
            <div className="brand-logo">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 1 9 9" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="brand-name">Nebula</span>
            </div>

            {/* Close button visible only on mobile */}
            <button
              className="mobile-close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <button className="new-chat-btn" onClick={onNewChat}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        {/* Scrollable Chat History List */}
        <div className="chat-list-container">
          <div className="chat-list-label">Recent Conversations</div>
          {chats.length === 0 ? (
            <div className="empty-history-text">No previous chats</div>
          ) : (
            <ul className="chat-list">
              {chats.map((chat) => {
                const isActive = chat._id === activeChatId;
                return (
                  <li
                    key={chat._id}
                    className={`chat-item ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectChat(chat._id)}
                  >
                    <svg
                      className="chat-item-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>

                    <span className="chat-item-title" title={chat.title}>
                      {chat.title}
                    </span>

                    <button
                      className="delete-chat-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat._id);
                      }}
                      title="Delete chat"
                      aria-label="Delete chat"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
