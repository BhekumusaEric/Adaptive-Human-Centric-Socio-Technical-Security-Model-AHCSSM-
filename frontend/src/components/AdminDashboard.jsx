import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../config';

export default function AdminDashboard({ compact = false, activeUserId = null }) {
  const [users, setUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    const fetchUsers = () => {
      fetch(`${API_BASE_URL}/users`)
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error("Error polling users:", err));
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 1500);
      
    fetch(`${API_BASE_URL}/system/status`)
      .then(res => res.json())
      .then(data => setSystemStatus(data))
      .catch(err => console.error("Error fetching system status:", err));

    return () => clearInterval(interval);
  }, []);

  // Compact Mode Render (For Multi-Role Split-Screen Layout)
  if (compact) {
    const selectedUser = users.find(u => u.id === activeUserId) || users[0];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Comparison card (Compact version) */}
        <div className="glass-panel" style={{ padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Comparative Policy Logic</h4>
            {systemStatus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem' }}>
                <span style={{ 
                  height: '8px', width: '8px', borderRadius: '50%', 
                  background: systemStatus.status === 'Active' ? 'var(--success)' : 'var(--danger)' 
                }}></span>
                <span>AI Core: Active</span>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.75rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '6px', padding: '10px' }}>
              <div style={{ color: 'var(--danger)', fontWeight: 'bold', marginBottom: '5px' }}>[Legacy System]</div>
              <ul style={{ paddingLeft: '12px', margin: 0, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Context-blind (access allowed off-hours/anomalous IP)</li>
                <li>Static threat bounds (no dynamic score changes)</li>
                <li>Decaying post-training compliance logs</li>
              </ul>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.02)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '6px', padding: '10px' }}>
              <div style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: '5px' }}>[ACASTM Model]</div>
              <ul style={{ paddingLeft: '12px', margin: 0, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Context-aware triage (tracks temporal/spatial anomalies)</li>
                <li>Dynamic behavioral analytics (click/report telemetry)</li>
                <li>Immediate zero-trust lock and remediation feedback</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Risk Posture Table (Compact) */}
        <div className="glass-panel" style={{ padding: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Corporate Risk Posture</h4>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '6px 4px' }}>User</th>
                <th style={{ padding: '6px 4px', textAlign: 'center' }}>Score</th>
                <th style={{ padding: '6px 4px', textAlign: 'center' }}>Tier</th>
                <th style={{ padding: '6px 4px', textAlign: 'center' }}>Click Rate</th>
                <th style={{ padding: '6px 4px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: activeUserId === u.id ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <td style={{ padding: '6px 4px', fontWeight: activeUserId === u.id ? 'bold' : 'normal' }}>{u.name}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{u.risk_score.toFixed(1)}</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                    <span className={`risk-${u.risk_level.toLowerCase()}`} style={{ fontWeight: 'bold' }}>{u.risk_level}</span>
                  </td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>{(u.behavior_profile.click_rate * 100).toFixed(0)}%</td>
                  <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                    {u.account_restricted ? (
                      <span style={{ color: 'var(--danger)', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1px 4px', borderRadius: '3px' }}>Restricted</span>
                    ) : (
                      <span style={{ color: 'var(--success)', fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1px 4px', borderRadius: '3px' }}>Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected User Chart (Compact) */}
        {selectedUser && (
          <div className="glass-panel" style={{ padding: '15px', height: '210px' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>{selectedUser.name} - Real-time Risk Trajectory</h4>
            <div style={{ width: '100%', height: '150px', marginTop: '5px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedUser.risk_history} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="var(--text-muted)" tick={{fontSize: 9}} />
                  <YAxis domain={[0, 100]} stroke="var(--text-muted)" tick={{fontSize: 9}} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'rgba(255,255,255,0.1)', fontSize: '9px' }} />
                  <Line type="monotone" dataKey="score" stroke={selectedUser.risk_level === 'HIGH' ? 'var(--danger)' : 'var(--primary)'} strokeWidth={2} dot={{r: 2}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Screen Render
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ margin: 0 }}>Governance & Policy View</h2>
          <span style={{ fontSize: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '3px 8px', borderRadius: '4px' }}>
            Role: Security Administrator
          </span>
        </div>
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

      {/* Comparative Analysis Panel */}
      <div className="glass-panel" style={{ marginBottom: '24px', padding: '24px' }}>
        <h3 style={{ marginBottom: '12px' }}>
          Theoretical Validation: Legacy Systems vs. ACASTM Framework
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
          <strong>Research Focus:</strong> Proving the structural limitations of static security bounds. While traditional controls ignore access context and user susceptibility trends, the ACASTM model aggregates temporal, spatial, and behavioral vectors into a real-time, self-remediating feedback loop.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Legacy Model */}
          <div style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
              [Legacy Security Bounds] Legacy Security Engines
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              <li><strong style={{color: '#ffffff'}}>Context Blindness:</strong> Validates credentials but ignores login hour (temporal) and geo-location (spatial).</li>
              <li><strong style={{color: '#ffffff'}}>Static Parameters:</strong> Risk thresholds are fixed. Incidents do not adjust access bounds dynamically.</li>
              <li><strong style={{color: '#ffffff'}}>Remediation Decay:</strong> Standard security training decays post-completion without continuous behavioral profiling.</li>
              <li><strong style={{color: '#ffffff'}}>Breach Outcome:</strong> User logs in at 2 AM from anomalous IP (strange location) and clicks a BEC email; standard system allows data access.</li>
            </ul>
          </div>
          
          {/* ACASTM Model */}
          <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
              [ACASTM Framework] ACASTM Model (Our Solution)
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              <li><strong style={{color: '#ffffff'}}>Context-Aware Triage:</strong> Tracks off-hours (+40 Context Risk) and anomalous IP location (+60 Context Risk).</li>
              <li><strong style={{color: '#ffffff'}}>Dynamic Analytics:</strong> Continuously computes susceptibility risk based on click rate vs reporting rate.</li>
              <li><strong style={{color: '#ffffff'}}>Zero-Trust Interventions:</strong> Automated access lockdown at High Risk (Score &gt;= 75) with instant learning feedback.</li>
              <li><strong style={{color: '#ffffff'}}>Breach Prevention:</strong> User logs in at 2 AM from anomalous IP; risk instantly jumps. Click blocks session and prompts remediation.</li>
            </ul>
          </div>
          
        </div>
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
