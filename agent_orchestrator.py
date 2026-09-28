from openrouter_client import ask_openrouter

class AgentOrchestrator:
    def __init__(self):
        self.agents = {
            "researcher": "You are a specialized research agent. Your goal is to gather deep information about a topic, providing facts and data.",
            "analyst": "You are a critical analyst. Your goal is to take gathered information and find patterns, risks, and opportunities.",
            "synthesizer": "You are a master synthesizer. Your goal is to take information from multiple sources and create a final, high-quality, 'best result' summary."
        }

    def gather_and_synthesize(self, query):
        # Step 1: Research
        research_prompt = f"{self.agents['researcher']}\n\nQuery: {query}\n\nProvide detailed research findings."
        research_results = ask_openrouter(research_prompt)
        
        # Step 2: Analysis
        analysis_prompt = f"{self.agents['analyst']}\n\nInformation to analyze:\n{research_results}\n\nProvide a critical analysis."
        analysis_results = ask_openrouter(analysis_prompt)
        
        # Step 3: Synthesis
        synthesis_prompt = f"{self.agents['synthesizer']}\n\nResearch:\n{research_results}\n\nAnalysis:\n{analysis_results}\n\nFinal Task: Create the 'best result' for the user query: {query}"
        final_result = ask_openrouter(synthesis_prompt)
        
        return {
            "best_result": final_result,
            "intermediate_steps": {
                "research": research_results,
                "analysis": analysis_results
            }
        }

if __name__ == "__main__":
    orchestrator = AgentOrchestrator()
    print("Testing multi-agent orchestration for: 'Benefits of using Gemma 2'...")
    results = orchestrator.gather_and_synthesize("Benefits of using Gemma 2")
    print(results["best_result"])
