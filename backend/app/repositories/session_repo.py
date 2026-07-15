from app.database.core import db
from app.models.session import Session

class SessionRepository:
    @staticmethod
    def create(session_data: dict) -> Session:
        session = Session(**session_data)
        db.session.add(session)
        db.session.commit()
        return session
        
    @staticmethod
    def get_by_refresh_token(token: str) -> Session:
        return Session.query.filter_by(refresh_token=token, is_revoked=False).first()
        
    @staticmethod
    def revoke(session: Session):
        session.is_revoked = True
        db.session.commit()
