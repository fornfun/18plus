export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-orange-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          <span className="text-orange-500">18</span>Plus
        </h2>
        <p className="text-gray-400">Loading amazing content...</p>
      </div>
    </div>
  );
}
