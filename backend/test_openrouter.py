
import os
import urllib.request
import json

def load_env_manual(filepath=".env.local"):
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value

load_env_manual()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def test_key():
    if not OPENROUTER_API_KEY:
        print("❌ Error: OPENROUTER_API_KEY not found.")
        return

    print(f"🔄 Testing OpenRouter Key: {OPENROUTER_API_KEY[:15]}...")
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "X-Title": "API Key Tester",
    }

    payload = {
        "model": "meta-llama/llama-3-8b-instruct:free",
        "messages": [{"role": "user", "content": "Say 'API Working!'"}]
    }

    try:
        data_encoded = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(OPENROUTER_URL, data=data_encoded, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            if 'choices' in res_data:
                print(f"✅ SUCCESS! Response: {res_data['choices'][0]['message']['content']}")
            else:
                print(f"❌ Response Error: {res_data}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_key()
