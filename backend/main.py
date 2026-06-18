"""
main.py
-------

The main FastAPI application entry point. This exposes the REST API for the frontend
to interact with the AI Adaptive Engine and the User database.

Master's Level Documentation:
This module represents the interface layer between the Human-Centric components (frontend UI)
and the AI Core. It handles asynchronous telemetry (e.g., when a user clicks a phishing link),
triggers the engine to re-evaluate the risk score, and persists the data.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from models import User, ContextData, ThreatIntelligence, InteractionLog
from database import db
from ai_engine import AdaptiveRiskMitigationEngine

app = FastAPI(
    title="ACASTM Backend API",
    description="Adaptive Context-Aware Social Engineering Threat Mitigation Model API",
    version="1.0.0"
)

# Enable CORS for the frontend Vite application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For prototyping, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AdaptiveRiskMitigationEngine()

class SimulationEvent(BaseModel):
    action: str
    off_hours: bool = False
    unusual_location: bool = False

@app.get("/users", response_model=List[User])
def get_all_users():
    """Retrieve all users to populate the Admin Dashboard."""
    return db.get_all_users()

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    """Retrieve a specific user's profile and current risk tier."""
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/{user_id}/interact", response_model=User)
def process_interaction(user_id: int, event: SimulationEvent):
    """
    Endpoint representing Step 1: Collect Behavioral Data.
    When a user interacts with the simulated email client or training,
    this endpoint updates their behavior profile and re-runs the AI engine.
    """
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 1. Update Behavioral Profile based on action
    # This simulates long-term profile adjustments
    if event.action == "CLICKED_PHISHING_LINK":
        user.behavior_profile.click_rate = min(1.0, user.behavior_profile.click_rate + 0.15)
        user.behavior_profile.reporting_rate = max(0.0, user.behavior_profile.reporting_rate - 0.05)
    elif event.action == "REPORTED_PHISHING_LINK":
        user.behavior_profile.reporting_rate = min(1.0, user.behavior_profile.reporting_rate + 0.1)
    elif event.action == "COMPLETED_TRAINING":
        # Training reduces cognitive bias and click rate
        user.behavior_profile.cognitive_bias_score = max(0.0, user.behavior_profile.cognitive_bias_score - 0.2)
        user.behavior_profile.click_rate = max(0.0, user.behavior_profile.click_rate - 0.1)
        # Remove completed training from required list
        if user.required_training:
            user.required_training.pop(0)

    # 2. Setup Context
    context = ContextData(
        off_hours_activity=event.off_hours,
        unusual_location=event.unusual_location
    )
    
    # 3. Setup Threat Intelligence (For demo, assume a global campaign is active if they clicked)
    threat_intel = ThreatIntelligence(
        phishing_campaign_active=(event.action == "CLICKED_PHISHING_LINK")
    )
    
    # 4. Run the AI Engine
    updated_user = engine.process_user(user, context, threat_intel)
    
    # 5. Save and return
    db.save_user(updated_user)
    return updated_user

@app.post("/system/reset")
def reset_database():
    """Resets the mock database to its default starting configuration."""
    db.reset_database()
    return {"message": "Database successfully reset", "users": db.get_all_users()}

@app.get("/system/status")
def system_status():
    """Returns the health status of the AI Core."""
    return {"status": "Active", "engine": "ACASTM Adaptive Decision Engine v1.0", "active_threats": False}
