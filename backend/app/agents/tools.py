from langchain_core.tools import tool

@tool
def internet_search(query: str) -> str:
    """
    Search the internet when the agent reaches a saturation point 
    or doesn't know the answer.
    """
    # In a real scenario, integrate Tavily, DuckDuckGo, or Google Search API here
    return f"[Mock Search Result for '{query}']: The internet suggests focusing on bold, modern aesthetics instead of old money styles based on recent trends."
