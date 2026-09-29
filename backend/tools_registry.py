
import os
import json
import socket
from datetime import datetime

class AgentTools:
    @staticmethod
    def check_network_status():
        """Checks if the external AI APIs are reachable."""
        hosts = ["google.com", "openrouter.ai"]
        results = {}
        for host in hosts:
            try:
                socket.gethostbyname(host)
                results[host] = "Online"
            except:
                results[host] = "Offline (DNS Failure)"
        return json.dumps(results)

    @staticmethod
    def get_system_time():
        """Returns the current server time."""
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    @staticmethod
    def list_local_files():
        """Lists the files in the current project directory."""
        return str(os.listdir("."))

    @staticmethod
    def search_tools_database(query):
        """Simulates searching a tool database (placeholder for actual DB logic)."""
        # In a real app, this would call database.py
        tools = [
            {"name": "Gemma-2", "type": "LLM", "provider": "Google"},
            {"name": "Claude 3.5", "type": "LLM", "provider": "Anthropic"},
            {"name": "Flux 1.1", "type": "Image", "provider": "Black Forest Labs"}
        ]
        return json.dumps([t for t in tools if query.lower() in t['name'].lower() or query.lower() in t['type'].lower()])

# Registry for the agent
TOOL_MAP = {
    "check_network": AgentTools.check_network_status,
    "get_time": AgentTools.get_system_time,
    "list_files": AgentTools.list_local_files,
    "search_tools": AgentTools.search_tools_database
}
