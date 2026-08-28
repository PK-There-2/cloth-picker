from fastapi import APIRouter, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional
from langchain_core.messages import HumanMessage
from app.services.gemini import get_gemini_vision_model
import base64

router = APIRouter()

class VisionResponse(BaseModel):
    caption: str
    suggested_search: Optional[str] = None

@router.post("/photo-search", response_model=VisionResponse)
async def photo_search(
    image: UploadFile = File(...),
    context: str = Form(default=""),
    user_preferences: str = Form(default="")
):
    """
    Endpoint for Photo + Search feature.
    Takes an image and optional context (user search query) and generates a dynamic caption.
    """
    contents = await image.read()
    encoded_image = base64.b64encode(contents).decode("utf-8")
    
    # Constructing the message for LangChain with Gemini Vision
    prompt_text = f"Describe this image."
    if context:
        prompt_text += f" Additionally, consider this context from the user: '{context}'."
    if user_preferences:
        prompt_text += f" Also tailor the response to these user preferences: '{user_preferences}'."
        
    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt_text},
            {
                "type": "image_url",
                "image_url": {"url": f"data:{image.content_type};base64,{encoded_image}"}
            },
        ]
    )
    
    llm = get_gemini_vision_model()
    response = llm.invoke([message])
    
    return VisionResponse(
        caption=response.content,
        suggested_search=f"More like this: {context}" if context else "Similar styles"
    )
