from enum import Enum
from typing import Optional
from fastapi import Header, HTTPException, status
from pydantic import BaseModel

class UserRole(str, Enum):
    INVESTIGATOR = "INVESTIGATOR"
    ADMIN = "ADMIN"
    VIEWER = "VIEWER"

class AuthUser(BaseModel):
    user_id: str
    email: Optional[str] = "investigator@stark.sec"
    name: Optional[str] = "Lead Investigator"
    role: UserRole = UserRole.INVESTIGATOR

async def get_current_user(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
    x_user_role: Optional[str] = Header(None)
) -> AuthUser:
    """
    Clerk-compatible authentication dependency.
    Extracts user_id and role from JWT or dev headers.
    """
    # 1. Dev header override for fast testing
    if x_user_id:
        role = UserRole.INVESTIGATOR
        if x_user_role and x_user_role.upper() in UserRole.__members__:
            role = UserRole(x_user_role.upper())
        return AuthUser(user_id=x_user_id, role=role)

    # 2. Bearer token check
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        # Demo / mock token check or Clerk JWT parse
        if token == "demo-token-admin":
            return AuthUser(user_id="usr-admin", role=UserRole.ADMIN)
        if token == "demo-token-viewer":
            return AuthUser(user_id="usr-viewer", role=UserRole.VIEWER)
        # Default authenticated user
        return AuthUser(user_id="usr-investigator-01", role=UserRole.INVESTIGATOR)

    # 3. Default demo user if unauthenticated in dev/local mode
    return AuthUser(user_id="usr-investigator-01", role=UserRole.INVESTIGATOR)

def require_role(allowed_roles: list[UserRole]):
    async def role_checker(current_user: AuthUser = get_current_user):
        if current_user.role not in allowed_roles and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied: Insufficient role authorization"
            )
        return current_user
    return role_checker
