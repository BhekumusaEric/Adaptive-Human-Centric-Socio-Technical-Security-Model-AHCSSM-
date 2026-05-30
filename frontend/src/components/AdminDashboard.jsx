import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/users')
      .then(res => res.json())
      .then(data => setUsers(data));
      
    fetch('http://localhost:8000/system/status')
      .then(res => res.json())
      .then(data => setSystemStatus(data));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Governance & Policy View</h2>
        {systemStatus && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              height: '10px', width: '10px', borderRadius: '50%', 
              background: systemStatus.status === 'Active' ? 'var(--success)' : 'var(--danger)' 
            }}></span>
            <span>AI Core: {systemStatus.engine}</span>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ gridColumn: 'span 2' }}>
          <h3>Organization Risk Posture</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px' }}>User</th>
                <th style={{ padding: '12px' }}>Risk Score</th>
                <th style={{ padding: '12px' }}>Tier</th>
                <th style={{ padding: '12px' }}>Click Rate</th>
                <th style={{ padding: '12px' }}>Required Training</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>{u.name}</td>
                  <td style={{ padding: '12px' }}>{u.risk_score.toFixed(1)}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`risk-${u.risk_level.toLowerCase()}`}>{u.risk_level}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{(u.behavior_profile.click_rate * 100).toFixed(0)}%</td>
                  <td style={{ padding: '12px' }}>{u.required_training.length} modules</td>
                  <td style={{ padding: '12px' }}>
                    {u.account_restricted ? (
                      <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>Restricted</span>
                    ) : (
                      <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length > 0 && users.map(u => (
          <div key={`chart-${u.id}`} className="glass-panel" style={{ height: '300px' }}>
            <h4>{u.name} - Risk Trajectory</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={u.risk_history} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="var(--text-muted)" tick={{fontSize: 12}} />
                <YAxis domain={[0, 100]} stroke="var(--text-muted)" tick={{fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Line type="monotone" dataKey="score" stroke={u.risk_level === 'HIGH' ? 'var(--danger)' : 'var(--primary)'} strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
