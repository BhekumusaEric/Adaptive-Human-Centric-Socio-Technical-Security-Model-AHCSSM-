import { useState, useEffect } from 'react';
import UserDashboard from './components/UserDashboard';
import PhishingSimulator from './components/PhishingSimulator';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

/**
 * Main Application Shell for AHCSSM Prototype
 * Acts as the UI container managing state between the different 
 * socio-technical perspectives (End User vs. Administrator).
 */
function App() {
  const [currentView, setCurrentView] = useState('userDashboard');
  const [currentUser, setCurrentUser] = useState(null);

  // Simulate fetching the authenticated user (User 1 - Control Group initially)
  useEffect(() => {
    fetch('http://localhost:8000/users/1')
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(err => console.error("Ensure backend is running on :8000", err));
  }, []);

  const refreshUser = () => {
    if(!currentUser) return;
    fetch(`http://localhost:8000/users/${currentUser.id}`)
      .then(res => res.json())
      .then(data => setCurrentUser(data));
  };

  return (
    <>
      <nav className="top-nav">
        <h2 className="text-gradient">AHCSSM Security Portal</h2>
        <div className="nav-links">
          <span 
            className={`nav-link ${currentView === 'userDashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('userDashboard')}
          >
            Dashboard
          </span>
          <span 
            className={`nav-link ${currentView === 'phishingSimulator' ? 'active' : ''}`}
            onClick={() => setCurrentView('phishingSimulator')}
          >
            Email Inbox
          </span>
          <span 
            className={`nav-link ${currentView === 'adminDashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('adminDashboard')}
          >
            Admin / Governance
          </span>
        </div>
      </nav>

      <main>
        {currentView === 'userDashboard' && currentUser && (
          <UserDashboard user={currentUser} onRefresh={refreshUser} />
        )}
        {currentView === 'phishingSimulator' && currentUser && (
          <PhishingSimulator user={currentUser} onInteraction={refreshUser} />
        )}
        {currentView === 'adminDashboard' && (
          <AdminDashboard />
        )}
      </main>
    </>
  );
}

export default App;
