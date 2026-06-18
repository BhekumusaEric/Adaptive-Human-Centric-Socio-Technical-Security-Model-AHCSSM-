import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function DemoConsole({ 
  currentUser, 
  onSelectUser, 
  onRefreshUser, 
  logs, 
  addLog, 
  onResetDb,
  inline = false
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [offHours, setOffHours] = useState(false);
  const [unusualLocation, setUnusualLocation] = useState(false);
  const [usersList, setUsersList] = useState([]);

  // Fetch list of users for selection
  const fetchUsers = () => {
    fetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(data => setUsersList(data))
      .catch(err => console.error("Error fetching users for demo panel:", err));
  };

  useEffect(() => {
    fetchUsers();
    // Poll users list every 2 seconds to keep the switcher options showing current risk levels/scores
    const interval = setInterval(fetchUsers, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerTelemetry = (action) => {
    if (!currentUser) return;
    
    addLog(`[TX] POST /users/${currentUser.id}/interact - action: ${action}, off_hours: ${offHours}, unusual_location: ${unusualLocation}`);

    fetch(`${API_BASE_URL}/users/${currentUser.id}/interact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: action, 
        off_hours: offHours, 
        unusual_location: unusualLocation 
      })
    })
    .then(res => res.json())
    .then(updatedUser => {
      addLog(`[RX] Recalculated Risk: ${updatedUser.risk_score.toFixed(1)} (${updatedUser.risk_level}) | Restriction: ${updatedUser.account_restricted ? 'ACTIVE' : 'NONE'}`);
      addLog(`[RX] Audit: ${updatedUser.last_audit}`);
      onRefreshUser();
      fetchUsers();
    })
    .catch(err => {
      addLog(`[ERR] Failed to send telemetry: ${err.message}`);
    });
  };

  const handleReset = () => {
    if (!window.confirm("Reset the backend database to academic baseline?")) return;
    
    addLog(`[TX] POST /system/reset`);
    fetch(`${API_BASE_URL}/system/reset`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        addLog(`[RX] ${data.message}. DB Reset complete.`);
        onResetDb();
        fetchUsers();
      })
      .catch(err => {
        addLog(`[ERR] Failed to reset: ${err.message}`);
      });
  };

  // Helper values to calculate and show live equation
  const getLiveEquationValues = () => {
    if (!currentUser) return { cog: '0.0', anomaly: '0.0', ctx: '0.0', total: '0.0' };
    
    // w1 * Cognitive bias
    const bp = currentUser.behavior_profile;
    const cogRisk = Math.max(0, Math.min(100, (bp.cognitive_bias_score * 50) + (bp.click_rate * 50) - (bp.reporting_rate * 50)));
    
    // w2 * Anomaly score (calculated baseline)
    let anomalyScore = 0;
    if (bp.click_rate > 0.5) anomalyScore = 50.0;
    
    // w3 * Context risk
    let contextRisk = 0;
    if (offHours) contextRisk += 40.0;
    if (unusualLocation) contextRisk += 60.0;
    contextRisk = Math.min(100.0, contextRisk);

    const score = (0.5 * cogRisk) + (0.3 * anomalyScore) + (0.2 * contextRisk);

    return {
      cog: cogRisk.toFixed(1),
      anomaly: anomalyScore.toFixed(1),
      ctx: contextRisk.toFixed(1),
      total: currentUser.risk_score.toFixed(1)
    };
  };

  const eq = getLiveEquationValues();

  if (!isOpen && !inline) {
    return (
      <button 
        className="demo-console-collapsed"
        onClick={() => setIsOpen(true)}
      >
        ACASTM Console
      </button>
    );
  }

  return (
    <div className={inline ? "glass-panel" : "demo-console-panel glass-panel"} style={inline ? { display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', height: '100%', boxSizing: 'border-box' } : {}}>
      <div className="demo-console-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <h4 style={{ margin: 0 }}>ACASTM Simulation Hub</h4>
          {!inline && <button className="demo-close-btn" onClick={() => setIsOpen(false)}>×</button>}
        </div>
        <span style={{ fontSize: '0.65rem', background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '2px 6px', borderRadius: '4px' }}>
          Role: Presenter (Inject Scenarios)
        </span>
      </div>

      <div className="demo-console-section">
        <label className="demo-label">1. Select Target Persona</label>
        <div className="persona-list">
          {usersList.map(u => {
            const isActive = currentUser && currentUser.id === u.id;
            return (
              <div 
                key={u.id} 
                className={`persona-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectUser(u.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{u.name} ({u.risk_level})</span>
                  <span className={`risk-${u.risk_level.toLowerCase()}`} style={{ fontWeight: 'bold' }}>
                    {u.risk_score.toFixed(0)}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Click: {(u.behavior_profile.click_rate * 100).toFixed(0)}% | Report: {(u.behavior_profile.reporting_rate * 100).toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="demo-console-section">
        <label className="demo-label">2. Context Risk Overrides</label>
        <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
          <label className="demo-checkbox-label">
            <input 
              type="checkbox" 
              checked={offHours} 
              onChange={(e) => {
                setOffHours(e.target.checked);
                addLog(`[DEMO] Toggled Off-Hours Context to ${e.target.checked}`);
              }} 
            />
            Off-Hours (+40)
          </label>
          <label className="demo-checkbox-label">
            <input 
              type="checkbox" 
              checked={unusualLocation} 
              onChange={(e) => {
                setUnusualLocation(e.target.checked);
                addLog(`[DEMO] Toggled Unusual Location Context to ${e.target.checked}`);
              }} 
            />
            Unusual IP (+60)
          </label>
        </div>
      </div>

      <div className="demo-console-section">
        <label className="demo-label">3. Inject Telemetry Teleport</label>
        <div className="demo-button-grid">
          <button 
            className="btn btn-demo-danger"
            onClick={() => triggerTelemetry('CLICKED_PHISHING_LINK')}
          >
            Click Phishing
          </button>
          <button 
            className="btn btn-demo-success"
            onClick={() => triggerTelemetry('REPORTED_PHISHING_LINK')}
          >
            Report Phishing
          </button>
          <button 
            className="btn btn-demo-purple"
            onClick={() => triggerTelemetry('COMPLETED_TRAINING')}
          >
            Complete Training
          </button>
          <button 
            className="btn btn-demo-blue"
            onClick={() => triggerTelemetry('CONTEXT_UPDATE')}
          >
            Recalculate Risk
          </button>
        </div>
      </div>

      <div className="demo-console-section">
        <label className="demo-label">4. AI Mathematical Explainer</label>
        <div className="demo-math-card">
          <div className="equation-title">Risk Calculation Loop:</div>
          <div className="equation-math">
            R = <span style={{color: '#60a5fa'}}>(0.5 × {eq.cog})</span> + <span style={{color: '#f59e0b'}}>(0.3 × {eq.anomaly})</span> + <span style={{color: '#a78bfa'}}>(0.2 × {eq.ctx})</span>
          </div>
          <div className="equation-result">
            Composite Score = <span className={`risk-${currentUser?.risk_level.toLowerCase()}`} style={{fontSize: '1.1rem', fontWeight: 'bold'}}>{eq.total} / 100</span>
          </div>
        </div>
      </div>

      <div className="demo-console-section" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="demo-label">5. Real-Time Telemetry Stream</label>
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
            onClick={handleReset}
          >
            Reset DB
          </button>
        </div>
        <div className="demo-terminal">
          {logs.map((log, index) => (
            <div key={index} className="terminal-line">{log}</div>
          ))}
          {logs.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>
              Waiting for telemetry inputs...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
