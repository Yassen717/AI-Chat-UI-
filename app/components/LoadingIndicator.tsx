export default function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-1">
          {/* First dot */}
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce"></div>
          {/* Second dot */}
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          {/* Third dot */}
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
} 