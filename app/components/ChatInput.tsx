import { useEffect } from 'react';

interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function ChatInput({ message, onMessageChange, onSubmit, isLoading }: ChatInputProps) {
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form && !isLoading && message.trim()) {
          form.requestSubmit();
        }
      }
      
      // Escape to clear input
      if (e.key === 'Escape') {
        onMessageChange('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [message, isLoading, onMessageChange]);

  return (
    <form onSubmit={onSubmit} className="p-6 border-t dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="flex space-x-4 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type your message here... (Ctrl+Enter to send, Esc to clear)"
            className="w-full p-4 mr-2 mx-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 ease-in-out"
            disabled={isLoading}
            aria-label="Chat message input"
            aria-describedby="input-help"
          />
          <div id="input-help" className="sr-only">
            Press Ctrl+Enter to send message, Escape to clear input
          </div>
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
          aria-label="Send message"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
} 