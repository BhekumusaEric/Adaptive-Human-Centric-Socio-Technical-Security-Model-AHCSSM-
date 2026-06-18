/**
 * ACASTM: Adaptive Context-Aware Social Engineering Threat Mitigation Model
 * -------------------------------------------------------------------------
 * Backend Core Intelligence Module (Node.js Port)
 * 
 * Master's Level Documentation:
 * This module operationalises Algorithm 1 from the systematic literature review.
 * It serves as the "AI Adaptive Engine", continuously calculating a composite 
 * risk score for users based on behavioral telemetry, contextual anomalies, 
 * and active threat intelligence.
 */

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

/**
 * Mock Database Layer
 * Simulates persistent storage of longitudinal Behavioral Profiles.
 */
const db = {
    users: {}
};

/**
 * Default initial database state for demonstration personas
 */
const initialUsers = {
    1: {
        id: 1, name: "Alice Smith", email: "alice.smith@university.edu",
        risk_score: 10.0, risk_level: "LOW",
        behavior_profile: { cognitive_bias_score: 0.2, click_rate: 0.05, reporting_rate: 0.9 },
        required_training: [], account_restricted: false,
        risk_history: [ { time: '09:00 AM', score: 10.0 }, { time: '10:00 AM', score: 12.0 }, { time: '11:00 AM', score: 10.0 } ],
        last_audit: "Initial State"
    },
    2: {
        id: 2, name: "Bob Jones", email: "bob.jones@university.edu",
        risk_score: 45.0, risk_level: "MEDIUM",
        behavior_profile: { cognitive_bias_score: 0.6, click_rate: 0.4, reporting_rate: 0.4 },
        required_training: ["Phishing Refresher Module"], account_restricted: false,
        risk_history: [ { time: '09:00 AM', score: 20.0 }, { time: '10:00 AM', score: 35.0 }, { time: '11:00 AM', score: 45.0 } ],
        last_audit: "Initial State"
    },
    3: {
        id: 3, name: "Charlie Davis", email: "charlie.davis@university.edu",
        risk_score: 80.0, risk_level: "HIGH",
        behavior_profile: { cognitive_bias_score: 0.9, click_rate: 0.8, reporting_rate: 0.1 },
        required_training: ["Advanced Phishing Defense", "Mandatory Security Briefing"], account_restricted: true,
        risk_history: [ { time: '09:00 AM', score: 50.0 }, { time: '10:00 AM', score: 70.0 }, { time: '11:00 AM', score: 80.0 } ],
        last_audit: "Initial State"
    }
};

// Initialize DB
const resetDatabase = () => {
    db.users = JSON.parse(JSON.stringify(initialUsers));
};
resetDatabase();

/**
 * Adaptive Risk Mitigation Processing Engine
 * 
 * Evaluates three primary vectors:
 * 1. Cognitive Risk: Susceptibility derived from simulation click vs. reporting rates.
 * 2. Anomaly Score: Deviations against active threat intelligence.
 * 3. Contextual Risk: Temporal and spatial variables (e.g., off-hours).
 * 
 * @param {Object} user - The user entity being evaluated.
 * @param {Object} event - The specific telemetry event (e.g. CLICKED_PHISHING_LINK)
 */
const ai_process = (user, event) => {
    // 1. Update Behavioral Profile continuously (Learning Loop)
    if (event.action === "CLICKED_PHISHING_LINK") {
        user.behavior_profile.click_rate = Math.min(1.0, user.behavior_profile.click_rate + 0.15);
        user.behavior_profile.reporting_rate = Math.max(0.0, user.behavior_profile.reporting_rate - 0.05);
    } else if (event.action === "REPORTED_PHISHING_LINK") {
        user.behavior_profile.reporting_rate = Math.min(1.0, user.behavior_profile.reporting_rate + 0.1);
    } else if (event.action === "COMPLETED_TRAINING") {
        user.behavior_profile.cognitive_bias_score = Math.max(0.0, user.behavior_profile.cognitive_bias_score - 0.25);
        user.behavior_profile.click_rate = Math.max(0.0, user.behavior_profile.click_rate - 0.15);
        user.behavior_profile.reporting_rate = Math.min(1.0, user.behavior_profile.reporting_rate + 0.1);
        if (user.required_training.length > 0) user.required_training.shift();
    }

    // 2. Algorithm Weighting (w1, w2, w3) derived from mathematical model
    let cog_risk = Math.max(0, Math.min(100, (user.behavior_profile.cognitive_bias_score * 50) + (user.behavior_profile.click_rate * 50) - (user.behavior_profile.reporting_rate * 50)));
    
    let anomaly_score = 0;
    let phishing_active = event.action === "CLICKED_PHISHING_LINK";
    if (phishing_active && user.behavior_profile.click_rate > 0.2) anomaly_score = 80.0;
    else if (user.behavior_profile.click_rate > 0.5) anomaly_score = 50.0;

    // 3. Contextual Risk Assessment (incorporates off-hours and location anomalies)
    let context_risk = 0;
    if (event.off_hours) context_risk += 40.0;
    if (event.unusual_location) context_risk += 60.0;
    context_risk = Math.min(100.0, context_risk);

    // Calculate Composite Risk Score
    let risk_score = (0.5 * cog_risk) + (0.3 * anomaly_score) + (0.2 * context_risk);
    user.risk_score = risk_score;

    // Build the Algorithmic Audit Trail
    user.last_audit = `Risk = (0.5 * ${cog_risk.toFixed(1)}) + (0.3 * ${anomaly_score.toFixed(1)}) + (0.2 * ${context_risk.toFixed(1)}) = ${risk_score.toFixed(1)}`;
    
    // Add to Empirical Risk History Array
    user.risk_history.push({ 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
        score: risk_score 
    });

    // 3. Automated Mitigation Triggering
    if (risk_score >= 75.0) {
        user.risk_level = "HIGH";
        if (!user.required_training.includes("Advanced Phishing Defense")) {
            user.required_training = ["Advanced Phishing Defense", "Mandatory Security Briefing"];
        }
        user.account_restricted = true;
    } else if (risk_score >= 40.0) {
        user.risk_level = "MEDIUM";
        if (!user.required_training.includes("Phishing Refresher Module")) {
            user.required_training = ["Phishing Refresher Module"];
        }
        user.account_restricted = false;
    } else {
        user.risk_level = "LOW";
        user.required_training = [];
        user.account_restricted = false;
    }
};

// API Endpoints connecting the Human-Centric UI to the AI Core
app.get('/users', (req, res) => res.json(Object.values(db.users)));
app.get('/users/:id', (req, res) => res.json(db.users[req.params.id]));
app.post('/users/:id/interact', (req, res) => {
    let user = db.users[req.params.id];
    if(user) {
        ai_process(user, req.body);
        res.json(user);
    } else {
        res.status(404).send();
    }
});
app.post('/system/reset', (req, res) => {
    resetDatabase();
    res.json({ message: "Database successfully reset", users: Object.values(db.users) });
});
app.get('/system/status', (req, res) => res.json({status: "Active", engine: "ACASTM Adaptive Decision Engine v2.0", active_threats: false}));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`ACASTM Node.js Backend listening on port ${PORT}!`));

