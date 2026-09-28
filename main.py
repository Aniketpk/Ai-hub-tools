import http.server
import socketserver
import json
import urllib.request
import os
from datetime import datetime
import time

# Use a different port if 8000/8888 is occupied
PORT = 55555

# Manual .env loading
def load_env_manual(filepath=".env.local"):
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    parts = line.strip().split("=", 1)
                    if len(parts) == 2:
                        os.environ[parts[0]] = parts[1]

load_env_manual()

class SimpleAIHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"message": "AI Tools Hub Production API is Online (Zero-Dependency Mode)"}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/ai":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data)
            
            prompt = request_data.get("prompt", "")
            mode = request_data.get("mode", "auto")
            
            # Inject current date into prompt if not already present
            current_date = datetime.now().strftime("%A, %B %d, %Y")
            if "Today's Date:" not in prompt:
                prompt = f"System: Today's Date is {current_date}.\n\n{prompt}"
            
            response_content = ""
            model_used = ""
            
            # PRIORITY 1: Ollama (Gemma 4 E4B) — fully offline, real AI
            if not response_content and mode in ("auto", "gemma"):
                print(f"🔄 Trying Ollama (Gemma 4 E4B) local model...")
                ollama_url = "http://localhost:11434/api/chat"
                
                messages = [{"role": "user", "content": prompt}]
                
                # Check for multimodal inputs
                images = request_data.get("images", [])
                audio = request_data.get("audio", [])
                
                if images:
                    messages[0]["images"] = images
                if audio:
                    messages[0]["audio"] = audio

                ollama_payload = {
                    "model": "gemma4:e4b",
                    "messages": messages,
                    "stream": False
                }
                try:
                    req = urllib.request.Request(
                        ollama_url,
                        data=json.dumps(ollama_payload).encode(),
                        headers={'Content-Type': 'application/json'}
                    )
                    with urllib.request.urlopen(req, timeout=60) as response:
                        res_data = json.loads(response.read().decode())
                        response_content = res_data.get("message", {}).get("content", "")
                        if response_content:
                            model_used = "Gemma 4 E4B (Ollama Local)"
                            print("✅ Ollama Gemma 4 E4B Success")
                except Exception as e:
                    print(f"❌ Ollama not available: {e}")
            
            # PRIORITY 2: Google Gemini API (cloud)
            api_key = os.getenv("GOOGLE_API_KEY") or ""
            if not response_content and api_key and mode in ("auto", "gemini"):
                print(f"🔄 Attempting real Gemini API call...")
                test_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
                payload = {"contents": [{"parts": [{"text": prompt}]}]}
                try:
                    req = urllib.request.Request(test_url, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
                    with urllib.request.urlopen(req, timeout=15) as response:
                        res_data = json.loads(response.read().decode())
                        response_content = res_data['candidates'][0]['content']['parts'][0]['text']
                        model_used = "Gemini 2.5 Flash (Cloud)"
                        print("✅ Gemini API Success")
                except Exception as e:
                    print(f"❌ Gemini API Failed: {e}")
            
            # PRIORITY 3: OpenRouter (cloud)
            if not response_content:
                or_key = os.getenv("OPENROUTER_API_KEY") or ""
                if or_key:
                    print(f"🔄 Attempting OpenRouter fallback...")
                    or_url = "https://openrouter.ai/api/v1/chat/completions"
                    or_payload = {
                        "model": "meta-llama/llama-3.1-8b-instruct:free", 
                        "messages": [{"role": "user", "content": prompt}]
                    }
                    try:
                        req = urllib.request.Request(or_url, data=json.dumps(or_payload).encode(), headers={
                            'Content-Type': 'application/json',
                            'Authorization': f'Bearer {or_key}',
                            'HTTP-Referer': 'https://ai-hub-tools.vercel.app',
                            'X-Title': 'AI Hub Tools'
                        })
                        with urllib.request.urlopen(req, timeout=15) as response:
                            res_data = json.loads(response.read().decode())
                            response_content = res_data['choices'][0]['message']['content']
                            model_used = "Llama 3.1 (OpenRouter)"
                            print("✅ OpenRouter Success")
                    except Exception as e:
                        print(f"❌ OpenRouter Failed: {e}")

            # PRIORITY 4: Smart Offline Mock
            if not response_content:
                if "AVAILABLE TOOLS" in prompt:
                    if "Observation:" in prompt:
                        response_content = "Thought: I have gathered the local information requested.\nFinal Answer: I have checked the local environment. Your DNS is currently failing for external APIs, but your local files and tool database are intact. For image generation, we have Flux 1.1 Pro and Stable Diffusion registered in our system."
                    else:
                        response_content = "Thought: The user wants to check the network and see image tools. I should first check the network status.\nAction: check_network\nArgument: None"
                    model_used = "Local Agent Simulator"
                else:
                    response_content = f"[Offline Mock] I am currently in recovery mode. Your prompt: {prompt[:50]}..."
                    model_used = "Zero-Dep Engine"
            
            result = {
                "response": response_content,
                "model_used": model_used,
                "latency": "Variable"
            }
            
            # Log to local file since MongoDB might be offline
            try:
                with open("ai_interactions.log", "a") as f:
                    f.write(f"{datetime.now()} | {prompt[:30]} | {result['model_used']}\n")
            except:
                pass

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        elif self.path == "/test-api":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data)
            api_key = request_data.get("key", "")
            
            print(f"🔍 Testing API Key: {api_key[:10]}...")
            
            # Direct test using urllib to Google's API
            test_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={api_key}"
            payload = {"contents": [{"parts": [{"text": "Say 'API Key Working'"}]}]}
            
            try:
                req = urllib.request.Request(test_url, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(req, timeout=10) as response:
                    res_data = json.loads(response.read().decode())
                    result = {"status": "success", "response": res_data}
            except Exception as e:
                result = {"status": "error", "message": str(e)}

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        elif self.path == "/agent":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data)
            query = request_data.get("query", "")
            
            print(f"🤖 Agent Request received: {query}")
            
            try:
                from AI_Hub_Agent import AIHubAgent
                agent = AIHubAgent()
                answer = agent.run(query)
                result = {"answer": answer, "status": "success"}
            except Exception as e:
                result = {"answer": f"Agent Error: {str(e)}", "status": "error"}

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        elif self.path == "/save":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"message": "Saved successfully (Mock)"}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

if __name__ == "__main__":
    # Attempt to start the server.
    socketserver.TCPServer.allow_reuse_address = True
    current_port = PORT
    max_tries = 5
    
    for i in range(max_tries):
        try:
            with socketserver.TCPServer(("", current_port), SimpleAIHandler) as httpd:
                print(f"✅ AI Hub Backend started on port {current_port} (Zero-Dependency Mode)")
                httpd.serve_forever()
                break
        except Exception as e:
            if "Address already in use" in str(e) or "[Errno 48]" in str(e):
                print(f"⚠️ Port {current_port} busy, trying {current_port + 1}...")
                current_port += 1
            else:
                print(f"❌ Could not start backend on port {current_port}: {e}")
                break
