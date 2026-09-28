# Antigravity AI Orchestrator Integration

Your AI Hub has been upgraded with a multi-agent orchestration system and OpenRouter integration for Gemma.

## Features Integrated

1.  **OpenRouter Integration**:
    *   Added support for OpenRouter API using your provided Gemma key.
    *   Supports `google/gemma-2-9b-it` (and other models) for high-quality responses.
    *   API Key is stored in `.env.local` as `OPENROUTER_API_KEY`.

2.  **Multi-Agent Orchestrator**:
    *   New file: `agent_orchestrator.py`.
    *   This system uses three distinct agent personas to fulfill requests:
        *   **Researcher**: Gathers detailed information and facts.
        *   **Analyst**: Critically analyzes the facts for risks and patterns.
        *   **Synthesizer**: Combines all inputs into the "best result".

3.  **New API Endpoints**:
    *   `GET /multi-agent-ask?query=YOUR_QUERY`: Automatically triggers the researcher -> analyst -> synthesizer pipeline.
    *   `POST /ask` with `{"mode": "cloud"}`: Uses OpenRouter (Gemma) instead of the local model.
    *   `GET /orchestrate?query=YOUR_QUERY`: Smart routing between local and cloud models.

## How to Run

1.  Ensure dependencies are installed:
    ```bash
    pip install requests python-dotenv fastapi uvicorn
    ```
2.  Start the backend:
    ```bash
    uvicorn main:app --reload
    ```
3.  Test the multi-agent system:
    ```bash
    curl "http://localhost:8000/multi-agent-ask?query=Benefits%20of%20using%20Gemma%202"
    ```

## Skills Integration
We are currently installing 1,380+ agentic skills from `antigravity-awesome-skills`. These will be available in the `./skills` directory for the agents to reference in the future.
