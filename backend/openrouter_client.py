import os
import urllib.request
import json


from dotenv import load_dotenv
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


# Model Registry
MODELS = {
    "gemma": "google/gemma-2-9b-it",
    "llama": "meta-llama/llama-3-70b-instruct",
    "claude": "anthropic/claude-3-opus",
    "gpt4": "openai/gpt-4o",
    "mistral": "mistralai/mixtral-8x7b-instruct",
    "dalle": "openai/dall-e-3",
    "stable_diffusion": "stabilityai/stable-diffusion-xl-v1.0",
    "flux": "black-forest-labs/flux-1.1-pro",
    "gemini": "google/gemini-pro-1.5",
    "gpt5.5": "openai/gpt-5.5",
    "qwen": "qwen/qwen-3-4b-a22b",
}


def ask_openrouter(prompt, model_alias="gemma", system_prompt=None):

    key = os.getenv("OPENROUTER_API_KEY")

    if not key:
        return "Error: OPENROUTER_API_KEY not found in environment."

    model_id = MODELS.get(model_alias, model_alias)

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/Aniketpk/Ai-hub-tools",
        "X-Title": "AI Tool Hub",
    }

    messages = []

    if system_prompt:
        messages.append({
            "role": "system",
            "content": system_prompt
        })

    messages.append({
        "role": "user",
        "content": prompt
    })

    payload = {
        "model": model_id,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1000,
    }

    try:
        data_encoded = json.dumps(payload).encode("utf-8")

        req = urllib.request.Request(
            OPENROUTER_URL,
            data=data_encoded,
            headers=headers,
            method="POST",
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            res_data = json.loads(
                response.read().decode("utf-8")
            )

            if "choices" in res_data and len(res_data["choices"]) > 0:
                return res_data["choices"][0]["message"]["content"]

            return f"Error: No choices returned in response: {res_data}"

    except Exception as e:

        print(
            f"⚠️ OpenRouter Cloud Unreachable, "
            f"falling back to Local Backend... ({e})"
        )

        try:
            local_url = "http://127.0.0.1:8000/ai"

            local_payload = {
                "prompt": prompt,
                "mode": "auto",
            }

            local_req = urllib.request.Request(
                local_url,
                data=json.dumps(local_payload).encode(),
                headers={
                    "Content-Type": "application/json"
                },
                method="POST",
            )

            with urllib.request.urlopen(
                local_req,
                timeout=5
            ) as local_res:

                local_data = json.loads(
                    local_res.read().decode()
                )

                return local_data.get(
                    "response",
                    "Error: Local fallback failed to return response."
                )

        except Exception as local_e:

            return (
                f"Error: All backends failed. "
                f"Cloud: {e}, Local: {local_e}"
            )


if __name__ == "__main__":

    print("Testing Advanced OpenRouter Client...")

    # The API key is loaded from .env.local.
    # Never hardcode API keys in this file.

    if not os.getenv("OPENROUTER_API_KEY"):
        print("❌ OPENROUTER_API_KEY is not configured.")
    else:
        print("✅ OpenRouter API key loaded from environment.")

        response = ask_openrouter(
            "Say hello from Qwen!",
            "qwen"
        )

        print("Qwen Response:", response)