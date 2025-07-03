import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
        <p className="text-gray-500">Please wait while we load your data...</p>
        
        <div className="mt-8 space-y-4 max-w-md mx-auto">
          <div className="shimmer h-4 bg-gray-200 rounded"></div>
          <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="shimmer h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </motion.div>
    </div>
  )
}

export default Loading