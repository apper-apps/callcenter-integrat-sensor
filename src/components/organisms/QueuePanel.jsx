import { useState } from 'react'
import { motion } from 'framer-motion'
import QueueCard from '@/components/molecules/QueueCard'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const QueuePanel = ({ queues, onQueueUpdate }) => {
  const [selectedQueue, setSelectedQueue] = useState(null)

  const getTotalWaiting = () => {
    return queues.reduce((total, queue) => total + queue.calls.length, 0)
  }

  const getOverallSLA = () => {
    const totalCalls = queues.reduce((total, queue) => total + queue.calls.length, 0)
    if (totalCalls === 0) return 100
    
    const metSLA = queues.reduce((total, queue) => {
      return total + queue.calls.filter(call => call.queueTime <= queue.slaTarget).length
    }, 0)
    
    return ((metSLA / totalCalls) * 100).toFixed(1)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Queue Monitor</h2>
          <p className="text-sm text-gray-500">
            {getTotalWaiting()} calls waiting • {getOverallSLA()}% SLA
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            icon="Settings"
            size="sm"
          >
            Configure
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            size="sm"
          >
            Add Queue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {queues.map((queue, index) => (
          <motion.div
            key={queue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedQueue(queue)}
            className="cursor-pointer"
          >
            <QueueCard queue={queue} />
          </motion.div>
        ))}
      </div>

      {selectedQueue && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-gray-200 pt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Queue Details: {selectedQueue.name}
            </h3>
            <Button
              variant="ghost"
              icon="X"
              size="sm"
              onClick={() => setSelectedQueue(null)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Waiting Calls</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedQueue.calls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Phone" size={16} className="text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{call.phoneNumber}</div>
                        <div className="text-sm text-gray-500">
                          Priority: {call.priority}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{call.queueTime}s</div>
                      <div className="text-sm text-gray-500">waiting</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Queue Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">SLA Target</span>
                  <span className="font-medium text-gray-900">{selectedQueue.slaTarget}s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Max Queue Size</span>
                  <span className="font-medium text-gray-900">100</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Overflow Action</span>
                  <span className="font-medium text-gray-900">Voicemail</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Music on Hold</span>
                  <span className="font-medium text-gray-900">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {queues.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ApperIcon name="Phone" size={64} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No queues configured</h3>
          <p className="text-gray-500 mb-4">Set up your first call queue to start routing calls</p>
          <Button
            variant="primary"
            icon="Plus"
          >
            Create Queue
          </Button>
        </div>
      )}
    </div>
  )
}

export default QueuePanel