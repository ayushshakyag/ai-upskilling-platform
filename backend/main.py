from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import roadmap, auth, admin

app = FastAPI(title="AI Upskilling Platform API", version="0.1.0")

# CORS Configuration
origins = [
    "http://localhost:3000",  # Frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["roadmap"])

@app.get("/")
async def root():
    return {"message": "AI Upskilling Platform API is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
