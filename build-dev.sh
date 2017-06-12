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
echo "Start Ensuite build"
cd ../ensuite
sudo npm install
cd src
sudo npm install
echo "Ensuite build done"
echo ""
cd ../..
