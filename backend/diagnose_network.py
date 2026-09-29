
import socket
import urllib.request
import os

def check_dns(host):
    try:
        ip = socket.gethostbyname(host)
        print(f"✅ DNS: {host} -> {ip}")
        return True
    except socket.gaierror:
        print(f"❌ DNS: Could not resolve {host}")
        return False

def check_connectivity(url):
    try:
        response = urllib.request.urlopen(url, timeout=5)
        print(f"✅ Connection: {url} (Status: {response.status})")
        return True
    except Exception as e:
        print(f"❌ Connection: {url} (Error: {e})")
        return False

def check_ip(ip):
    try:
        socket.create_connection((ip, 53), timeout=5)
        print(f"✅ IP Connectivity: {ip} is reachable")
        return True
    except Exception as e:
        print(f"❌ IP Connectivity: {ip} is UNREACHABLE ({e})")
        return False

print("--- Network Diagnosis ---")
check_dns("google.com")
check_dns("openrouter.ai")

print("\n--- Direct IP Access (Bypass DNS) ---")
check_ip("1.1.1.1")
check_ip("8.8.8.8")

print("\n--- API Connectivity ---")
check_connectivity("https://www.google.com")
check_connectivity("https://openrouter.ai/api/v1/models")

print("\n--- Local Environment ---")
print(f"GOOGLE_API_KEY: {'Set' if os.getenv('GOOGLE_API_KEY') else 'Missing'}")
print(f"OPENROUTER_API_KEY: {'Set' if os.getenv('OPENROUTER_API_KEY') else 'Missing'}")
