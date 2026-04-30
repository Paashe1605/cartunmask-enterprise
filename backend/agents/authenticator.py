from typing import List
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

class ReviewAnalysis(BaseModel):
    total_reviews_scanned: int
    fake_review_probability_percentage: int
    bot_pattern_summary: str = Field(description="Explanation of why reviews might be fake or genuine.")

class DarkPatternReport(BaseModel):
    detected_tricks: List[str] = Field(description="E.g., ['Fake urgency timer', 'Artificial low stock warning']")
    marketing_risk_level: str = Field(description="'Low', 'Medium', or 'High'")

class AuthenticationReport(BaseModel):
    trust_score: int = Field(description="A unified score from 1 to 100 (100 being perfectly trustworthy).")
    review_analysis: ReviewAnalysis
    dark_patterns: DarkPatternReport
    final_verdict: str = Field(description="A direct, 1-sentence recommendation to the buyer.")

class AuthenticatorAgent:
    def __init__(self, client: genai.Client):
        self.client = client

    async def analyze_authenticity(self, product_query: str) -> str:
        system_instruction = (
            "Act as an elite e-commerce forensic analyst and consumer protection sentinel. "
            "Search the web for reviews, Reddit threads, and consumer complaints regarding "
            "the user's product query. Analyze the data to detect AI-generated bot reviews "
            "and deceptive 'Dark Pattern' marketing tactics (like fake stock counters). "
            "Calculate a strict CartUnmask Trust Score (1-100) based on seller reputation "
            "and product authenticity. Return the data strictly matching the requested JSON schema."
        )

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=[{"google_search": {}}],
            response_mime_type="application/json",
            response_schema=AuthenticationReport,
        )

        response = await self.client.aio.models.generate_content(
            model="gemini-3.1-pro-preview",
            contents=product_query,
            config=config,
        )

        return response.text
