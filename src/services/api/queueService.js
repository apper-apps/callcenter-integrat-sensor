import mockQueues from '@/services/mockData/queues.json'

class QueueService {
  constructor() {
    this.queues = [...mockQueues]
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 350))
    return [...this.queues]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const queue = this.queues.find(q => q.Id === parseInt(id))
    if (!queue) {
      throw new Error(`Queue with ID ${id} not found`)
    }
    return { ...queue }
  }

  async create(queueData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newQueue = {
      Id: Math.max(...this.queues.map(q => q.Id)) + 1,
      ...queueData,
      calls: []
    }
    this.queues.push(newQueue)
    return { ...newQueue }
  }

  async update(id, queueData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.queues.findIndex(q => q.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Queue with ID ${id} not found`)
    }
    this.queues[index] = { ...this.queues[index], ...queueData }
    return { ...this.queues[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = this.queues.findIndex(q => q.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Queue with ID ${id} not found`)
    }
    this.queues.splice(index, 1)
    return true
  }
}

export const queueService = new QueueService()