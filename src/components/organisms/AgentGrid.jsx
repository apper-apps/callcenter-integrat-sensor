import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AgentCard from '@/components/molecules/AgentCard'
import SearchBar from '@/components/molecules/SearchBar'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import Button from '@/components/atoms/Button'

const AgentGrid = ({ agents, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)

  const statusOptions = [
    { value: null, label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'busy', label: 'On Call' },
    { value: 'break', label: 'On Break' },
    { value: 'offline', label: 'Offline' }
  ]

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || agent.status === statusFilter.value
    return matchesSearch && matchesStatus
  })

  const getStatusCount = (status) => {
    return agents.filter(agent => agent.status === status).length
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Agent Management</h2>
          <p className="text-sm text-gray-500">
            {filteredAgents.length} of {agents.length} agents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <SearchBar
            placeholder="Search agents..."
            onSearch={setSearchTerm}
            className="w-64"
          />
          <FilterDropdown
            options={statusOptions}
            onSelect={setStatusFilter}
            placeholder="Filter by status"
            className="w-40"
          />
          <Button
            variant="primary"
            icon="Plus"
            size="sm"
          >
            Add Agent
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-800">{getStatusCount('available')}</div>
              <div className="text-sm text-green-600">Available</div>
            </div>
            <div className="w-3 h-3 bg-success rounded-full"></div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-800">{getStatusCount('busy')}</div>
              <div className="text-sm text-red-600">On Call</div>
            </div>
            <div className="w-3 h-3 bg-error rounded-full"></div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-800">{getStatusCount('break')}</div>
              <div className="text-sm text-yellow-600">On Break</div>
            </div>
            <div className="w-3 h-3 bg-warning rounded-full"></div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-800">{getStatusCount('offline')}</div>
              <div className="text-sm text-gray-600">Offline</div>
            </div>
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <AgentCard
                agent={agent}
                onStatusChange={onStatusChange}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchTerm('')
              setStatusFilter(null)
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default AgentGrid