import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function PhishingSimulator({ user, onInteraction, addLog, compact = false }) {
  const [emails, setEmails] = useState([
    {
      id: 1,
      sender: "Executive Office <ceo@university-corp.com>",
      subject: "URGENT: Executive Wire Transfer Request",
      body: "I'm in a board meeting right now and need you to process an executive wire transfer of $14,500 immediately to vendor V-889. Click the authorization portal link below to approve. Do not call my phone as I am speaking.",
      isPhishing: true,
      classification: "Business Email Compromise (BEC)",
      triggers: "Authority, Urgency",
      status: 'unread'
    },
    {
      id: 2,
      sender: "HR Dept <benefits@university-update.com>",
      subject: "Review Your Revised Benefits Package",
      body: "Based on automated department analysis, we have adjusted your medical and retirement benefit plans. You must verify and sign the revised allocation schedules by clicking the portal link below.",
      isPhishing: true,
      classification: "AI-Generated Spear Phishing",
      triggers: "Trust, Curiosity",
      status: 'unread'
    },
    {
      id: 3,
      sender: "Academic Rewards <rewards@academics-incentives.org>",
      subject: "Download Free Security Research Suite",
      body: "Congratulations! Your published research on socio-technical models qualifies for a free subscription to Academic-Security-Suite. Click below to download the package installer file.",
      isPhishing: true,
      classification: "Baiting / Trojan Incentive",
      triggers: "Reciprocity, Curiosity",
      status: 'unread'
    },
    {
      id: 4,
      sender: "Security Center <alert@university-sec.com>",
      subject: "Anomalous Voice Pattern Logged",
      body: "Our network detectors flagged a suspicious voice clone attempt matching your system ID. To verify your voice biometric logs, access the secure audio verification portal link below immediately.",
      isPhishing: true,
      classification: "Vishing / AI Deepfake Threat",
      triggers: "Fear, Urgency",
      status: 'unread'
    },
    {
      id: 5,
      sender: "Prof. Jane Doe <j.doe@university.edu>",
      subject: "Lab Schedule Update",
      body: "Hi team, please note that the lab will be closed on Friday afternoon for maintenance. Best, Jane.",
      isPhishing: false,
      classification: "Legitimate Communication",
      triggers: "None",
      status: 'unread'
    }
  ]);

  const [activeEmail, setActiveEmail] = useState(null);

  const sendTelemetry = (action) => {
    if (addLog) {
      addLog(`[TX] Phishing Simulator Interaction: ${action}`);
    }
    fetch(`${API_BASE_URL}/users/${user.id}/interact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action, off_hours: false, unusual_location: false })
    })
    .then(res => res.json())
    .then(updatedUser => {
      if (addLog) {
        addLog(`[RX] Recalculated Risk: ${updatedUser.risk_score.toFixed(1)} (${updatedUser.risk_level}) | Restriction: ${updatedUser.account_restricted ? 'ACTIVE' : 'NONE'}`);
        addLog(`[RX] Audit: ${updatedUser.last_audit}`);
      }
      onInteraction();
    })
    .catch(err => {
      if (addLog) addLog(`[ERR] Failed: ${err.message}`);
    });
  };

  const handleLinkClick = (email) => {
    if (email.isPhishing) {
      alert(`Simulated Threat Clicked!\nType: ${email.classification}\nTriggers: ${email.triggers}\n\nYour behavior profile has been updated.`);
      sendTelemetry("CLICKED_PHISHING_LINK");
    } else {
      alert("Safe link clicked.");
    }
    markRead(email);
  };

  const handleReport = (email) => {
    if (email.isPhishing) {
      alert(`Good catch! You reported a simulated ${email.classification} email. Your reporting rate has improved.`);
      sendTelemetry("REPORTED_PHISHING_LINK");
    } else {
      alert("This was a legitimate email, but better safe than sorry!");
    }
    markRead(email);
  };

  const markRead = (email) => {
    setEmails(emails.map(e => e.id === email.id ? {...e, status: 'read'} : e));
    setActiveEmail(null);
  };

  // Zero-Trust Session Containment View
  if (user.account_restricted) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '30px 20px', border: '1px solid var(--danger)' }}>
        <h4 style={{ color: 'var(--danger)', margin: '0 0 10px 0', letterSpacing: '0.5px' }}>
          [INBOX ACCESS SUSPENDED]
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px', lineHeight: '1.4' }}>
          This inbox has been dynamically contained by the ACASTM Engine due to a Composite Risk Score of <strong>{user.risk_score.toFixed(1)} / 100 (HIGH)</strong>.
        </p>
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '12px', borderRadius: '6px', fontSize: '0.75rem', maxWidth: '420px', margin: '0 auto', color: '#fca5a5' }}>
          <strong>ACASTM Containment Directive:</strong> Complete your assigned security training module in the Employee Dashboard to restore active email access.
        </div>
      </div>
    );
  }

  // Compact Mode Render (For Multi-Role Split-Screen)
  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="glass-panel" style={{ padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Inbox Simulator</h4>
            <span style={{ fontSize: '0.7rem', background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '2px 6px', borderRadius: '4px' }}>
              Threat Sandbox
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {emails.map(e => (
              <div 
                key={e.id} 
                onClick={() => setActiveEmail(e)}
                style={{ 
                  padding: '10px 12px', 
                  background: activeEmail?.id === e.id ? 'rgba(255,255,255,0.08)' : (e.status === 'unread' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255,255,255,0.03)'),
                  borderRadius: '6px',
                  cursor: 'pointer',
                  borderLeft: e.status === 'unread' ? '3px solid var(--primary)' : '3px solid transparent',
                  border: activeEmail?.id === e.id ? '1px solid #52525b' : '1px solid transparent',
                  fontSize: '0.8rem',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{e.subject}</span>
                  {e.status === 'unread' && <span style={{ color: '#60a5fa', fontSize: '0.7rem', marginLeft: '5px' }}>●</span>}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{e.sender}</div>
              </div>
            ))}
          </div>
        </div>

        {activeEmail && (
          <div className="glass-panel" style={{ padding: '15px', border: '1px solid #3f3f46' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '5px' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.2' }}>{activeEmail.subject}</h4>
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1rem', cursor: 'pointer', padding: 0 }}
                  onClick={() => setActiveEmail(null)}
                >
                  ×
                </button>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', margin: '4px 0 0 0' }}>From: {activeEmail.sender}</p>
              
              <div style={{ display: 'flex', gap: '5px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ 
                  fontSize: '0.65rem', 
                  background: activeEmail.isPhishing ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                  color: activeEmail.isPhishing ? 'var(--danger)' : 'var(--success)', 
                  border: `1px solid ${activeEmail.isPhishing ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`, 
                  padding: '1px 5px', 
                  borderRadius: '3px' 
                }}>
                  {activeEmail.classification}
                </span>
                {activeEmail.isPhishing && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    background: 'rgba(245, 158, 11, 0.1)', 
                    color: 'var(--warning)', 
                    border: '1px solid rgba(245,158,11,0.2)', 
                    padding: '1px 5px', 
                    borderRadius: '3px' 
                  }}>
                    Bias: {activeEmail.triggers}
                  </span>
                )}
              </div>
            </div>
            
            <p style={{ lineHeight: '1.4', fontSize: '0.8rem', whiteSpace: 'pre-wrap', margin: '10px 0' }}>{activeEmail.body}</p>
            
            {activeEmail.isPhishing && (
              <div style={{ margin: '15px 0', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)' }}>
                <a href="#" style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '0.75rem', wordBreak: 'break-all' }} onClick={(e) => { e.preventDefault(); handleLinkClick(activeEmail); }}>
                  http://security-update.university-auth.com/verify
                </a>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={() => handleReport(activeEmail)}>
                Report Phishing
              </button>
              <button className="btn" style={{ padding: '4px 8px', fontSize: '0.7rem' }} onClick={() => setActiveEmail(null)}>
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Screen Render
  return (
    <div className="dashboard-grid">
      <div className="glass-panel" style={{ gridColumn: 'span 1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Inbox Simulator</h3>
          <span style={{ fontSize: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '3px 8px', borderRadius: '4px' }}>
            Role: End-User (Threat Sandbox)
          </span>
        </div>
        <p>ACASTM behavioral data generator.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {emails.map(e => (
            <div 
              key={e.id} 
              onClick={() => setActiveEmail(e)}
              style={{ 
                padding: '15px', 
                background: e.status === 'unread' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                cursor: 'pointer',
                borderLeft: e.status === 'unread' ? '4px solid var(--primary)' : '4px solid transparent'
              }}
            >
              <strong>{e.subject}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{e.sender}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ gridColumn: 'span 2' }}>
        {activeEmail ? (
          <div>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
              <h2>{activeEmail.subject}</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <p style={{ color: 'var(--text-muted)' }}>From: {activeEmail.sender}</p>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    background: activeEmail.isPhishing ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
                    color: activeEmail.isPhishing ? 'var(--danger)' : 'var(--success)', 
                    border: `1px solid ${activeEmail.isPhishing ? 'var(--danger)' : 'var(--success)'}`, 
                    padding: '2px 8px', 
                    borderRadius: '4px' 
                  }}>
                    {activeEmail.classification}
                  </span>
                  {activeEmail.isPhishing && (
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(245, 158, 11, 0.15)', 
                      color: 'var(--warning)', 
                      border: '1px solid var(--warning)', 
                      padding: '2px 8px', 
                      borderRadius: '4px' 
                    }}>
                      Triggers: {activeEmail.triggers}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <p style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>{activeEmail.body}</p>
            
            {activeEmail.isPhishing && (
              <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <a href="#" style={{ color: '#60a5fa', fontWeight: 'bold' }} onClick={(e) => { e.preventDefault(); handleLinkClick(activeEmail); }}>
                  http://security-update.university-auth.com/verify
                </a>
              </div>
            )}

            <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
              <button className="btn btn-danger" onClick={() => handleReport(activeEmail)}>
                Report Phishing
              </button>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select an email to read
          </div>
        )}
      </div>
    </div>
  );
}
