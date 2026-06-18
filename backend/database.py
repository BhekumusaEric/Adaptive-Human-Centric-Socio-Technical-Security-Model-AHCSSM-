"""
database.py
-----------

Simulated database layer for the ACASTM prototype.
In a production environment, this would integrate with PostgreSQL or MongoDB.
For this master's-level prototype, an in-memory datastore sufficiently demonstrates
the capability of storing and updating Behavioral Profiles and computing risk.

Master's Level Documentation:
Provides the data persistence simulation for testing the continuous learning loop.
"""

from models import User, BehaviorProfile, RiskLevel

# Mock Database
class MockDatabase:
    def __init__(self):
        self.users = {}
        self.seed_data()

    def seed_data(self):
        # User 1: Low Risk (Control Group)
        u1 = User(
            id=1,
            name="Alice Smith",
            email="alice.smith@university.edu",
            risk_score=10.0,
            risk_level=RiskLevel.LOW,
            behavior_profile=BehaviorProfile(
                cognitive_bias_score=0.2,
                click_rate=0.05,
                reporting_rate=0.9
            )
        )
        # User 2: Medium Risk
        u2 = User(
            id=2,
            name="Bob Jones",
            email="bob.jones@university.edu",
            risk_score=45.0,
            risk_level=RiskLevel.MEDIUM,
            behavior_profile=BehaviorProfile(
                cognitive_bias_score=0.6,
                click_rate=0.4,
                reporting_rate=0.4
            ),
            required_training=["Phishing Refresher Module"]
        )
        # User 3: High Risk
        u3 = User(
            id=3,
            name="Charlie Davis",
            email="charlie.davis@university.edu",
            risk_score=80.0,
            risk_level=RiskLevel.HIGH,
            behavior_profile=BehaviorProfile(
                cognitive_bias_score=0.9,
                click_rate=0.8,
                reporting_rate=0.1
            ),
            required_training=["Advanced Phishing Defense", "Mandatory Security Briefing"],
            account_restricted=True
        )
        
        self.users[u1.id] = u1
        self.users[u2.id] = u2
        self.users[u3.id] = u3

    def get_user(self, user_id: int) -> User:
        return self.users.get(user_id)

    def save_user(self, user: User):
        self.users[user.id] = user

    def get_all_users(self) -> list:
        return list(self.users.values())

    def reset_database(self):
        self.seed_data()

db = MockDatabase()
