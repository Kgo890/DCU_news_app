from fastapi import APIRouter, HTTPException, Depends, Request
from backend.app.db.mongo import users_collection, blacklist_collection
from backend.app.schemas.user_schemas import UserRegister, UserLogin, PasswordReset, TokenResponse, RefreshTokenRequest
from backend.app.utils.auth import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    decode_token, get_current_user, blacklist_token
)
from fastapi.security import OAuth2PasswordBearer
import datetime

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@router.post("/register")
def register(user: UserRegister):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered.")
    hashed = hash_password(user.password)
    users_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed,
        "saved_pages": []
    })
    return {"message": "User registered successfully"}


@router.post("/login")
def login(user_credentials: UserLogin):
    print("LOGIN ROUTE HIT")

    user = users_collection.find_one({"email": user_credentials.email})
    if not user:
        print("User not found")
        raise HTTPException(status_code=400, detail="Invalid email or password")

    print("Verifying password")
    if not verify_password(user_credentials.password, user["hashed_password"]):
        print("Password mismatch")
        raise HTTPException(status_code=400, detail="Invalid email or password")

    print("Creating tokens...")
    access_token = create_access_token({"sub": user_credentials.email})
    refresh_token = create_refresh_token({"sub": user_credentials.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh", response_model=TokenResponse)
async def refreshing_token(data: RefreshTokenRequest):
    token = data.refresh_token
    if not token:
        raise HTTPException(status_code=400, detail="Refresh token is missing.")

    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token.")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token payload.")

    new_access_token = create_access_token({"sub": email})
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }


@router.post("/save-page")
def save_page(page: str, user=Depends(get_current_user)):
    users_collection.update_one(
        {"email": user["email"]},
        {"$addToSet": {"saved_pages": page}}
    )
    return {"message": f"Page '{page}' saved successfully."}


@router.get("/saved-pages")
def get_saved_pages(user=Depends(get_current_user)):
    return {"saved_pages": user.get("saved_pages", [])}


@router.post("/reset-password")
def reset_password(data: PasswordReset):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if not verify_password(data.current_password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid current password.")

    new_hashed = hash_password(data.new_password)
    users_collection.update_one(
        {"email": data.email},
        {"$set": {"hashed_password": new_hashed}}
    )
    return {"message": "Password reset successful."}


@router.post("/logout")
def logging_out(request: Request):
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Missing or invalid token.")
    token = token.split(" ")[1]
    blacklist_token(token)
    return {"message": "Token has been revoked (blacklisted)."}
