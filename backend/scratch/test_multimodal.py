import json
import urllib.request

def test_multimodal_local():
    url = "http://127.0.0.1:55555/ai"
    payload = {
        "prompt": "What is in this image?",
        "mode": "gemma",
        "images": ["iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="], # Tiny transparent PNG
        "audio": []
    }
    
    print(f"Testing local multimodal support at {url}...")
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode(),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode())
            print("Response:", json.dumps(res_data, indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_multimodal_local()
