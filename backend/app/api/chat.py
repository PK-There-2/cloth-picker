from fastapi import APIRouter
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from app.agents.graph import agent_graph

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    user_preferences: str = ""

class ChatResponse(BaseModel):
    reply: str
    saturation_hit: bool
    context_used: str

@router.post("/message", response_model=ChatResponse)
async def chat_message(request: ChatRequest):
    """
    Endpoint for Chat interacting with the LangGraph Agent.
    """
    inputs = {
        "messages": [HumanMessage(content=request.message)],
        "user_preferences": request.user_preferences,
        "saturation_point": False,
        "context": ""
    }
    
    final_state = agent_graph.invoke(inputs)
    
    reply = final_state["messages"][-1].content
    
    return ChatResponse(
        reply=reply,
        saturation_hit=final_state.get("saturation_point", False),
        context_used=final_state.get("context", "")
    )
