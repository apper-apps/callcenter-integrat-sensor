import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import MetricCard from '@/components/atoms/MetricCard'
import Button from '@/components/atoms/Button'

const DashboardHeader = ({ metrics, onRefresh }) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Center Dashboard</h1>
          <p className="text-sm text-gray-500">
            Live monitoring - {formatTime(currentTime)}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            icon="RefreshCw"
            onClick={onRefresh}
            size="sm"
          >
            Refresh
          </Button>
          <Button
            variant="ghost"
            icon="Settings"
            size="sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Calls"
          value={metrics.activeCalls}
          icon="Phone"
          change={`+${metrics.activeCallsChange}`}
          changeType="positive"
        />
        <MetricCard
          title="Agents Available"
          value={`${metrics.availableAgents}/${metrics.totalAgents}`}
          icon="Users"
          change={`${((metrics.availableAgents / metrics.totalAgents) * 100).toFixed(1)}%`}
          changeType="positive"
        />
        <MetricCard
          title="Avg Wait Time"
          value={`${metrics.avgWaitTime}s`}
          icon="Clock"
          change={`${metrics.waitTimeChange}s`}
          changeType={metrics.waitTimeChange > 0 ? 'negative' : 'positive'}
        />
        <MetricCard
          title="SLA Performance"
          value={`${metrics.slaPerformance}%`}
          icon="Target"
          change={`${metrics.slaChange}%`}
          changeType={metrics.slaChange > 0 ? 'positive' : 'negative'}
        />
      </div>
    </div>
  )
}

export default DashboardHeader