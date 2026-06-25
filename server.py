import os
import json
import urllib.request
import urllib.error
from http.server import SimpleHTTPRequestHandler, HTTPServer

def load_env():
    """Manually parse .env file to load GEMINI_API_KEY into os.environ"""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    os.environ[key.strip()] = val.strip()

class SecureProxyHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/copilot':
            # Reload .env on every request so key changes are detected immediately
            load_env()
            
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            api_key = os.environ.get('GEMINI_API_KEY')
            if not api_key or api_key == 'tu_api_key_de_gemini':
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'API Key no configurada. Por favor, edita el archivo .env e ingresa tu GEMINI_API_KEY de Google AI Studio.'
                }).encode('utf-8'))
                return
            
            # Target Gemini API endpoint (2.5-flash)
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            
            req = urllib.request.Request(
                url,
                data=post_data,
                headers={'Content-Type': 'application/json'}
            )
            
            try:
                with urllib.request.urlopen(req) as response:
                    res_data = response.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(res_data)
            except urllib.error.HTTPError as e:
                err_data = e.read()
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(err_data)
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        # Delegate GET requests to SimpleHTTPRequestHandler to serve static assets
        super().do_GET()

def run(port=8000):
    load_env()
    server_address = ('', port)
    httpd = HTTPServer(server_address, SecureProxyHandler)
    print(f"Serving secure proxy and static files on http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    print("\nStopping server...")

if __name__ == '__main__':
    run()
