import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AgentGrid from '@/components/organisms/AgentGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { agentService } from '@/services/api/agentService'

const AgentManagement = () => {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const loadAgents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await agentService.getAll()
      setAgents(data)
    } catch (err) {
      setError(err.message || 'Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAgents()
  }, [])

  const handleStatusChange = async (agentId) => {
    try {
      // This would normally make an API call to update agent status
      console.log('Updating agent status:', agentId)
      await loadAgents()
    } catch (err) {
      console.error('Failed to update agent status:', err)
    }
  }

  const getAgentStats = () => {
    const stats = {
      available: agents.filter(a => a.status === 'available').length,
      busy: agents.filter(a => a.status === 'busy').length,
      break: agents.filter(a => a.status === 'break').length,
      offline: agents.filter(a => a.status === 'offline').length,
      totalCalls: agents.reduce((sum, a) => sum + a.metrics.callsToday, 0),
      avgHandleTime: agents.length > 0 
        ? Math.round(agents.reduce((sum, a) => sum + a.metrics.avgHandleTime, 0) / agents.length)
        : 0
    }
    return stats
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadAgents} />
  }

  const stats = getAgentStats()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
          <p className="text-sm text-gray-500">
            Monitor and manage all call center agents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            icon="Grid3x3"
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            icon="List"
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            size="sm"
          >
            Add Agent
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{agents.length}</div>
              <div className="text-sm text-gray-500">Total Agents</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-lg">
              <ApperIcon name="Users" size={24} className="text-white" />
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
              <div className="text-2xl font-bold text-success">{stats.available}</div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-success to-green-600 rounded-lg">
              <ApperIcon name="UserCheck" size={24} className="text-white" />
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
              <div className="text-2xl font-bold text-error">{stats.busy}</div>
              <div className="text-sm text-gray-500">On Calls</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-error to-red-600 rounded-lg">
              <ApperIcon name="Phone" size={24} className="text-white" />
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
              <div className="text-2xl font-bold text-gray-900">{stats.avgHandleTime}s</div>
              <div className="text-sm text-gray-500">Avg Handle Time</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-info to-blue-600 rounded-lg">
              <ApperIcon name="Clock" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <AgentGrid 
        agents={agents}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}

export default AgentManagement