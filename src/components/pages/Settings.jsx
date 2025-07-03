import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { settingsService } from '@/services/api/settingsService'

const Settings = () => {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('general')

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await settingsService.getSettings()
      setSettings(data)
    } catch (err) {
      setError(err.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSave = async () => {
    try {
      await settingsService.updateSettings(settings)
      // Show success message
    } catch (err) {
      setError(err.message || 'Failed to save settings')
    }
  }

  const updateSetting = (path, value) => {
    const keys = path.split('.')
    const newSettings = { ...settings }
    let current = newSettings
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setSettings(newSettings)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'queues', label: 'Queues', icon: 'Phone' },
    { id: 'agents', label: 'Agents', icon: 'Users' },
    { id: 'integration', label: 'Integration', icon: 'Zap' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' }
  ]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadSettings} />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">
            Configure your call center system
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            icon="RotateCcw"
            size="sm"
            onClick={loadSettings}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            icon="Save"
            size="sm"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name={tab.icon} size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3 bg-white rounded-lg shadow-lg border border-gray-100 p-6">
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    value={settings.systemName || ''}
                    onChange={(e) => updateSetting('systemName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="CallCenter Pro"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Zone
                  </label>
                  <select
                    value={settings.timeZone || ''}
                    onChange={(e) => updateSetting('timeZone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Language
                </label>
                <select
                  value={settings.defaultLanguage || ''}
                  onChange={(e) => updateSetting('defaultLanguage', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableRecording"
                  checked={settings.enableRecording || false}
                  onChange={(e) => updateSetting('enableRecording', e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="enableRecording" className="text-sm text-gray-700">
                  Enable call recording
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === 'queues' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Queue Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default SLA (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.defaultSLA || 30}
                    onChange={(e) => updateSetting('defaultSLA', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                    max="300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Queue Size
                  </label>
                  <input
                    type="number"
                    value={settings.maxQueueSize || 100}
                    onChange={(e) => updateSetting('maxQueueSize', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Queue Overflow Action
                </label>
                <select
                  value={settings.overflowAction || 'voicemail'}
                  onChange={(e) => updateSetting('overflowAction', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="voicemail">Send to Voicemail</option>
                  <option value="callback">Offer Callback</option>
                  <option value="transfer">Transfer to Overflow Queue</option>
                  <option value="hangup">Hang Up</option>
                </select>
              </div>
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Agent Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-Answer Delay (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.autoAnswerDelay || 0}
                    onChange={(e) => updateSetting('autoAnswerDelay', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                    max="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wrap-up Time (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.wrapUpTime || 30}
                    onChange={(e) => updateSetting('wrapUpTime', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                    max="300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="enablePresence"
                    checked={settings.enablePresence || false}
                    onChange={(e) => updateSetting('enablePresence', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="enablePresence" className="text-sm text-gray-700">
                    Enable presence monitoring
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="enableSkillRouting"
                    checked={settings.enableSkillRouting || false}
                    onChange={(e) => updateSetting('enableSkillRouting', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="enableSkillRouting" className="text-sm text-gray-700">
                    Enable skill-based routing
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'integration' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Integration Settings</h3>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Zap" size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Salesforce</h4>
                        <p className="text-sm text-gray-500">CRM Integration</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-success">Connected</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="API Key"
                      value={settings.salesforceApiKey || ''}
                      onChange={(e) => updateSetting('salesforceApiKey', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Instance URL"
                      value={settings.salesforceUrl || ''}
                      onChange={(e) => updateSetting('salesforceUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Database" size={16} className="text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">HubSpot</h4>
                        <p className="text-sm text-gray-500">CRM Integration</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-500">Disconnected</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="API Key"
                      value={settings.hubspotApiKey || ''}
                      onChange={(e) => updateSetting('hubspotApiKey', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Queue Alerts</h4>
                    <p className="text-sm text-gray-500">Get notified when queues exceed SLA</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.queueAlerts || false}
                    onChange={(e) => updateSetting('queueAlerts', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Agent Status Changes</h4>
                    <p className="text-sm text-gray-500">Notifications when agents change status</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.agentStatusAlerts || false}
                    onChange={(e) => updateSetting('agentStatusAlerts', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">System Errors</h4>
                    <p className="text-sm text-gray-500">Critical system error notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.systemErrorAlerts || false}
                    onChange={(e) => updateSetting('systemErrorAlerts', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Daily Reports</h4>
                    <p className="text-sm text-gray-500">Receive daily performance reports</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dailyReports || false}
                    onChange={(e) => updateSetting('dailyReports', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Notifications
                </label>
                <input
                  type="email"
                  value={settings.notificationEmail || ''}
                  onChange={(e) => updateSetting('notificationEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="admin@company.com"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings