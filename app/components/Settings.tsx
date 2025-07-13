import { useState } from 'react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onClearChat: () => void;
}

export default function Settings({ isOpen, onClose, onClearChat }: SettingsProps) {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearChat = () => {
    setIsClearing(true);
    onClearChat();
    setTimeout(() => setIsClearing(false), 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* API Status */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">API Status</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {process.env.NEXT_PUBLIC_GOOGLE_API_KEY ? 'Connected' : 'Not configured'}
              </span>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">Keyboard Shortcuts</h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Enter</kbd> Send message</div>
              <div>• <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Esc</kbd> Clear input</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleClearChat}
              disabled={isClearing}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isClearing ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clearing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All Messages
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 