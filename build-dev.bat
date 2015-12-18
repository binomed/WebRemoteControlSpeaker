echo "Start Remote build"
cd remote 
call npm install 
echo "Remote build done"
echo ""
echo "Start Plugins build"
cd ../plugins 
call npm install 
echo "Plugins build done"
echo ""
echo "Start Server build"
cd ../server 
call npm install 
cd src
call npm install
echo "Server build done"
cd ../..