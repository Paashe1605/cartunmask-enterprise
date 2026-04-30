from typing import List
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

class MarketDeal(BaseModel):
    platform: str = Field(description="e.g., Amazon, Flipkart, Myntra")
    product_name: str = Field(description="The listed name on the platform")
    current_price: float = Field(description="The base price")
    shipping_fee: float = Field(description="Hidden delivery fees (0 if free)")
    card_discount_available: str = Field(description="E.g., '10% off SBI Cards'")
    final_effective_price: float = Field(description="Base + Shipping - Discount")
    product_url: str = Field(description="The link to the product")

class DealHunterReport(BaseModel):
    best_overall_deal: MarketDeal
    market_comparisons: List[MarketDeal]
    market_analysis_summary: str

class DealHunterAgent:
    def __init__(self, client: genai.Client):
        self.client = client

    async def hunt_deals(self, search_query: str) -> str:
        system_instruction = (
            "Act as an elite e-commerce deal hunter. Search Google for the current "
            "live prices of the user's product query across major Indian e-commerce "
            "platforms (Amazon India, Flipkart, Myntra, Croma, Reliance Digital, etc.). "
            "Extract hidden shipping fees and active bank card discounts to calculate "
            "the true effective price. Return the data strictly matching the requested "
            "JSON schema."
        )

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=[{"google_search": {}}],
            response_mime_type="application/json",
            response_schema=DealHunterReport,
        )

        # ... (rest of your config code above stays the same) ...

        response = await self.client.aio.models.generate_content(
            model="gemini-3.1-flash-lite-preview", # The exact active 3.1 string
            contents=search_query,
            config=config,
        )
        return response.text