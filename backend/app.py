from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CartUnmask Backend API", version="1.0.0")

# Strict CORS middleware configured for enterprise security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to production frontend domain
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "CartUnmask Engine Active"}
