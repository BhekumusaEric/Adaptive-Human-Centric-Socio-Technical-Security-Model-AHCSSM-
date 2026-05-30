const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const db = {
    users: {
        1: {
            id: 1, name: "Alice Smith", email: "alice.smith@university.edu",
            risk_score: 10.0, risk_level: "LOW",
            behavior_profile: { cognitive_bias_score: 0.2, click_rate: 0.05, reporting_rate: 0.9 },
            required_training: [], account_restricted: false
        },
        2: {
            id: 2, name: "Bob Jones", email: "bob.jones@university.edu",
            risk_score: 45.0, risk_level: "MEDIUM",
            behavior_profile: { cognitive_bias_score: 0.6, click_rate: 0.4, reporting_rate: 0.4 },
            required_training: ["Phishing Refresher Module"], account_restricted: false
        }
    }
};

const ai_process = (user, event) => {
    if (event.action === "CLICKED_PHISHING_LINK") {
        user.behavior_profile.click_rate = Math.min(1.0, user.behavior_profile.click_rate + 0.15);
        user.behavior_profile.reporting_rate = Math.max(0.0, user.behavior_profile.reporting_rate - 0.05);
    } else if (event.action === "REPORTED_PHISHING_LINK") {
        user.behavior_profile.reporting_rate = Math.min(1.0, user.behavior_profile.reporting_rate + 0.1);
    } else if (event.action === "COMPLETED_TRAINING") {
        user.behavior_profile.cognitive_bias_score = Math.max(0.0, user.behavior_profile.cognitive_bias_score - 0.2);
        user.behavior_profile.click_rate = Math.max(0.0, user.behavior_profile.click_rate - 0.1);
        if (user.required_training.length > 0) user.required_training.shift();
    }

    let cog_risk = Math.max(0, Math.min(100, (user.behavior_profile.cognitive_bias_score * 50) + (user.behavior_profile.click_rate * 50) - (user.behavior_profile.reporting_rate * 50)));
    
    let anomaly_score = 0;
    let phishing_active = event.action === "CLICKED_PHISHING_LINK";
    if (phishing_active && user.behavior_profile.click_rate > 0.2) anomaly_score = 80.0;
    else if (user.behavior_profile.click_rate > 0.5) anomaly_score = 50.0;

    let context_risk = 0;

    let risk_score = (0.5 * cog_risk) + (0.3 * anomaly_score) + (0.2 * context_risk);
    user.risk_score = risk_score;

    if (risk_score >= 75.0) {
        user.risk_level = "HIGH";
        user.required_training = ["Advanced Phishing Defense", "Mandatory Security Briefing"];
        user.account_restricted = true;
    } else if (risk_score >= 40.0) {
        user.risk_level = "MEDIUM";
        user.required_training = ["Phishing Refresher Module"];
        user.account_restricted = false;
    } else {
        user.risk_level = "LOW";
        user.required_training = [];
        user.account_restricted = false;
    }
};

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
app.get('/system/status', (req, res) => res.json({status: "Active", engine: "AdaptiveRiskMitigationEngine v1.0 (Node.js Port)", active_threats: false}));

app.listen(8000, () => console.log('AHCSSM Node.js Backend listening on port 8000!'));
