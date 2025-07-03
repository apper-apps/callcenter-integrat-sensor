import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data available", 
  description = "Get started by adding your first item",
  icon = "Database",
  actionLabel = "Add Item",
  onAction,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name={icon} size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      
      {onAction && (
        <Button
          variant="primary"
          icon="Plus"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
      
      <div className="mt-8 max-w-md mx-auto">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Lightbulb" size={16} className="text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Pro tip</p>
              <p>You can also import data from existing systems or use our quick setup wizard.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Empty