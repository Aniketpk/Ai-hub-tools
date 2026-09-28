from pymongo import MongoClient
import os

# Manual .env loading is handled in main.py or openrouter_client.py
client = MongoClient("mongodb://localhost:27017")
db = client["ai_tools_hub"]

# Separate Collections
users_collection = db["users"]
logs_collection = db["logs"]
ai_results_collection = db["ai_results"]
                        