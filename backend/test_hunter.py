import asyncio
from google import genai
from agents.deal_hunter import DealHunterAgent

async def test_engine():
    print("🚀 Initializing Vertex AI Client...")
    # Switched to the global endpoint for Gemini 3.1 routing
    client = genai.Client(vertexai=True, project="cartunmask-core", location="global")
    
    agent = DealHunterAgent(client=client)
    
    query = "Sony WH-1000XM5 headphones India best price"
    print(f"📡 Deploying Deal Hunter Swarm for: '{query}'...")
    print("⏳ Waiting for web scraping and AI analysis (this takes a few seconds)...\n")
    
    try:
        result = await agent.hunt_deals(query)
        print("✅ SUCCESS! JSON Payload Received:\n")
        print(result)
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_engine())