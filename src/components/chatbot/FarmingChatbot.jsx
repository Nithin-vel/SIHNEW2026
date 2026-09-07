import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageCircle, X, Send, Sparkles, User, RefreshCw, Sprout } from 'lucide-react';
import './FarmingChatbot.css';

const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: 'Namaste! 🙏 Welcome to **Farmogram AI Assistant**.\n\nI am your 24/7 smart farming advisor. How can I assist your farm today?',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestions: [
    'Best crop for Kharif season',
    'Fertilizer dose for Wheat',
    'How to control sucking pests',
    'Drip irrigation tips',
    'PM-KISAN scheme info'
  ]
};

// Fallback offline advisor responses when backend server is offline or restarting
const OFFLINE_KNOWLEDGE = [
  {
    keys: ['crop', 'sow', 'plant', 'season', 'kharif', 'rabi'],
    reply: '🌱 **Crop Advisory:**\n• Kharif (Jun-Oct): Paddy, Maize, Cotton, Soybean\n• Rabi (Oct-Mar): Wheat, Mustard, Chickpea\n• Zaid (Mar-Jun): Watermelon, Cucumber, Fodder\n\nEnsure treated seeds are used for higher germinability!',
    suggestions: ['Wheat fertilizer tips', 'Paddy irrigation', 'Pest remedies']
  },
  {
    keys: ['fertilizer', 'npk', 'urea', 'dap', 'soil'],
    reply: '🧪 **Fertilizer Guidance:**\n• Recommended general NPK ratio is 4:2:1.\n• Apply DAP/SSP as basal dose during land preparation.\n• Apply Urea in 2-3 split doses during active tillering/growth.',
    suggestions: ['Organic compost guide', 'Zinc deficiency signs', 'Soil test procedure']
  },
  {
    keys: ['pest', 'disease', 'spray', 'insect', 'yellow', 'fungus'],
    reply: '🛡️ **Pest & Disease Control:**\n• Spray Neem oil (5ml/L) for early-stage sucking pests.\n• For fungal blights, use Mancozeb 75% WP @ 2.5g/L.\n• Always spray during early morning or late evening.',
    suggestions: ['Yellow rust in wheat', 'Fall Armyworm control', 'Neem spray preparation']
  },
  {
    keys: ['water', 'irrigation', 'drip', 'rain'],
    reply: '💧 **Irrigation Advisory:**\n• Drip system saves up to 50% water in row crops.\n• Critical watering for Wheat: 21 days after sowing (CRI stage).\n• Ensure clear field drainage before heavy monsoons.',
    suggestions: ['Drip irrigation subsidy', 'Soil moisture retention']
  }
];

export const FarmingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([DEFAULT_WELCOME_MESSAGE]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = Date.now().toString();

    // Append user message
    const newMessages = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: textToSend,
        time: currentTime
      }
    ];

    setMessages(newMessages);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      // Attempt backend API call
      const response = await fetch('/api/v1/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newMessages.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: data.reply,
            time: data.timestamp || currentTime,
            suggestions: data.suggestions || []
          }
        ]);
      } else {
        throw new Error('Backend endpoint unreachable');
      }
    } catch (error) {
      // Offline fallback matching logic
      const textLower = textToSend.toLowerCase();
      const matched = OFFLINE_KNOWLEDGE.find(item =>
        item.keys.some(k => textLower.includes(k))
      );

      const fallbackReply = matched
        ? matched.reply
        : `🌾 **Farming Advisory Support:**\n\nThank you for reaching out regarding *"${textToSend}"*.\n\nFor best recommendations, ask about specific crops (e.g. Wheat, Paddy, Cotton), soil nutrients, pest control, or weather management.`;

      const fallbackSuggestions = matched
        ? matched.suggestions
        : DEFAULT_WELCOME_MESSAGE.suggestions;

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: fallbackReply,
          time: currentTime,
          suggestions: fallbackSuggestions
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          className="farming-chatbot-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Farming Assistant"
          title="Ask Farmogram AI Assistant"
        >
          <div className="launcher-icon-wrapper">
            <span className="launcher-pulse-ring" />
            <Bot size={22} />
            <span className="launcher-badge">AI</span>
          </div>
          <span>Farm AI Assistant</span>
        </button>
      )}

      {/* Floating Chatbot Window Modal */}
      {isOpen && (
        <div className="farming-chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <Sprout size={20} />
              </div>
              <div className="chatbot-title-container">
                <h4>Farmogram AI <Sparkles size={14} style={{ color: '#f59e0b' }} /></h4>
                <div className="chatbot-status">
                  <span className="status-dot" />
                  <span>24/7 Smart Agriculture Expert</span>
                </div>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                className="header-action-btn"
                onClick={handleResetChat}
                title="Reset Conversation"
              >
                <RefreshCw size={15} />
              </button>
              <button
                className="header-action-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="chatbot-messages-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                <div className="message-icon">
                  {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content-wrapper">
                  <div className="message-bubble">
                    {msg.text}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="suggestion-chips-container">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="suggestion-chip"
                          onClick={() => handleSendMessage(suggestion)}
                          disabled={isLoading}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing Animation */}
            {isLoading && (
              <div className="chat-message-row bot">
                <div className="message-icon">
                  <Bot size={16} />
                </div>
                <div className="typing-indicator">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="chatbot-input-area">
            <div className="chatbot-input-wrapper">
              <input
                type="text"
                className="chatbot-input"
                placeholder="Ask about crops, pests, fertilizers..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
            <button
              className="chatbot-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              title="Send Message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
