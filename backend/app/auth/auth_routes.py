from fastapi import APIRouter, HTTPException
from backend.app.db.mongo import users_collection
from backend.app.schemas.user_schemas import UserRegister, UserLogin
from backend.app.utils.auth import hash_password, verify_password

auth_router = APIRouter(prefix="/auth", tags=["Auth"])


@auth_router.post("/register")
async def register(user: UserRegister):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_pw = hash_password(user.password)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_pw

    result = users_collection.insert_one(user_dict)
    return {"message": "User registered", "user_id": str(result.inserted_id)}


@auth_router.post("/login")
async def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    return {"message": "Login successful", "username": db_user["username"]}
