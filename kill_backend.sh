#!/bin/bash
PORT=55555
PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
    echo "No process found on port $PORT"
else
    echo "Killing process $PID on port $PORT..."
    kill -9 $PID
    echo "Done."
fi
