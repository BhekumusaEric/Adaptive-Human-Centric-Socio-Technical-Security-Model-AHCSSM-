import React from 'react';
import { API_BASE_URL } from '../config';

export default function UserDashboard({ user, onRefresh, compact = false }) {
  
  const handleCompleteTraining = () => {
    // Send event to backend indicating training completion
    fetch(`${API_BASE_URL}/users/${user.id}/interact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'COMPLETED_TRAINING', off_hours: false, unusual_location: false })
    })
    .then(() => onRefresh());
  };

  // Compact Render Mode (For Multi-Role Split-Screen Layout)
  if (compact) {
    return (
      <div className="glass-panel" style={{ padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Security Standing: {user.name}</h4>
          <span style={{ fontSize: '0.65rem', background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '2px 6px', borderRadius: '4px' }}>
            Active Profile
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Composite Risk Score</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '2px' }}>
              {user.risk_score.toFixed(1)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>Threat Tier</div>
            <div className={`risk-${user.risk_level.toLowerCase()}`} style={{ fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'right', marginTop: '2px' }}>
              {user.risk_level}
            </div>
          </div>
        </div>

        {user.account_restricted && (
          <div style={{ padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid var(--danger)', marginBottom: '12px' }}>
            <h5 style={{ color: 'var(--danger)', margin: 0, fontSize: '0.85rem' }}>Zero-Trust Lockdown Active</h5>
            <p style={{ fontSize: '0.75rem', margin: '3px 0 0 0', color: 'var(--text-muted)', lineHeight: '1.3' }}>
              Session dynamically contained. Corporate database access has been blocked.
            </p>
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-muted)' }}>Required Training Remediation</div>
          {user.required_training.length === 0 ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.05)', padding: '8px 10px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              Completed all training modules. Workspace active.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {user.required_training.map((module, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '8px 10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>{module}</span>
                  <button className="btn btn-success" style={{ padding: '3px 8px', fontSize: '0.7rem' }} onClick={handleCompleteTraining}>Complete</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-muted)' }}>Cognitive Vulnerabilities</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.75rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Bias Risk</div>
              <div style={{ fontWeight: 'bold', marginTop: '2px' }}>{(user.behavior_profile.cognitive_bias_score * 100).toFixed(0)}%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Click Rate</div>
              <div style={{ fontWeight: 'bold', marginTop: '2px' }}>{(user.behavior_profile.click_rate * 100).toFixed(0)}%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Report Rate</div>
              <div style={{ fontWeight: 'bold', marginTop: '2px' }}>{(user.behavior_profile.reporting_rate * 100).toFixed(0)}%</div>
            </div>
          </div>
          
          {user.last_audit && (
            <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', borderLeft: '2px solid var(--primary)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {user.last_audit}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full Screen Render
  return (
    <div className="dashboard-grid">
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Welcome, {user.name}</h3>
          <span style={{ fontSize: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '3px 8px', borderRadius: '4px' }}>
            Role: End-User (Employee)
          </span>
        </div>
        <p>Your current security profile standing.</p>
        
        <div style={{ marginTop: '20px' }}>
          <h4>Current Risk Level: 
            <span className={`risk-${user.risk_level.toLowerCase()}`} style={{marginLeft: '10px'}}>
              {user.risk_level}
            </span>
          </h4>
          <p>Composite Risk Score: <strong>{user.risk_score.toFixed(1)} / 100</strong></p>
        </div>

        {user.account_restricted && (
          <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px', border: '1px solid var(--danger)' }}>
            <h4 style={{color: 'var(--danger)', margin: 0}}>Account Restricted</h4>
            <p style={{fontSize: '0.9rem', marginTop: '5px'}}>Due to high risk indicators, some privileges have been temporarily suspended.</p>
          </div>
        )}
      </div>

      <div className="glass-panel">
        <h3>Adaptive Gamified Learning</h3>
        <p>Modules assigned by the AI Engine based on your behavior.</p>
        
        {user.required_training.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--success)' }}>
            <p>All caught up! No required training.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {user.required_training.map((module, idx) => (
              <li key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{module}</span>
                <button className="btn btn-success" onClick={handleCompleteTraining}>Complete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="glass-panel">
        <h3>Behavioral Insights & Audit Trail</h3>
        <p>Data driving your current profile.</p>
        <ul>
          <li>Cognitive Bias Risk: {(user.behavior_profile.cognitive_bias_score * 100).toFixed(0)}%</li>
          <li>Historical Click Rate: {(user.behavior_profile.click_rate * 100).toFixed(0)}%</li>
          <li>Accurate Reporting Rate: {(user.behavior_profile.reporting_rate * 100).toFixed(0)}%</li>
        </ul>
        
        {user.last_audit && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
            <h5 style={{ margin: '0 0 10px 0', color: 'var(--text-muted)' }}>Algorithmic Audit Trail</h5>
            <code style={{ fontSize: '0.85rem', color: '#a78bfa' }}>{user.last_audit}</code>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>
              Formula: Risk = (w1 * Cognitive) + (w2 * Anomaly) + (w3 * Context)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
