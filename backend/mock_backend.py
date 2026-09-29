
import http.server
import socketserver
import json
import time

PORT = 8000

class MockHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/ai':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data)
            prompt = request_data.get('prompt', '')
            
            print(f"received prompt: {prompt[:50]}...")
            
            response_data = {
                "response": f"[MOCK BACKEND] I am currently in offline recovery mode. Your prompt was: '{prompt[:30]}...'. Please check your internet connection to use high-end models.",
                "model_used": "Mock Recovery Engine",
                "latency": "10ms"
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"message": "Mock Backend is Online"}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

with socketserver.TCPServer(("", PORT), MockHandler) as httpd:
    print(f"🚀 Mock Backend running on port {PORT}")
    print("This backend requires ZERO dependencies and will work offline.")
    httpd.serve_forever()
