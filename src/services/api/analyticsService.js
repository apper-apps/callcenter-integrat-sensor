import mockAnalytics from '@/services/mockData/analytics.json'

class AnalyticsService {
  constructor() {
    this.analytics = { ...mockAnalytics }
  }

  async getAnalytics(timeRange = 'today') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Generate different data based on time range
    const baseData = { ...this.analytics }
    
    switch (timeRange) {
      case 'week':
        baseData.totalCalls = 1247
        baseData.avgWaitTime = 28
        baseData.slaCompliance = 91
        break
      case 'month':
        baseData.totalCalls = 5429
        baseData.avgWaitTime = 32
        baseData.slaCompliance = 89
        break
      case 'quarter':
        baseData.totalCalls = 16287
        baseData.avgWaitTime = 35
        baseData.slaCompliance = 87
        break
      default:
        // Today data (default)
        break
    }
    
    return baseData
  }

  async getRealtimeMetrics() {
    await new Promise(resolve => setTimeout(resolve, 200))
    return {
      currentCalls: Math.floor(Math.random() * 50) + 10,
      waitingCalls: Math.floor(Math.random() * 20) + 5,
      avgWaitTime: Math.floor(Math.random() * 30) + 15,
      slaCompliance: Math.floor(Math.random() * 10) + 90
    }
  }
}

export const analyticsService = new AnalyticsService()