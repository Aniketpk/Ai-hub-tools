from dotenv import load_dotenv
load_dotenv()

import os
import google.generativeai as genai

# Manual .env loading
def load_env_manual(filepath=".env.local"):
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value

load_env_manual()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
print(f"Key found: {'Yes' if GOOGLE_API_KEY else 'No'}")

if GOOGLE_API_KEY:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content("Say hello")
        print(f"Gemini Response: {response.text}")
    except Exception as e:
        print(f"Error calling Gemini: {e}")
else:
    print("No GOOGLE_API_KEY found.")
