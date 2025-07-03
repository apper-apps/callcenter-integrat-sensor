import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardHeader from '@/components/organisms/DashboardHeader'
import AgentGrid from '@/components/organisms/AgentGrid'
import QueuePanel from '@/components/organisms/QueuePanel'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { agentService } from '@/services/api/agentService'
import { queueService } from '@/services/api/queueService'

const Dashboard = () => {
  const [agents, setAgents] = useState([])
  const [queues, setQueues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [metrics, setMetrics] = useState({
    activeCalls: 0,
    activeCallsChange: 0,
    availableAgents: 0,
    totalAgents: 0,
    avgWaitTime: 0,
    waitTimeChange: 0,
    slaPerformance: 0,
    slaChange: 0
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [agentsData, queuesData] = await Promise.all([
        agentService.getAll(),
        queueService.getAll()
      ])

      setAgents(agentsData)
      setQueues(queuesData)
      
      // Calculate metrics
      const activeCalls = agentsData.filter(agent => agent.status === 'busy').length
      const availableAgents = agentsData.filter(agent => agent.status === 'available').length
      const totalWaiting = queuesData.reduce((total, queue) => total + queue.calls.length, 0)
      const avgWaitTime = queuesData.length > 0 
        ? Math.round(queuesData.reduce((total, queue) => total + queue.avgWaitTime, 0) / queuesData.length)
        : 0
      
      const totalCalls = queuesData.reduce((total, queue) => total + queue.calls.length, 0)
      const slaPerformance = totalCalls > 0 
        ? Math.round((queuesData.reduce((total, queue) => {
            return total + queue.calls.filter(call => call.queueTime <= queue.slaTarget).length
          }, 0) / totalCalls) * 100)
        : 100

      setMetrics({
        activeCalls,
        activeCallsChange: 2,
        availableAgents,
        totalAgents: agentsData.length,
        avgWaitTime,
        waitTimeChange: -5,
        slaPerformance,
        slaChange: 2.3
      })
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Set up real-time updates
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = async (agentId) => {
    try {
      // This would normally make an API call to update agent status
      console.log('Updating agent status:', agentId)
      await loadData()
    } catch (err) {
      console.error('Failed to update agent status:', err)
    }
  }

  const handleQueueUpdate = async (queueId) => {
    try {
      // This would normally make an API call to update queue
      console.log('Updating queue:', queueId)
      await loadData()
    } catch (err) {
      console.error('Failed to update queue:', err)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        metrics={metrics}
        onRefresh={loadData}
      />
      
      <div className="px-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AgentGrid 
              agents={agents}
              onStatusChange={handleStatusChange}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <QueuePanel 
              queues={queues}
              onQueueUpdate={handleQueueUpdate}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard