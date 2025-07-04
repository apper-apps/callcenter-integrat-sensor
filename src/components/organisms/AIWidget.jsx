import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import aiService from '@/services/api/aiService'

const AIWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [activeConversation, setActiveConversation] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen && !activeConversation) {
      initializeConversation()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeConversation = async () => {
    try {
      const conversations = await aiService.getConversations()
      if (conversations.length > 0) {
        setActiveConversation(conversations[0])
        setMessages(conversations[0].messages)
      } else {
        const newConversation = await aiService.createConversation()
        setActiveConversation(newConversation)
        setMessages(newConversation.messages)
      }
    } catch (err) {
      toast.error('Failed to initialize AI chat')
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || sending || !activeConversation) return

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
      setActiveConversation(aiResponse)
      
    } catch (err) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const toggleWidget = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Widget Toggle Button */}
      <motion.button
        onClick={toggleWidget}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ApperIcon name={isOpen ? "X" : "Bot"} size={20} />
      </motion.button>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Bot" size={20} />
                  <h3 className="font-semibold">AI Assistant</h3>
                </div>
                <button
                  onClick={toggleWidget}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <ApperIcon name="Minus" size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="MessageCircle" size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Hi! How can I help you today?</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-100 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || sending}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ApperIcon name="Send" size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIWidget