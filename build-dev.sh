#!/bin/bash
echo "Start Remote build"
cd remote
sudo npm install
echo "Remote build done"
echo ""
echo "Start Plugins build"
cd ../plugins
sudo npm install
echo "Plugins build done"
echo ""
echo "Start Server build"
cd ../server
sudo npm install
cd src
sudo npm install
echo "Server build done"
echo ""
cd ../..