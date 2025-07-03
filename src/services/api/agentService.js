import mockAgents from '@/services/mockData/agents.json'

class AgentService {
  constructor() {
    this.agents = [...mockAgents]
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.agents]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const agent = this.agents.find(a => a.Id === parseInt(id))
    if (!agent) {
      throw new Error(`Agent with ID ${id} not found`)
    }
    return { ...agent }
  }

  async create(agentData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newAgent = {
      Id: Math.max(...this.agents.map(a => a.Id)) + 1,
      ...agentData,
      metrics: {
        callsToday: 0,
        avgHandleTime: 0,
        ...agentData.metrics
      }
    }
    this.agents.push(newAgent)
    return { ...newAgent }
  }

  async update(id, agentData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.agents.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Agent with ID ${id} not found`)
    }
    this.agents[index] = { ...this.agents[index], ...agentData }
    return { ...this.agents[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.agents.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Agent with ID ${id} not found`)
    }
    this.agents.splice(index, 1)
    return true
  }
}

export const agentService = new AgentService()