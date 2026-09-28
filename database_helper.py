import os
import time

class MongoDBHelper:
    def __init__(self):
        # Mocking MongoDB logging since motor is missing in the environment
        self.logs = [] 

    async def log_interaction(self, prompt, response, model_used, latency, mode):
        log_entry = {
            "timestamp": time.time(),
            "prompt": prompt,
            "response": response,
            "model_used": model_used,
            "latency_ms": latency,
            "mode": mode
        }
        self.logs.append(log_entry)
        # We can also log to a local file
        try:
            with open("interaction_logs.txt", "a") as f:
                f.write(f"{time.ctime()} | Model: {model_used} | Latency: {latency} | Prompt: {prompt[:30]}...\n")
        except:
            pass
        print(f"✅ Interaction logged (Local Recovery Mode): {model_used}")

db_helper = MongoDBHelper()
