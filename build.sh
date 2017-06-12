#!/bin/bash
echo "Start Remote build"
cd remote
sudo npm install
gulp build
echo "Remote build done"
echo ""
echo "Start Plugins build"
cd ../plugins
sudo npm install
gulp build
echo "Plugins build done"
echo ""
echo "Start Ensuite build"
cd ../ensuite
sudo npm install
gulp build
echo "Ensuite build done"
echo ""
cd ../dist/ensuite
echo "Load node modules for the Ensuite"
sudo npm install
cd ../..
