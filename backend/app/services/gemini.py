import os
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel

def get_gemini_vision_model():
    # Use gemini-1.5-pro or gemini-1.5-flash for vision tasks
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.7,
    )

def get_gemini_text_model():
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.7,
    )
