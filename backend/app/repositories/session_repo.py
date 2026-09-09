from app.database.core import db
from app.models.session import Session
from app.security.hashing import hash_token


class SessionRepository:
    @staticmethod
    def create(session_data: dict) -> Session:
        session = Session(**session_data)
        db.session.add(session)
        db.session.commit()
        return session

    @staticmethod
    def get_by_refresh_token(raw_token: str) -> Session:
        """Look up a session by the raw refresh token.

        The raw token is hashed here before querying so no plaintext tokens
        are ever stored in or compared against the database.
        """
        token_hash = hash_token(raw_token)
        return Session.query.filter_by(
            refresh_token_hash=token_hash, is_revoked=False
        ).first()

    @staticmethod
    def revoke(session: Session):
        session.is_revoked = True
        db.session.commit()

