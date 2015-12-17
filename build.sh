#!/bin/bash
echo "Start Remote build"
cd remote
sudo npm install
gulp build
echo "Remote build done"
echo ""
echo "Start Reveal build"
cd ../reveal_plugin
sudo npm install
gulp build
echo "Reveal build done"
echo ""
echo "Start Server build"
cd ../server
sudo npm install
gulp build
echo "Server build done"
echo ""
cd ../dist/server
echo "Load node modules for the server"
sudo npm install 
cd ../..
