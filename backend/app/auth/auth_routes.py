from fastapi import APIRouter, HTTPException
from backend.app.db.mongo import users_collection
from backend.app.schemas.user_schemas import UserRegister, UserLogin
from backend.app.utils.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


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
def login(user: UserLogin):
    found = users_collection.find_one({"email": user.email})
    if not found or not verify_password(user.password, found["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"email": user.email})
    return {"access_token": token, "token_type": "bearer"}
