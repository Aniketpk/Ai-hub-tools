from pymongo import MongoClient
import os

client = MongoClient(os.getenv("DATABASE_URL", os.getenv("MONGODB_URI", "mongodb://localhost:27017")))
db = client["ai_tools_hub"]

# Separate Collections
users_collection = db["users"]
logs_collection = db["logs"]
ai_results_collection = db["ai_results"]
                        
