import { useState, useEffect } from 'react';

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = 'ai-chat-history';

export function useChatStorage() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setChatHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [chatHistory]);

  const addMessage = (message: Omit<ChatMessage, 'timestamp'>) => {
    const messageWithTimestamp = {
      ...message,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, messageWithTimestamp]);
  };

  const clearChat = () => {
    setChatHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    chatHistory,
    addMessage,
    clearChat,
    setChatHistory
  };
} 