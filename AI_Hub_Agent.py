
import os
import json
import time
from openrouter_client import ask_openrouter
from tools_registry import TOOL_MAP

class AIHubAgent:
    def __init__(self, model="google/gemma-2-9b-it"):
        self.model = model
        self.system_prompt = """
You are the AI Hub Super-Agent. You are capable of using tools to answer user questions.
You operate in a loop: THOUGHT, ACTION, OBSERVATION, and ANSWER.

AVAILABLE TOOLS:
- check_network: No arguments. Checks if AI APIs are reachable.
- get_time: No arguments. Gets current system time.
- list_files: No arguments. Lists project files.
- search_tools: Argument: query. Searches the tool database for specific AI models.

FORMAT:
Thought: [Your reasoning]
Action: [tool_name]
Argument: [tool_argument or None]
Observation: [Tool output will be provided here]
... (repeat if needed)
Final Answer: [Your final response to the user]

Always start with Thought. If you have enough info, go straight to Final Answer.
"""

    def run(self, user_query):
        print(f"\n🤖 Agent starting task: {user_query}")
        history = f"User Query: {user_query}\n"
        
        for i in range(5): # Max 5 turns
            prompt = f"{self.system_prompt}\n\n{history}"
            response = ask_openrouter(prompt, self.model)
            
            print(f"---\n{response}\n---")
            
            if "Final Answer:" in response:
                return response.split("Final Answer:")[1].strip()
            
            if "Action:" not in response:
                # If the model (especially a mock) just gives a direct answer
                return f"[Direct Response] {response}"
            
            # Parse action
            try:
                action_line = [l for l in response.split("\n") if "Action:" in l][0]
                tool_name = action_line.split("Action:")[1].strip()
                
                arg_line = [l for l in response.split("\n") if "Argument:" in l][0]
                tool_arg = arg_line.split("Argument:")[1].strip()
                
                if tool_name in TOOL_MAP:
                    print(f"⚙️ Executing Tool: {tool_name}({tool_arg})")
                    if tool_arg == "None":
                        observation = TOOL_MAP[tool_name]()
                    else:
                        observation = TOOL_MAP[tool_name](tool_arg)
                    
                    history += f"\n{response}\nObservation: {observation}"
                else:
                    history += f"\n{response}\nObservation: Error - Tool {tool_name} not found."
            except Exception as e:
                history += f"\n{response}\nObservation: Error parsing action - {str(e)}"
                
        return "Agent timed out or failed to reach a final answer."

if __name__ == "__main__":
    agent = AIHubAgent()
    # Test: Ask a question that requires tools
    query = "Check my network status and then tell me what AI tools we have for image generation."
    result = agent.run(query)
    print(f"\n🎯 FINAL RESULT:\n{result}")
