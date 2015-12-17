echo "Start Remote build"
cd remote 
call npm install 
call gulp build
echo "Remote build done"
echo ""
echo "Start Reveal build"
cd ../reveal_plugin 
call npm install 
call gulp build
echo "Reveal build done"
echo ""
echo "Start Server build"
cd ../server 
call npm install 
call gulp build
echo "Server build done"
echo ""
cd ../dist/server
echo "Load node modules for the server"
call npm install 
cd ../..