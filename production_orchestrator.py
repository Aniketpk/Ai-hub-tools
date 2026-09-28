import time
import asyncio
from openrouter_client import ask_openrouter
from gemma_model import ask_gemma
from database_helper import db_helper

class ProductionOrchestrator:
    def __init__(self):
        self.cloud_models = {
            "gemini": "google/gemini-2.0-flash-exp", # Fallback for Gemini calls via OpenRouter or direct
            "gpt4": "openai/gpt-4o",
            "claude": "anthropic/claude-3-opus"
        }

    async def task_planner(self, prompt):
        """Analyze intent and break into tasks/modality."""
        planner_prompt = f"Analyze the user intent for: '{prompt}'. \n" \
                         f"Return exactly two words: [MODALITY] [CATEGORY].\n" \
                         f"MODALITY options: TEXT, IMAGE, VIDEO, AUDIO.\n" \
                         f"CATEGORY options: SIMPLE, COMPLEX, GENERATIVE."
        result = ask_openrouter(planner_prompt, model_alias="llama")
        parts = result.strip().upper().split()
        modality = parts[0] if len(parts) > 0 else "TEXT"
        category = parts[1] if len(parts) > 1 else "SIMPLE"
        return modality, category

    async def execute_task(self, prompt, model_alias, modality="TEXT"):
        """Execute the task based on modality and selected model."""
        start_time = time.time()
        from multimodal_engine import multi_engine
        
        output_type = "text"
        output_content = ""

        if modality == "IMAGE":
            output_type = "image"
            # Use the new Flux model for high-quality images
            try:
                output_content = ask_openrouter(prompt, model_alias="flux")
                if "Error" in output_content: raise Exception("Flux failed")
            except:
                output_content = multi_engine.generate_image(prompt)
            actual_model = "Flux 1.1 Pro"
            
        elif modality == "VIDEO":
            output_type = "video"
            output_content = multi_engine.text_to_video(prompt)
            actual_model = "Runway Gen-2 (Mock)"
            
        elif modality == "AUDIO":
            output_type = "audio"
            output_content = multi_engine.text_to_speech(prompt)
            actual_model = "ElevenLabs (Mock)"
            
        else: # TEXT
            output_type = "text"
            if model_alias == "gemma":
                output_content = ask_gemma(prompt)
                actual_model = "Gemma (Local)"
            else:
                output_content = ask_openrouter(prompt, model_alias=model_alias)
                actual_model = f"{model_alias.upper()} (Cloud)"

        latency = (time.time() - start_time) * 1000
        return output_content, output_type, actual_model, latency

    async def run(self, prompt, mode="auto"):
        # 1. Plan & Detect Modality
        modality, category = await self.task_planner(prompt)
        
        # 2. Select model (for text tasks)
        model_choice = "gpt4" if category == "COMPLEX" else "gemma"
        if mode == "openai": model_choice = "gpt4"
        if mode == "gemini": model_choice = "gemini"

        # 3. Execute with modality support
        try:
            content, out_type, model_used, latency = await self.execute_task(prompt, model_choice, modality)
        except Exception as e:
            content, out_type, model_used, latency = await self.execute_task(prompt, "gemma", "TEXT")

        # 4. Log
        await db_helper.log_interaction(prompt, content, model_used, latency, mode)

        return {
            "type": out_type,
            "output": content,
            "model_used": model_used,
            "latency": f"{latency:.2f}ms"
        }

orchestrator = ProductionOrchestrator()
