import mockConversations from '@/services/mockData/aiConversations'

// Generate unique IDs for new conversations and messages
let nextConversationId = Math.max(...mockConversations.map(c => c.Id), 0) + 1
let nextMessageId = Math.max(...mockConversations.flatMap(c => c.messages.map(m => m.Id)), 0) + 1

// AI Response templates for realistic conversation
const aiResponses = {
  greeting: [
    "Hello! I'm here to help you with your call center operations. What would you like to know?",
    "Hi there! I can assist you with agent management, queue monitoring, analytics, and more. How can I help?",
    "Welcome! I'm your AI assistant for call center management. What can I help you with today?"
  ],
  agents: [
    "I can help you with agent management! You can monitor agent performance, track availability, and manage schedules. Would you like me to show you current agent metrics?",
    "For agent-related questions, I can help with performance tracking, status monitoring, and scheduling. What specific information do you need?",
    "Agent management is one of my specialties! I can help with performance reports, availability tracking, and team optimization."
  ],
  queues: [
    "Queue management is crucial for optimal operations! I can help you monitor wait times, call volumes, and queue priorities. What queue metrics interest you?",
    "I can assist with queue optimization, monitoring call volumes, and managing priority settings. Which queue would you like to analyze?",
    "Queue monitoring helps improve customer experience. I can show you real-time statistics, historical trends, and optimization suggestions."
  ],
  analytics: [
    "Analytics provide valuable insights! I can help you understand call patterns, agent performance, customer satisfaction, and operational efficiency. What metrics would you like to explore?",
    "I can generate reports on call volumes, response times, agent productivity, and customer satisfaction. Which analytics dashboard interests you?",
    "Data-driven decisions improve operations! I can help analyze trends, identify bottlenecks, and suggest optimizations based on your metrics."
  ],
  settings: [
    "I can help you configure system settings, notification preferences, user permissions, and integration options. What settings would you like to adjust?",
    "System configuration is important for smooth operations. I can assist with user management, notification settings, and system preferences.",
    "Settings management ensures your system works optimally. I can help with configurations, user roles, and system preferences."
  ],
  general: [
    "I'm here to help with all aspects of call center management. Could you be more specific about what you need assistance with?",
    "I can assist with agents, queues, analytics, settings, and general call center operations. What would you like to know more about?",
    "That's an interesting question! I can help with various call center topics. Could you provide more details about what you're looking for?"
  ]
}

const getAIResponse = (message) => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)]
  }
  
  if (lowerMessage.includes('agent') || lowerMessage.includes('staff') || lowerMessage.includes('team')) {
    return aiResponses.agents[Math.floor(Math.random() * aiResponses.agents.length)]
  }
  
  if (lowerMessage.includes('queue') || lowerMessage.includes('wait') || lowerMessage.includes('call')) {
    return aiResponses.queues[Math.floor(Math.random() * aiResponses.queues.length)]
  }
  
  if (lowerMessage.includes('analytics') || lowerMessage.includes('report') || lowerMessage.includes('metric')) {
    return aiResponses.analytics[Math.floor(Math.random() * aiResponses.analytics.length)]
  }
  
  if (lowerMessage.includes('setting') || lowerMessage.includes('config') || lowerMessage.includes('preference')) {
    return aiResponses.settings[Math.floor(Math.random() * aiResponses.settings.length)]
  }
  
  return aiResponses.general[Math.floor(Math.random() * aiResponses.general.length)]
}

const aiService = {
  // Get all conversations
  getConversations: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockConversations]
  },

  // Get conversation by ID
  getConversationById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const conversation = mockConversations.find(c => c.Id === parseInt(id))
    if (!conversation) {
      throw new Error('Conversation not found')
    }
    return { ...conversation }
  },

  // Create new conversation
  createConversation: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newConversation = {
      Id: nextConversationId++,
      title: `Conversation ${nextConversationId - 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          Id: nextMessageId++,
          content: "Hello! I'm your AI assistant. How can I help you with your call center operations today?",
          sender: 'ai',
          timestamp: new Date().toISOString()
        }
      ]
    }
    
    mockConversations.unshift(newConversation)
    return { ...newConversation }
  },

  // Add message to conversation
  addMessage: async (conversationId, messageData) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const conversation = mockConversations.find(c => c.Id === parseInt(conversationId))
    if (!conversation) {
      throw new Error('Conversation not found')
    }
    
    const newMessage = {
      Id: nextMessageId++,
      ...messageData,
      timestamp: new Date().toISOString()
    }
    
    conversation.messages.push(newMessage)
    conversation.updatedAt = new Date().toISOString()
    
    return { ...conversation }
  },

  // Send message and get AI response
  sendMessage: async (conversationId, message) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const conversation = mockConversations.find(c => c.Id === parseInt(conversationId))
    if (!conversation) {
      throw new Error('Conversation not found')
    }
    
    // Generate AI response
    const aiResponse = getAIResponse(message)
    
    // Add AI response to conversation
    const aiMessage = {
      Id: nextMessageId++,
      content: aiResponse,
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
    
    conversation.messages.push(aiMessage)
    conversation.updatedAt = new Date().toISOString()
    
    // Update conversation title if it's still default
    if (conversation.title.startsWith('Conversation ') && conversation.messages.length > 2) {
      conversation.title = message.slice(0, 30) + (message.length > 30 ? '...' : '')
    }
    
    return { ...conversation }
  },

  // Delete conversation
  deleteConversation: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockConversations.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Conversation not found')
    }
    
    mockConversations.splice(index, 1)
    return { success: true }
  },

  // Update conversation title
  updateConversationTitle: async (id, title) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const conversation = mockConversations.find(c => c.Id === parseInt(id))
    if (!conversation) {
      throw new Error('Conversation not found')
    }
    
    conversation.title = title
    conversation.updatedAt = new Date().toISOString()
    
    return { ...conversation }
  }
}

export default aiService