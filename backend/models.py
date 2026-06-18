"""
models.py
---------

This module defines the core data structures and Pydantic models for the Adaptive
Adaptive Context-Aware Social Engineering Threat Mitigation Model (ACASTM). It represents the conceptual 
objects such as User Profiles, Behavioral Logs, and Threat Intelligence Contexts 
necessary for the AI Adaptive Engine to compute dynamic risk scores.

Master's Level Documentation:
These schemas provide strong typing to ensure data integrity across the system. 
By decoupling the data models from the processing logic, we maintain a clear 
Separation of Concerns (SoC), adhering to standard software engineering best practices 
for socio-technical systems.
"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class BehaviorProfile(BaseModel):
    """
    Represents the extracted behavioral data for a user.
    cognitive_bias_score: High values indicate susceptibility to authority or urgency.
    click_rate: Frequency of clicking unverified links.
    reporting_rate: Frequency of correctly reporting simulated phishing emails.
    """
    cognitive_bias_score: float = 0.0
    click_rate: float = 0.0
    reporting_rate: float = 1.0

class ContextData(BaseModel):
    """
    Represents contextual information during an interaction.
    off_hours_activity: True if the user is interacting outside normal hours.
    unusual_location: True if the user is logging in from an anomalous geolocation.
    """
    off_hours_activity: bool = False
    unusual_location: bool = False

class ThreatIntelligence(BaseModel):
    """
    Current threat context for evaluating behavioral anomalies.
    phishing_campaign_active: True if a known campaign is currently active globally.
    """
    phishing_campaign_active: bool = False

class User(BaseModel):
    """
    Core User entity for the ACASTM system.
    Maintains the current computed risk level and behavioral profile.
    """
    id: int
    name: str
    email: str
    risk_score: float = 0.0
    risk_level: RiskLevel = RiskLevel.LOW
    behavior_profile: BehaviorProfile = BehaviorProfile()
    required_training: List[str] = []
    account_restricted: bool = False

class InteractionLog(BaseModel):
    """
    Logs every user interaction with simulated threats or actual systems.
    action: "CLICKED_LINK", "REPORTED_EMAIL", "IGNORED", etc.
    """
    user_id: int
    timestamp: datetime
    action: str
    context: ContextData
