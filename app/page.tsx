"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import LoadingIndicator from "./components/LoadingIndicator";
import Settings from "./components/Settings";
import { useChatStorage } from "./hooks/useChatStorage";
import { aiService } from "./services/aiService";
import { validateMessage } from "./utils/validation";

export default function Home() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { chatHistory, addMessage, clearChat } = useChatStorage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate message
    const validation = validateMessage(message);
    if (!validation.isValid) {
      setError(validation.error || "Invalid message");
      return;
    }

    setError(null);
    
    // Add user message to chat
    const userMessage = { role: "user" as const, content: message };
    addMessage(userMessage);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await aiService.generateResponse(message);
      
      if (response.success && response.content) {
        const assistantMessage = { role: "assistant" as const, content: response.content };
        addMessage(assistantMessage);
      } else {
        const errorMessage = { 
          role: "assistant" as const, 
          content: response.error || "Sorry, an error occurred while processing your request. Please try again." 
        };
        addMessage(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: "assistant" as const, 
        content: "Sorry, an error occurred while processing your request. Please try again." 
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">AI Chat</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Open settings"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent hover:scrollbar-thumb-blue-600">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Welcome to AI Chat</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Start a new conversation with AI</p>
            </div>
          </div>
        )}

        {chatHistory.map((chat, index) => (
          <ChatMessage 
            key={index} 
            role={chat.role} 
            content={chat.content} 
            timestamp={chat.timestamp}
          />
        ))}
        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 py-2 bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Input Area */}
      <ChatInput
        message={message}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {/* Settings Modal */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearChat={clearChat}
      />
    </div>
  );
}
