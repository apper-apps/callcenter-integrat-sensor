import mockData from '@/services/mockData/inbox.json'

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Track next ID for new threads
let nextId = Math.max(...mockData.map(thread => thread.Id)) + 1

// Local data copy
let inboxData = [...mockData]

export const inboxService = {
  async getAll() {
    await delay(300)
    return [...inboxData]
  },

  async getById(id) {
    await delay(200)
    const thread = inboxData.find(t => t.Id === parseInt(id))
    if (!thread) {
      throw new Error('Thread not found')
    }
    return { ...thread }
  },

  async create(threadData) {
    await delay(300)
    const newThread = {
      Id: nextId++,
      ...threadData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      unreadCount: 0,
      messages: []
    }
    inboxData.push(newThread)
    return { ...newThread }
  },

  async update(id, threadData) {
    await delay(300)
    const index = inboxData.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Thread not found')
    }
    
    inboxData[index] = {
      ...inboxData[index],
      ...threadData,
      lastActivity: new Date().toISOString()
    }
    return { ...inboxData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = inboxData.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Thread not found')
    }
    
    const deletedThread = inboxData.splice(index, 1)[0]
    return { ...deletedThread }
  },

  async updateStatus(id, status) {
    await delay(250)
    const index = inboxData.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Thread not found')
    }
    
    inboxData[index].status = status
    inboxData[index].lastActivity = new Date().toISOString()
    return { ...inboxData[index] }
  },

  async assignAgent(id, agentId) {
    await delay(250)
    const index = inboxData.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Thread not found')
    }
    
    inboxData[index].assignedAgent = {
      id: agentId,
      name: 'Agent ' + agentId
    }
    inboxData[index].lastActivity = new Date().toISOString()
    return { ...inboxData[index] }
  },

  async reply(id, message) {
    await delay(400)
    const index = inboxData.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Thread not found')
    }
    
    const newMessage = {
      sender: 'agent',
      content: message,
      timestamp: new Date().toISOString()
    }
    
    inboxData[index].messages.push(newMessage)
    inboxData[index].lastActivity = new Date().toISOString()
    inboxData[index].unreadCount = 0
    
    return { ...inboxData[index] }
  },

  async markAsRead(id) {
    await delay(200)
    const index = inboxData.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Thread not found')
    }
    
    inboxData[index].unreadCount = 0
    return { ...inboxData[index] }
  },

  async getByChannel(channel) {
    await delay(250)
    return inboxData
      .filter(thread => thread.channel === channel)
      .map(thread => ({ ...thread }))
  },

  async getByStatus(status) {
    await delay(250)
    return inboxData
      .filter(thread => thread.status === status)
      .map(thread => ({ ...thread }))
  },

  async getByPriority(priority) {
    await delay(250)
    return inboxData
      .filter(thread => thread.priority === priority)
      .map(thread => ({ ...thread }))
  },

  async search(query) {
    await delay(300)
    const searchTerm = query.toLowerCase()
    return inboxData
      .filter(thread => 
        thread.subject.toLowerCase().includes(searchTerm) ||
        thread.contact.name.toLowerCase().includes(searchTerm) ||
        thread.contact.email.toLowerCase().includes(searchTerm) ||
        thread.messages.some(msg => msg.content.toLowerCase().includes(searchTerm))
      )
      .map(thread => ({ ...thread }))
  }
}