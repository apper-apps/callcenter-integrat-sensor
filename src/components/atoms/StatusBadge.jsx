import { motion } from 'framer-motion'

const StatusBadge = ({ status, children, className = '' }) => {
  const statusClasses = {
    available: "bg-green-100 text-green-800 border-green-200",
    busy: "bg-red-100 text-red-800 border-red-200",
    break: "bg-yellow-100 text-yellow-800 border-yellow-200",
    offline: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200"
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status]} ${className}`}
    >
      {children}
    </motion.span>
  )
}

export default StatusBadge