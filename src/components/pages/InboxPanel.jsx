import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StatusBadge from '@/components/atoms/StatusBadge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { inboxService } from '@/services/api/inboxService'

const InboxPanel = () => {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedThread, setSelectedThread] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  const loadThreads = async () => {
    try {
      setLoading(true)
      setError(null)
      const threadsData = await inboxService.getAll()
      setThreads(threadsData)
    } catch (err) {
      setError(err.message || 'Failed to load inbox threads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadThreads()
    
    // Set up real-time updates
    const interval = setInterval(loadThreads, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread)
    setShowDetails(true)
  }

  const handleStatusUpdate = async (threadId, newStatus) => {
    try {
      await inboxService.updateStatus(threadId, newStatus)
      await loadThreads()
      toast.success(`Thread ${newStatus} successfully`)
    } catch (err) {
      toast.error('Failed to update thread status')
    }
  }

  const handleAssignAgent = async (threadId, agentId) => {
    try {
      await inboxService.assignAgent(threadId, agentId)
      await loadThreads()
      toast.success('Agent assigned successfully')
    } catch (err) {
      toast.error('Failed to assign agent')
    }
  }

  const handleReply = async (threadId, message) => {
    try {
      await inboxService.reply(threadId, message)
      await loadThreads()
      toast.success('Reply sent successfully')
    } catch (err) {
      toast.error('Failed to send reply')
    }
  }

  const filteredThreads = threads.filter(thread => {
    const matchesFilter = filter === 'all' || thread.status === filter
    const matchesSearch = thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return 'Mail'
      case 'chat': return 'MessageSquare'
      case 'sms': return 'Smartphone'
      case 'voice': return 'Phone'
      default: return 'Mail'
    }
  }

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'email': return 'text-blue-600'
      case 'chat': return 'text-green-600'
      case 'sms': return 'text-purple-600'
      case 'voice': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-orange-600 bg-orange-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      return 'Just now'
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadThreads} />
  }

  return (
    <div className="h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Mail" size={20} className="text-primary" />
              <span className="text-sm text-gray-600">
                {filteredThreads.length} threads
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              icon="RefreshCw"
              onClick={loadThreads}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <ApperIcon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'open', 'pending', 'closed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Thread List */}
        <div className="w-full lg:w-1/2 xl:w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4">
            {filteredThreads.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Inbox" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No threads found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredThreads.map((thread) => (
                  <motion.div
                    key={thread.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedThread?.Id === thread.Id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleThreadSelect(thread)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <ApperIcon 
                          name={getChannelIcon(thread.channel)} 
                          size={20} 
                          className={getChannelColor(thread.channel)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {thread.contact.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(thread.priority)}`}>
                              {thread.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 truncate">
                            {thread.subject}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs text-gray-500">
                          {formatTime(thread.lastActivity)}
                        </span>
                        <StatusBadge status={thread.status} />
                      </div>
                    </div>
                    
                    {thread.unreadCount > 0 && (
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {thread.channel.toUpperCase()}
                          </span>
                          {thread.assignedAgent && (
                            <span className="text-xs text-gray-500">
                              • {thread.assignedAgent.name}
                            </span>
                          )}
                        </div>
                        <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                          {thread.unreadCount}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thread Details */}
        <div className="flex-1 bg-white">
          {selectedThread ? (
            <div className="h-full flex flex-col">
              {/* Thread Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon 
                      name={getChannelIcon(selectedThread.channel)} 
                      size={24} 
                      className={getChannelColor(selectedThread.channel)}
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedThread.subject}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedThread.contact.name} • {selectedThread.contact.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon="User"
                      onClick={() => handleAssignAgent(selectedThread.Id, 'agent-1')}
                    >
                      Assign
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon="Check"
                      onClick={() => handleStatusUpdate(selectedThread.Id, 'closed')}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {selectedThread.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.sender === 'agent'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Section */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          handleReply(selectedThread.Id, e.target.value.trim())
                          e.target.value = ''
                        }
                      }}
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    icon="Send"
                    onClick={(e) => {
                      const input = e.target.closest('div').querySelector('input')
                      if (input.value.trim()) {
                        handleReply(selectedThread.Id, input.value.trim())
                        input.value = ''
                      }
                    }}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <ApperIcon name="MessageSquare" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Select a thread to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InboxPanel