import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import StatusBadge from '@/components/atoms/StatusBadge'

const QueueCard = ({ queue, className = '' }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error'
      case 'medium': return 'text-warning'
      case 'low': return 'text-success'
      default: return 'text-secondary'
    }
  }

  const getSLAStatus = (avgWaitTime, slaTarget) => {
    if (avgWaitTime <= slaTarget) return 'success'
    if (avgWaitTime <= slaTarget * 1.2) return 'warning'
    return 'error'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg shadow-lg border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{queue.name}</h3>
          <p className="text-sm text-gray-500">Queue ID: {queue.id}</p>
        </div>
        <StatusBadge status={getSLAStatus(queue.avgWaitTime, queue.slaTarget)}>
          SLA {queue.avgWaitTime <= queue.slaTarget ? 'Met' : 'Breach'}
        </StatusBadge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{queue.calls.length}</div>
          <div className="text-sm text-gray-500">Waiting</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{queue.avgWaitTime}s</div>
          <div className="text-sm text-gray-500">Avg Wait</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{queue.slaTarget}s</div>
          <div className="text-sm text-gray-500">SLA Target</div>
        </div>
      </div>

      {queue.calls.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Longest Wait</span>
            <span>{Math.max(...queue.calls.map(call => call.queueTime))}s</span>
          </div>
          <div className="space-y-1">
            {queue.calls.slice(0, 3).map((call, index) => (
              <div key={call.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" size={14} className={getPriorityColor(call.priority)} />
                  <span className="text-gray-900">{call.phoneNumber}</span>
                </div>
                <span className="text-gray-500">{call.queueTime}s</span>
              </div>
            ))}
          </div>
          {queue.calls.length > 3 && (
            <div className="text-xs text-gray-500 text-center">
              +{queue.calls.length - 3} more calls
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default QueueCard