import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactApexChart from 'react-apexcharts'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { analyticsService } from '@/services/api/analyticsService'

const Analytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState('today')

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const analyticsData = await analyticsService.getAnalytics(timeRange)
      setData(analyticsData)
    } catch (err) {
      setError(err.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const callVolumeOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    colors: ['#1e40af', '#10b981'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: data?.callVolume?.categories || [],
      labels: { style: { colors: '#6b7280' } }
    },
    yaxis: {
      labels: { style: { colors: '#6b7280' } }
    },
    grid: { borderColor: '#e5e7eb' },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px' }
    }
  }

  const agentPerformanceOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#3b82f6'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data?.agentPerformance?.categories || [],
      labels: { style: { colors: '#6b7280' } }
    },
    yaxis: {
      labels: { style: { colors: '#6b7280' } }
    },
    grid: { borderColor: '#e5e7eb' },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px' }
    }
  }

  const queueMetricsOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    labels: data?.queueMetrics?.labels || [],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' }
      }
    }],
    legend: {
      position: 'bottom',
      labels: { colors: '#6b7280' }
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadAnalytics} />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500">
            Call center performance insights and metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <Button
            variant="secondary"
            icon="Download"
            size="sm"
          >
            Export
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
              <div className="text-2xl font-bold text-gray-900">{data?.totalCalls || 0}</div>
              <div className="text-sm text-gray-500">Total Calls</div>
              <div className="text-xs text-success mt-1">+12% from yesterday</div>
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
              <div className="text-2xl font-bold text-gray-900">{data?.avgWaitTime || 0}s</div>
              <div className="text-sm text-gray-500">Avg Wait Time</div>
              <div className="text-xs text-success mt-1">-8% from yesterday</div>
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
              <div className="text-2xl font-bold text-gray-900">{data?.slaCompliance || 0}%</div>
              <div className="text-sm text-gray-500">SLA Compliance</div>
              <div className="text-xs text-success mt-1">+3% from yesterday</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-success to-green-600 rounded-lg">
              <ApperIcon name="Target" size={24} className="text-white" />
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
              <div className="text-2xl font-bold text-gray-900">{data?.customerSatisfaction || 0}</div>
              <div className="text-sm text-gray-500">Customer Satisfaction</div>
              <div className="text-xs text-success mt-1">+0.2 from yesterday</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-info to-blue-600 rounded-lg">
              <ApperIcon name="Star" size={24} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Call Volume Trends</h3>
            <ApperIcon name="TrendingUp" size={20} className="text-gray-400" />
          </div>
          <ReactApexChart
            options={callVolumeOptions}
            series={data?.callVolume?.series || []}
            type="area"
            height={350}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Agent Performance</h3>
            <ApperIcon name="BarChart" size={20} className="text-gray-400" />
          </div>
          <ReactApexChart
            options={agentPerformanceOptions}
            series={data?.agentPerformance?.series || []}
            type="bar"
            height={350}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Queue Distribution</h3>
            <ApperIcon name="PieChart" size={20} className="text-gray-400" />
          </div>
          <ReactApexChart
            options={queueMetricsOptions}
            series={data?.queueMetrics?.series || []}
            type="donut"
            height={350}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
            <ApperIcon name="Activity" size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-gray-600">Average Handle Time</span>
              </div>
              <span className="font-semibold text-gray-900">{data?.avgHandleTime || 0}s</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-gray-600">First Call Resolution</span>
              </div>
              <span className="font-semibold text-gray-900">{data?.firstCallResolution || 0}%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm text-gray-600">Call Abandonment Rate</span>
              </div>
              <span className="font-semibold text-gray-900">{data?.abandonmentRate || 0}%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-error rounded-full"></div>
                <span className="text-sm text-gray-600">Peak Hour Utilization</span>
              </div>
              <span className="font-semibold text-gray-900">{data?.peakUtilization || 0}%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics