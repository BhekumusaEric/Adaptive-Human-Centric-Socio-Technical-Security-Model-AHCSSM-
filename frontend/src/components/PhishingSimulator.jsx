import React, { useState } from 'react';

export default function PhishingSimulator({ user, onInteraction }) {
  const [emails, setEmails] = useState([
    {
      id: 1,
      sender: "IT Support <support@unniversity-help.edu>",
      subject: "URGENT: Password Expiry in 24 Hours",
      body: "Your university password will expire soon. Click the link below immediately to retain access.",
      isPhishing: true,
      status: 'unread'
    },
    {
      id: 2,
      sender: "Prof. Jane Doe <j.doe@university.edu>",
      subject: "Lab Schedule Update",
      body: "Hi team, please note that the lab will be closed on Friday afternoon for maintenance. Best, Jane.",
      isPhishing: false,
      status: 'unread'
    }
  ]);

  const [activeEmail, setActiveEmail] = useState(null);

  const sendTelemetry = (action) => {
    fetch(`http://localhost:8000/users/${user.id}/interact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action, off_hours: false, unusual_location: false })
    })
    .then(() => onInteraction());
  };

  const handleLinkClick = (email) => {
    if (email.isPhishing) {
      alert("⚠️ Oops! You clicked a simulated phishing link. Your behavior profile has been updated.");
      sendTelemetry("CLICKED_PHISHING_LINK");
    } else {
      alert("Safe link clicked.");
    }
    markRead(email);
  };

  const handleReport = (email) => {
    if (email.isPhishing) {
      alert("✅ Good catch! You reported a phishing email. Your reporting rate has improved.");
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

  return (
    <div className="dashboard-grid">
      <div className="glass-panel" style={{ gridColumn: 'span 1' }}>
        <h3>Inbox Simulator</h3>
        <p>Interactive behavioral data generator.</p>
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
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{e.sender}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ gridColumn: 'span 2' }}>
        {activeEmail ? (
          <div>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
              <h2>{activeEmail.subject}</h2>
              <p style={{ color: 'var(--text-muted)' }}>From: {activeEmail.sender}</p>
            </div>
            <p>{activeEmail.body}</p>
            
            {activeEmail.isPhishing && (
              <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center' }}>
                <a href="#" style={{ color: '#60a5fa' }} onClick={(e) => { e.preventDefault(); handleLinkClick(activeEmail); }}>
                  http://university-login.update-secure.com/auth
                </a>
              </div>
            )}

            <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
              <button className="btn btn-danger" onClick={() => handleReport(activeEmail)}>
                🚩 Report Phishing
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
