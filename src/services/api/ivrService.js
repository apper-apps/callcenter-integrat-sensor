import mockIVRFlows from '@/services/mockData/ivrFlows.json'

class IVRService {
  constructor() {
    this.flows = [...mockIVRFlows]
  }

  async getFlows() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.flows]
  }

  async getFlowById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const flow = this.flows.find(f => f.Id === parseInt(id))
    if (!flow) {
      throw new Error(`IVR Flow with ID ${id} not found`)
    }
    return { ...flow }
  }

  async create(flowData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newFlow = {
      Id: Math.max(...this.flows.map(f => f.Id)) + 1,
      ...flowData,
      nodes: [],
      version: '1.0',
      status: 'Draft'
    }
    this.flows.push(newFlow)
    return { ...newFlow }
  }

  async update(id, flowData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.flows.findIndex(f => f.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`IVR Flow with ID ${id} not found`)
    }
    this.flows[index] = { ...this.flows[index], ...flowData }
    return { ...this.flows[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.flows.findIndex(f => f.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`IVR Flow with ID ${id} not found`)
    }
    this.flows.splice(index, 1)
    return true
  }
}

export const ivrService = new IVRService()