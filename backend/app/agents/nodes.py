from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from app.agents.state import AgentState
from app.services.gemini import get_gemini_text_model
from app.agents.tools import internet_search
import json

def think_node(state: AgentState):
    """
    Evaluates if the agent knows what to say or hits a saturation point.
    """
    messages = state["messages"]
    preferences = state.get("user_preferences", "")
    
    # System prompt for context engineering
    sys_prompt = f"You are an AI assistant. The user preferences are: {preferences}."
    sys_prompt += " Determine if you can answer the user's latest query confidently. If you do not know or are unsure, reply exactly with 'SATURATION_POINT'."
    
    llm = get_gemini_text_model()
    response = llm.invoke([SystemMessage(content=sys_prompt)] + messages)
    
    saturation = False
    if "SATURATION_POINT" in response.content:
        saturation = True
        
    return {"saturation_point": saturation}

def search_node(state: AgentState):
    """
    Executes internet search if saturation point is reached.
    """
    last_msg = state["messages"][-1].content
    search_result = internet_search.invoke({"query": last_msg})
    return {"context": search_result}

def generate_node(state: AgentState):
    """
    Generates the final response using preferences and potential search context.
    """
    messages = state["messages"]
    preferences = state.get("user_preferences", "")
    context = state.get("context", "")
    
    sys_prompt = f"You are a helpful AI. Tailor your response strictly to these user preferences: {preferences}."
    if context:
        sys_prompt += f" Use this additional context from the internet: {context}"
        
    llm = get_gemini_text_model()
    response = llm.invoke([SystemMessage(content=sys_prompt)] + messages)
    
    return {"messages": [response]}
