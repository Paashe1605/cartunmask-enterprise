import asyncio
from google import genai
from agents.authenticator import AuthenticatorAgent

async def test_engine():
    print("🚀 Initializing Vertex AI Client (Global Routing)...")
    client = genai.Client(vertexai=True, project="cartunmask-core", location="global")
    
    agent = AuthenticatorAgent(client=client)
    
    # Testing a notoriously tricky product category for fake reviews
    query = "Boat Airdopes 141 wireless earbuds Amazon India reviews and authenticity"
    print(f"🕵️‍♂️ Deploying Forensic Authenticator Swarm for: '{query}'...")
    print("⏳ Analyzing review integrity and scanning for dark patterns (requires deep reasoning)...\n")
    
    try:
        result = await agent.analyze_authenticity(query)
        print("✅ SUCCESS! Forensic JSON Payload Received:\n")
        print(result)
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_engine())