import asyncio
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

from agents.deal_hunter import DealHunterAgent
from agents.authenticator import AuthenticatorAgent

# Initialize Vertex AI Client
client = genai.Client(vertexai=True, project="cartunmask-core", location="global")

# Initialize Agents
deal_hunter = DealHunterAgent(client=client)
authenticator = AuthenticatorAgent(client=client)

# Initialize FastAPI App
app = FastAPI(title="CartUnmask Enterprise API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str

@app.get("/api/health")
async def health_check():
    return {"status": "CartUnmask API is Live"}

@app.post("/api/analyze")
async def analyze_product(request: SearchRequest):
    try:
        # Run both agents concurrently for maximum speed
        deals_task = deal_hunter.hunt_deals(request.query)
        auth_task = authenticator.analyze_authenticity(request.query)
        
        deals_result, auth_result = await asyncio.gather(deals_task, auth_task)
        
        # Parse the JSON strings returned by the agents back into Python dictionaries
        parsed_deals = json.loads(deals_result)
        parsed_auth = json.loads(auth_result)
        
        return {
            "deals": parsed_deals,
            "authenticity": parsed_auth
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
