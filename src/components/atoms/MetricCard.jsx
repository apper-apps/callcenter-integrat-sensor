import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  trend = [], 
  className = '' 
}) => {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-secondary'
  }

  const changeIcons = {
    positive: 'TrendingUp',
    negative: 'TrendingDown',
    neutral: 'Minus'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg shadow-lg border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className={`flex items-center text-sm ${changeColors[changeType]}`}>
              <ApperIcon name={changeIcons[changeType]} size={16} className="mr-1" />
              <span className="font-medium">{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary to-blue-600 rounded-lg">
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
        )}
      </div>
      {trend.length > 0 && (
        <div className="mt-4 h-16 flex items-end space-x-1">
          {trend.map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-primary to-blue-500 rounded-sm opacity-70"
              style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default MetricCard