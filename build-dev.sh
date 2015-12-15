#!/bin/bash
echo "Start Remote build"
cd remote
sudo npm install
echo "Remote build done"
echo ""
echo "Start Reveal build"
cd ../reveal_plugin
sudo npm install
echo "Reveal build done"
echo ""
echo "Start Server build"
cd ../server
sudo npm install
cd src
sudo npm install
echo "Server build done"
echo ""
cd ../..