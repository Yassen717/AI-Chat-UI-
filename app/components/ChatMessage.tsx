import { useState } from 'react';

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl relative group ${
          role === "user"
            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-none transform hover:scale-[1.02] transition-transform"
            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow-lg hover:shadow-xl transition-shadow"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        
        {/* Timestamp */}
        {timestamp && (
          <div className={`text-xs mt-2 opacity-70 ${
            role === "user" ? "text-white/70" : "text-gray-500 dark:text-gray-400"
          }`}>
            {formatTime(timestamp)}
          </div>
        )}
        
        {/* Copy button for assistant messages */}
        {role === "assistant" && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Copy message"
            title="Copy message"
          >
            {isCopied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
} 