web-remote-control-slides
======================

Web Remote Control is a plugin for speakers that offer a remote control of the presentation from your mobile located in the same network loop.

The basic features ares : 

* Remote control of presentation, you could navigate throught your presentation on mobile and validate the slide to show it on your presentation screen.
* You have access to the notes of the current slide
* You could configure a timer if your presentation need to respect a timing.
* The remote provides also some plugins to enhance the speaker experiences. See after for more information about the plugins


# Require for installation

This plugin use : 

 * NodeJS
 

1. For NodeJS you have to install [node.js](http://nodejs.org/download/). Don't forget to select to add node to the path ! 


**It is important that you have the right to write on the directory where the presentation is because the start of the server will write some files on your File System.**

# Use the build version

## Require for build

The build is based on those tools

 * Gulp

1. For Gulp : just execute ```npm install -g gulp-cli``` 

If you are behind a proxy, you have to configure npm to go throught proxy [npm behind proxy](http://jjasonclark.com/how-to-setup-node-behind-web-proxy) 

## Install

1. Download of clone the repository
2. Copy this directory into : 'YourPresentation/plugin/web-remote-control'

## Build, the project

A build.bat or build.sh was write to build the project to a dist directory

1. Go to 'YourPresentation/plugin/web-remote-control'
2. run 'build.bat' or 'build.sh' (for unix don't forget to give executive rights)

This should create a "dist" directory with the project compile and it has normally download all the necessary dependancies


### In the presentation

You have to add thoses line in your html

1. ```<script src="/plugin/web-remote-control/dist/plugins/js/web-remote-control-client.js"></script>``` 
2. initialize the RemoteControl object ```WebRemoteControl.init();```
3. the object to pass to init method has thoses parameters
 1. controlsColor : The color of controls in remote (default is 'white')
 2. plugins : The list of plugins to activate. Each plugin is a javascript object with an src attribute that reference the path to the desire plugin
4. ```<script src="/socket.io/socket.io.js"></script>``` in the import section of your javascripts

According to the number of plugins you want to use with the remote control, add as many lines as you want somes plugins in the plugins attribute : 
 ```{ src: '{$HOME\_DIRECTORY}/plugin/web-remote-control/dist/plugins/plugins/*{thePluginYouWant}*.js'}``` 

Here is the list of plugin and their paths (according to plugins/plugins directory) : 

 * ```sws-plugin-video-play.js``` : Could play or pause a html5 video tag in the current slide show on screen
 * ```sws-plugin-audio-play.js``` : Could play or pause a html5 audio tag in the current slide show on screen
 * ```sws-plugin-remote-pointer.js``` : Allow you to use your finger as laser pointer on the client presentation.
 * ```sws-plugin-sensor-pointer.js``` : Allow you to use your phone as laser pointer on the client presentation.
 *  More to come soon

#### Spesifics installations

* Reveal JS
1. You have to check that markdown plugin is present in your presentation
2. You have to check that you have the file lib/js/head.min.js in your presentation



### Use it

1. Start the server from your Presentation folder root with ```node plugin/web-remote-control/dist/server/server.js -r DIRECTORY_PATH``` (The DIRECTORY\_PATH is corresponding to the relative path according to the curent directory where the reveal presentation with the plugin is present (A directory where plugin/sockets-notes is present)). If your reveal presentation is on the root of the server (I.E. the plugin directory is aside of the index.html) juste start the server with ```node plugin/web-remote-control/dist/server/server.js```
2. Launch your presentation on http://localhost:8080/{youPresentation}.html
2. Tap on your keyboard CRTL+Q
3. Select the right network and click on it
4. Scan the QrCode with your smartphone
5. Enjoy ! 


**You could user node ```{PATH_TO_SERVER_JS}/server.js -h``` for getting the available commands**

# Use the development version

If you want to build a part of the project, you have to run ```grunt release```

When you will work with the server, don't forget to specify that your are in development mode : ```node plugin/web-remote-control/dist/server/server.js -d true```



