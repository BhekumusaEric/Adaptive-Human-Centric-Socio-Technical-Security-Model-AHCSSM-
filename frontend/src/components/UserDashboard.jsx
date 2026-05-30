import React from 'react';

export default function UserDashboard({ user, onRefresh }) {
  
  const handleCompleteTraining = () => {
    // Send event to backend indicating training completion
    fetch(`http://localhost:8000/users/${user.id}/interact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'COMPLETED_TRAINING', off_hours: false, unusual_location: false })
    })
    .then(() => onRefresh());
  };

  return (
    <div className="dashboard-grid">
      <div className="glass-panel">
        <h3>Welcome, {user.name}</h3>
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
            <p>🎉 All caught up! No required training.</p>
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
        <h3>Behavioral Insights</h3>
        <p>Data driving your current profile.</p>
        <ul>
          <li>Cognitive Bias Risk: {(user.behavior_profile.cognitive_bias_score * 100).toFixed(0)}%</li>
          <li>Historical Click Rate: {(user.behavior_profile.click_rate * 100).toFixed(0)}%</li>
          <li>Accurate Reporting Rate: {(user.behavior_profile.reporting_rate * 100).toFixed(0)}%</li>
        </ul>
      </div>
    </div>
  );
}
