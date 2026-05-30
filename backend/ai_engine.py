"""
ai_engine.py
------------

This module implements the core logic of the AI Adaptive Engine for the AHCSSM.
It directly maps the theoretical algorithm developed in the systematic literature review 
into an operational computational model.

Master's Level Documentation:
The `AdaptiveRiskMitigationEngine` class computes a composite risk score based on three 
distinct dimensions:
1. Cognitive Risk (derived from behavioral profiling)
2. Anomaly Score (contextual deviations against threat intelligence)
3. Contextual Risk (temporal and spatial factors)

The resulting score triggers specific, automated mitigation actions, achieving the 
continuous feedback loop essential for adaptive socio-technical defense.
"""

from models import User, BehaviorProfile, ContextData, ThreatIntelligence, RiskLevel

class AdaptiveRiskMitigationEngine:
    def __init__(self, high_threshold: float = 75.0, medium_threshold: float = 40.0):
        self.high_threshold = high_threshold
        self.medium_threshold = medium_threshold
        
        # Weighting factors (w1, w2, w3) from the mathematical model:
        # Risk(u) = w1*Cognitive + w2*Anomaly + w3*Context
        self.w1 = 0.5
        self.w2 = 0.3
        self.w3 = 0.2

    def evaluate_cognitive_bias(self, profile: BehaviorProfile) -> float:
        """
        Calculates cognitive risk based on historical click and reporting rates.
        High clicks and low reporting mathematically increase the bias score.
        """
        # Base risk from baseline cognitive bias score
        risk = profile.cognitive_bias_score * 50  # scale to 0-50
        
        # Penalty for high click rate, reward for high reporting rate
        click_penalty = profile.click_rate * 50
        report_reward = profile.reporting_rate * 50
        
        calculated_risk = max(0.0, min(100.0, risk + click_penalty - report_reward))
        return calculated_risk

    def detect_anomalies(self, profile: BehaviorProfile, threat_intel: ThreatIntelligence) -> float:
        """
        Computes an anomaly score. If there's an active phishing campaign and the user
        has a high click rate, the anomaly score escalates rapidly.
        """
        anomaly_score = 0.0
        if threat_intel.phishing_campaign_active and profile.click_rate > 0.2:
            anomaly_score = 80.0
        elif profile.click_rate > 0.5:
            anomaly_score = 50.0
        return anomaly_score

    def evaluate_context(self, context: ContextData) -> float:
        """
        Evaluates risk based on the context of the user's action.
        """
        context_risk = 0.0
        if context.off_hours_activity:
            context_risk += 40.0
        if context.unusual_location:
            context_risk += 60.0
        return min(100.0, context_risk)

    def trigger_adaptive_response(self, user: User) -> User:
        """
        Executes Step 6 of Algorithm 1: Trigger Adaptive Response.
        Modifies the user entity with assigned training or restrictions.
        """
        if user.risk_level == RiskLevel.HIGH:
            user.required_training = ["Advanced Phishing Defense", "Mandatory Security Briefing"]
            user.account_restricted = True
        elif user.risk_level == RiskLevel.MEDIUM:
            user.required_training = ["Phishing Refresher Module"]
            user.account_restricted = False
        else:
            user.required_training = []
            user.account_restricted = False
        return user

    def process_user(self, user: User, context: ContextData, threat_intel: ThreatIntelligence) -> User:
        """
        The main pipeline executing the AHCSSM algorithm.
        """
        # Step 2: Analyze Behavior Patterns
        cognitive_risk = self.evaluate_cognitive_bias(user.behavior_profile)
        anomaly_score = self.detect_anomalies(user.behavior_profile, threat_intel)
        
        # Step 3: Contextual Risk Assessment
        context_risk = self.evaluate_context(context)
        
        # Step 4: Compute Risk Score
        risk_score = (self.w1 * cognitive_risk) + (self.w2 * anomaly_score) + (self.w3 * context_risk)
        user.risk_score = risk_score
        
        # Step 5: Classify Risk Level
        if risk_score >= self.high_threshold:
            user.risk_level = RiskLevel.HIGH
        elif risk_score >= self.medium_threshold:
            user.risk_level = RiskLevel.MEDIUM
        else:
            user.risk_level = RiskLevel.LOW
            
        # Step 6: Trigger Adaptive Response
        user = self.trigger_adaptive_response(user)
        
        return user
