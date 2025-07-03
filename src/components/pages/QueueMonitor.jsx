import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import QueuePanel from '@/components/organisms/QueuePanel'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { queueService } from '@/services/api/queueService'

const QueueMonitor = () => {
  const [queues, setQueues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadQueues = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await queueService.getAll()
      setQueues(data)
    } catch (err) {
      setError(err.message || 'Failed to load queues')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueues()
    
    // Set up real-time updates
    const interval = setInterval(loadQueues, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleQueueUpdate = async (queueId) => {
    try {
      console.log('Updating queue:', queueId)
      await loadQueues()
    } catch (err) {
      console.error('Failed to update queue:', err)
    }
  }

  const getQueueStats = () => {
    const totalCalls = queues.reduce((sum, q) => sum + q.calls.length, 0)
    const avgWaitTime = queues.length > 0 
      ? Math.round(queues.reduce((sum, q) => sum + q.avgWaitTime, 0) / queues.length)
      : 0
    
    const slaCompliance = totalCalls > 0
      ? Math.round((queues.reduce((sum, q) => {
          return sum + q.calls.filter(call => call.queueTime <= q.slaTarget).length
        }, 0) / totalCalls) * 100)
      : 100
    
    const longestWait = queues.reduce((max, q) => {
      const queueMax = q.calls.reduce((qMax, call) => Math.max(qMax, call.queueTime), 0)
      return Math.max(max, queueMax)
    }, 0)

    return {
      totalCalls,
      avgWaitTime,
      slaCompliance,
      longestWait,
      activeQueues: queues.filter(q => q.calls.length > 0).length
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadQueues} />
  }

  const stats = getQueueStats()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Monitor</h1>
          <p className="text-sm text-gray-500">
            Real-time queue monitoring and management
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            icon="Settings"
            size="sm"
          >
            Queue Settings
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            size="sm"
          >
            Create Queue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
              <div className="text-sm text-gray-500">Total Waiting</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-lg">
              <ApperIcon name="Phone" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.avgWaitTime}s</div>
              <div className="text-sm text-gray-500">Avg Wait Time</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-warning to-yellow-600 rounded-lg">
              <ApperIcon name="Clock" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.longestWait}s</div>
              <div className="text-sm text-gray-500">Longest Wait</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-error to-red-600 rounded-lg">
              <ApperIcon name="AlertTriangle" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-success">{stats.slaCompliance}%</div>
              <div className="text-sm text-gray-500">SLA Compliance</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-success to-green-600 rounded-lg">
              <ApperIcon name="Target" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.activeQueues}</div>
              <div className="text-sm text-gray-500">Active Queues</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-info to-blue-600 rounded-lg">
              <ApperIcon name="List" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <QueuePanel 
        queues={queues}
        onQueueUpdate={handleQueueUpdate}
      />
    </div>
  )
}

export default QueueMonitor