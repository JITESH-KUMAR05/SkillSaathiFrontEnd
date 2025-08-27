#!/usr/bin/env bash
"""Simple script to start the frontend"""

echo "🚀 Starting BuddyAgents Frontend..."
echo "📍 Frontend URL: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo "❌ Press Ctrl+C to stop"
echo "--------------------------------------------------"

# Change to frontend directory
cd "/home/jitesh/Desktop/Programing/Python/BuddyAgents/frontend"

# Start the development server
npm run dev
