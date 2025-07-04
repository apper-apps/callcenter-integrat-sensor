import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import aiService from '@/services/api/aiService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const AIAgent = () => {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const data = await aiService.getConversations()
      setConversations(data)
      
      // Start with first conversation or create new one
      if (data.length > 0) {
        setActiveConversation(data[0])
        setMessages(data[0].messages)
      } else {
        await createNewConversation()
      }
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const createNewConversation = async () => {
    try {
      const newConversation = await aiService.createConversation()
      setConversations(prev => [newConversation, ...prev])
      setActiveConversation(newConversation)
      setMessages(newConversation.messages)
      toast.success('New conversation started')
    } catch (err) {
      toast.error('Failed to create conversation')
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || sending) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setSending(true)

    try {
      // Add user message
      const userMsgData = {
        content: userMessage,
        sender: 'user',
        timestamp: new Date().toISOString()
      }
      
      const updatedConversation = await aiService.addMessage(activeConversation.Id, userMsgData)
      setMessages(updatedConversation.messages)
      
      // Get AI response
      const aiResponse = await aiService.sendMessage(activeConversation.Id, userMessage)
      setMessages(aiResponse.messages)
      
      // Update conversation in list
      setConversations(prev => 
        prev.map(conv => 
          conv.Id === activeConversation.Id ? aiResponse : conv
        )
      )
      
      toast.success('Message sent successfully')
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const selectConversation = (conversation) => {
    setActiveConversation(conversation)
    setMessages(conversation.messages)
  }

  const deleteConversation = async (conversationId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return

    try {
      await aiService.deleteConversation(conversationId)
      setConversations(prev => prev.filter(conv => conv.Id !== conversationId))
      
      if (activeConversation?.Id === conversationId) {
        if (conversations.length > 1) {
          const nextConv = conversations.find(c => c.Id !== conversationId)
          setActiveConversation(nextConv)
          setMessages(nextConv.messages)
        } else {
          await createNewConversation()
        }
      }
      
      toast.success('Conversation deleted')
    } catch (err) {
      toast.error('Failed to delete conversation')
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadConversations} />

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
          <p className="text-gray-600">Get intelligent support for your call center operations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Conversation List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Plus"
                  onClick={createNewConversation}
                  className="text-primary hover:bg-primary/10"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-full">
              {conversations.map((conversation) => (
                <div
                  key={conversation.Id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    activeConversation?.Id === conversation.Id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {conversation.messages.length} messages
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteConversation(conversation.Id)
                      }}
                      className="text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="Bot" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-sm text-gray-500">Your intelligent call center helper</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="MessageCircle" size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                  <p className="text-gray-500">Ask me anything about your call center operations!</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">AI is typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    disabled={sending}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  icon="Send"
                  disabled={!inputMessage.trim() || sending}
                  className="px-6 py-3"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAgent