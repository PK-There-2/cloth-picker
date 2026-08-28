from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.nodes import think_node, search_node, generate_node

def should_search(state: AgentState):
    """Conditional edge logic based on saturation point."""
    if state.get("saturation_point"):
        return "search"
    return "generate"

def build_graph():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("think", think_node)
    workflow.add_node("search", search_node)
    workflow.add_node("generate", generate_node)
    
    # Define edges
    workflow.set_entry_point("think")
    
    # Conditional routing after thinking
    workflow.add_conditional_edges(
        "think",
        should_search,
        {
            "search": "search",
            "generate": "generate"
        }
    )
    
    # After search, we always generate
    workflow.add_edge("search", "generate")
    workflow.add_edge("generate", END)
    
    return workflow.compile()

agent_graph = build_graph()
