import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{message || 'An unexpected error occurred. Please try again.'}</p>
        
        <div className="space-y-3">
          <Button
            variant="primary"
            icon="RefreshCw"
            onClick={onRetry}
            className="w-full"
          >
            Try Again
          </Button>
          
          <Button
            variant="ghost"
            icon="Home"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Info" size={16} className="text-red-600 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium mb-1">Need help?</p>
              <p>Contact your system administrator or check the system status page.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Error