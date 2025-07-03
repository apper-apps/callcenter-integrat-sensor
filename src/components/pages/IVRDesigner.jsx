import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { ivrService } from '@/services/api/ivrService'

const IVRDesigner = () => {
  const [flows, setFlows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFlow, setSelectedFlow] = useState(null)
  const [nodes, setNodes] = useState([])

  const loadFlows = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ivrService.getFlows()
      setFlows(data)
      if (data.length > 0 && !selectedFlow) {
        setSelectedFlow(data[0])
        setNodes(data[0].nodes || [])
      }
    } catch (err) {
      setError(err.message || 'Failed to load IVR flows')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFlows()
  }, [])

  const nodeTypes = [
    { type: 'welcome', label: 'Welcome Message', icon: 'MessageCircle', color: 'blue' },
    { type: 'menu', label: 'Menu Options', icon: 'List', color: 'green' },
    { type: 'queue', label: 'Queue Transfer', icon: 'Phone', color: 'purple' },
    { type: 'voicemail', label: 'Voicemail', icon: 'Mic', color: 'orange' },
    { type: 'hangup', label: 'Hang Up', icon: 'PhoneOff', color: 'red' }
  ]

  const addNode = (type) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      text: `New ${type} node`,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      connections: []
    }
    setNodes([...nodes, newNode])
  }

  const removeNode = (nodeId) => {
    setNodes(nodes.filter(node => node.id !== nodeId))
  }

  const updateNode = (nodeId, updates) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ))
  }

  const getNodeColor = (type) => {
    const nodeType = nodeTypes.find(nt => nt.type === type)
    return nodeType ? nodeType.color : 'gray'
  }

  const getNodeIcon = (type) => {
    const nodeType = nodeTypes.find(nt => nt.type === type)
    return nodeType ? nodeType.icon : 'Circle'
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadFlows} />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IVR Designer</h1>
          <p className="text-sm text-gray-500">
            Design and manage Interactive Voice Response flows
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedFlow?.id || ''}
            onChange={(e) => {
              const flow = flows.find(f => f.id === e.target.value)
              setSelectedFlow(flow)
              setNodes(flow?.nodes || [])
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {flows.map(flow => (
              <option key={flow.id} value={flow.id}>
                {flow.name}
              </option>
            ))}
          </select>
          <Button
            variant="secondary"
            icon="Save"
            size="sm"
          >
            Save Flow
          </Button>
          <Button
            variant="primary"
            icon="Plus"
            size="sm"
          >
            New Flow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Node Types</h3>
          <div className="space-y-2">
            {nodeTypes.map((nodeType) => (
              <Button
                key={nodeType.type}
                variant="ghost"
                icon={nodeType.icon}
                onClick={() => addNode(nodeType.type)}
                className="w-full justify-start"
                size="sm"
              >
                {nodeType.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-lg shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedFlow?.name || 'Select a flow'}
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                icon="ZoomIn"
                size="sm"
              />
              <Button
                variant="ghost"
                icon="ZoomOut"
                size="sm"
              />
              <Button
                variant="ghost"
                icon="Maximize"
                size="sm"
              />
            </div>
          </div>

          <div className="relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-96 overflow-hidden">
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ApperIcon name="GitBranch" size={48} className="text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No nodes yet</h4>
                  <p className="text-gray-500 mb-4">Add nodes from the panel to start designing your IVR flow</p>
                  <Button
                    variant="primary"
                    icon="Plus"
                    onClick={() => addNode('welcome')}
                  >
                    Add Welcome Node
                  </Button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 p-4">
                {nodes.map((node, index) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`absolute bg-white rounded-lg shadow-md border-2 border-${getNodeColor(node.type)}-200 p-4 min-w-32 cursor-move`}
                    style={{
                      left: node.position.x,
                      top: node.position.y
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 bg-${getNodeColor(node.type)}-100 rounded-full flex items-center justify-center`}>
                          <ApperIcon name={getNodeIcon(node.type)} size={12} className={`text-${getNodeColor(node.type)}-600`} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{node.type}</span>
                      </div>
                      <Button
                        variant="ghost"
                        icon="X"
                        size="sm"
                        onClick={() => removeNode(node.id)}
                        className="w-6 h-6 p-0"
                      />
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{node.text}</div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        icon="Edit"
                        size="sm"
                        className="w-6 h-6 p-0"
                      />
                      <Button
                        variant="ghost"
                        icon="Link"
                        size="sm"
                        className="w-6 h-6 p-0"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Flow Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{nodes.length}</div>
              <div className="text-sm text-gray-500">Total Nodes</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {nodes.reduce((sum, node) => sum + (node.connections?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-500">Connections</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {selectedFlow?.version || '1.0'}
              </div>
              <div className="text-sm text-gray-500">Version</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {selectedFlow?.status || 'Draft'}
              </div>
              <div className="text-sm text-gray-500">Status</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Flows</h3>
          <div className="space-y-3">
            {flows.slice(0, 5).map((flow) => (
              <div
                key={flow.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setSelectedFlow(flow)
                  setNodes(flow.nodes || [])
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="GitBranch" size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{flow.name}</div>
                    <div className="text-sm text-gray-500">{flow.nodes?.length || 0} nodes</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {flow.lastModified || 'Never'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default IVRDesigner