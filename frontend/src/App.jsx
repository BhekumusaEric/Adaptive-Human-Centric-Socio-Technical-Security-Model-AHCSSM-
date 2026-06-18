import { useState, useEffect } from 'react';
import UserDashboard from './components/UserDashboard';
import PhishingSimulator from './components/PhishingSimulator';
import AdminDashboard from './components/AdminDashboard';
import DemoConsole from './components/DemoConsole';
import { API_BASE_URL } from './config';
import './index.css';

/**
 * Main Application Shell for ACASTM Prototype
 * Acts as the UI container managing state between the different 
 * socio-technical perspectives (End User vs. Administrator).
 */
function App() {
  const [currentView, setCurrentView] = useState('splitScreen');
  const [currentUser, setCurrentUser] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`[${time}] ${message}`, ...prev].slice(0, 50));
  };

  // Simulate fetching the authenticated user (User 1 - Control Group initially)
  useEffect(() => {
    fetch(`${API_BASE_URL}/users/1`)
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data);
        addLog(`[SYSTEM] Initialized app. Loaded default user: ${data.name}`);
      })
      .catch(err => {
        console.error(`Ensure backend is running on ${API_BASE_URL}`, err);
        addLog(`[SYSTEM ERROR] Failed to connect to backend on ${API_BASE_URL}. Is the server running?`);
      });
  }, []);

  const refreshUser = () => {
    if(!currentUser) return;
    fetch(`${API_BASE_URL}/users/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setCurrentUser(data));
  };

  const handleSelectUser = (id) => {
    fetch(`${API_BASE_URL}/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data);
        addLog(`[SYSTEM] Switched view to: ${data.name}`);
      })
      .catch(err => {
        addLog(`[ERR] Failed to switch user: ${err.message}`);
      });
  };

  const handleResetDb = () => {
    const currentId = currentUser ? currentUser.id : 1;
    handleSelectUser(currentId);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <nav className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 className="text-gradient" style={{ margin: 0 }}>ACASTM Security Portal</h2>
          <span style={{ fontSize: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '3px 8px', borderRadius: '4px' }}>
            Interactive Socio-Technical Demo
          </span>
        </div>
        <div className="nav-links">
          <span 
            className={`nav-link ${currentView === 'splitScreen' ? 'active' : ''}`}
            onClick={() => setCurrentView('splitScreen')}
          >
            Demo View (Split-Screen)
          </span>
          <span 
            className={`nav-link ${currentView === 'userDashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('userDashboard')}
          >
            Employee Dashboard
          </span>
          <span 
            className={`nav-link ${currentView === 'phishingSimulator' ? 'active' : ''}`}
            onClick={() => setCurrentView('phishingSimulator')}
          >
            Employee Inbox
          </span>
          <span 
            className={`nav-link ${currentView === 'adminDashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('adminDashboard')}
          >
            Governance View (Admin)
          </span>
        </div>
      </nav>

      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {currentView === 'splitScreen' && currentUser && (
          <div className="split-screen-container">
            {/* Column 1: End-User (Employee) */}
            <div className="split-column">
              <div className="role-header employee-role">
                <span className="role-badge">Role: End-User (Employee)</span>
                <span className="role-title">Employee Workspace Sandbox</span>
              </div>
              <UserDashboard user={currentUser} onRefresh={refreshUser} compact={true} />
              <PhishingSimulator user={currentUser} onInteraction={refreshUser} addLog={addLog} compact={true} />
            </div>

            {/* Column 2: Governance & Security Admin */}
            <div className="split-column">
              <div className="role-header admin-role">
                <span className="role-badge">Role: Security Administrator (System)</span>
                <span className="role-title">Threat Mitigation Governance</span>
              </div>
              <AdminDashboard compact={true} activeUserId={currentUser.id} />
            </div>

            {/* Column 3: Presenter Simulation Hub */}
            <div className="split-column">
              <div className="role-header presenter-role">
                <span className="role-badge">Role: Presenter (Simulation Control)</span>
                <span className="role-title">ACASTM Threat & Context Injector</span>
              </div>
              <DemoConsole 
                currentUser={currentUser}
                onSelectUser={handleSelectUser}
                onRefreshUser={refreshUser}
                logs={logs}
                addLog={addLog}
                onResetDb={handleResetDb}
                inline={true}
              />
            </div>
          </div>
        )}

        {currentView === 'userDashboard' && currentUser && (
          <div style={{ paddingRight: '380px' }}>
            <UserDashboard user={currentUser} onRefresh={refreshUser} />
          </div>
        )}

        {currentView === 'phishingSimulator' && currentUser && (
          <div style={{ paddingRight: '380px' }}>
            <PhishingSimulator user={currentUser} onInteraction={refreshUser} addLog={addLog} />
          </div>
        )}

        {currentView === 'adminDashboard' && (
          <div style={{ paddingRight: '380px' }}>
            <AdminDashboard />
          </div>
        )}
      </main>

      {/* Floating Demo Console when not in split screen view */}
      {currentView !== 'splitScreen' && (
        <DemoConsole 
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
          onRefreshUser={refreshUser}
          logs={logs}
          addLog={addLog}
          onResetDb={handleResetDb}
          inline={false}
        />
      )}
    </div>
  );
}

export default App;
