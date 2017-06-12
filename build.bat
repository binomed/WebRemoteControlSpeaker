echo "Start Remote build"
cd remote
call npm install
call gulp build
echo "Remote build done"
echo ""
echo "Start Plugins build"
cd ../plugins
call npm install
call gulp build
echo "Plugins build done"
echo ""
echo "Start Ensuite build"
cd ../ensuite
call npm install
call gulp build
echo "Ensuite build done"
echo ""
cd ../dist/ensuite
echo "Load node modules for the Ensuite"
call npm install
cd ../..
