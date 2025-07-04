import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import AgentManagement from '@/components/pages/AgentManagement'
import QueueMonitor from '@/components/pages/QueueMonitor'
import Analytics from '@/components/pages/Analytics'
import IVRDesigner from '@/components/pages/IVRDesigner'
import Settings from '@/components/pages/Settings'
import InboxPanel from '@/components/pages/InboxPanel'

function App() {
return (
    <div className="min-h-screen bg-surface">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<AgentManagement />} />
          <Route path="/queues" element={<QueueMonitor />} />
          <Route path="/inbox" element={<InboxPanel />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ivr" element={<IVRDesigner />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App