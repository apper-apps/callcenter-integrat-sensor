import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import StatusIndicator from '@/components/atoms/StatusIndicator'
import Button from '@/components/atoms/Button'

const AgentCard = ({ agent, onStatusChange, className = '' }) => {
  const statusLabels = {
    available: 'Available',
    busy: 'On Call',
    break: 'On Break',
    offline: 'Offline'
  }

  const getCallDuration = (startTime) => {
    if (!startTime) return null
    const duration = Math.floor((Date.now() - startTime) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg shadow-lg border border-gray-100 p-6 transition-all duration-200 hover:shadow-xl ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {agent.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500">{agent.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusIndicator status={agent.status} size="md" animated={agent.status !== 'offline'} />
          <span className="text-sm font-medium text-gray-700">{statusLabels[agent.status]}</span>
        </div>
      </div>

      {agent.currentCall && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Phone" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {agent.currentCall.phoneNumber}
              </span>
            </div>
            <span className="text-sm text-blue-700 font-mono">
              {getCallDuration(agent.currentCall.startTime)}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{agent.metrics.callsToday}</div>
          <div className="text-sm text-gray-500">Calls Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{agent.metrics.avgHandleTime}s</div>
          <div className="text-sm text-gray-500">Avg Handle Time</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-sm text-gray-600">Skills: {agent.skills.join(', ')}</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          icon="MoreVertical"
          onClick={() => onStatusChange?.(agent.id)}
        />
      </div>
    </motion.div>
  )
}

export default AgentCard