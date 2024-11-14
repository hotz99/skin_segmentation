#!/bin/bash

U2NET_PATH="./u2net"
TRADITIONAL_PATH="./traditional"
WEB_CLIENT_PATH="./web_client"

echo "activating venv in $U2NET_PATH"
source "$U2NET_PATH/venv/bin/activate"

echo "activating venv in $TRADITIONAL_PATH"
source "$TRADITIONAL_PATH/venv/bin/activate"

echo "starting npm dev server in $WEB_CLIENT_PATH"
cd "$WEB_CLIENT_PATH"
npm run dev

