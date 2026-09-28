
#!/bin/bash

echo "--- 🔧 AI Hub Auto-Fix Script ---"

# 1. Clear Port 3000
echo "Attempting to clear port 3000..."
sudo lsof -ti:3000 | xargs kill -9 2>/dev/null
echo "✅ Port 3000 cleared (if it was occupied)"

# 2. Fix permissions
echo "Ensuring file permissions are correct..."
chmod -R 755 .
echo "✅ Permissions updated"

# 3. Clean Next.js cache
echo "Cleaning Next.js cache..."
rm -rf .next
echo "✅ Cache cleaned"

# 4. Check API Keys in .env.local
if [ -f .env.local ]; then
    echo "✅ .env.local found"
else
    echo "❌ .env.local MISSING! Please create it with GOOGLE_API_KEY and OPENROUTER_API_KEY"
fi

echo "--- ✨ Fixes complete! ---"
echo "Next steps:"
echo "1. Run: PORT=3001 npm run dev"
echo "2. Run: python3 main.py (to start the local mock backend)"
echo "3. Refresh your browser at http://localhost:3001"
