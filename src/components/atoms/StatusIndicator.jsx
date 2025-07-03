import { motion } from 'framer-motion'

const StatusIndicator = ({ status, size = 'md', animated = true, className = '' }) => {
  const statusColors = {
    available: 'bg-success',
    busy: 'bg-error',
    break: 'bg-warning',
    offline: 'bg-secondary'
  }

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizes[size]} ${statusColors[status]} rounded-full`} />
      {animated && (
        <motion.div
          className={`absolute inset-0 ${sizes[size]} ${statusColors[status]} rounded-full opacity-30`}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  )
}

export default StatusIndicator