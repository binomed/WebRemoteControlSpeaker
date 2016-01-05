'use strict';

/*
* Web Remote Control : Plugin Client V2.0.0
*
*/

var WebRemoteControl = (function () {

  /*
  * **************************************
  * ---------------MODEL------------------
  * **************************************
  */

  var conf = null,
    additionnalConfiguration = null,
    socket = null,
    ips = null,
    qrCode = null,
    pluginList = {},
    engine = null;

  const VERSION = '2.0.0';

  /*
  * **************************************
  * ---------INNER METHODS----------------
  * **************************************
  */


  var ajaxJSONGet = function(url){
    return new Promise(function(resolve, reject){
      var http_request = new XMLHttpRequest();
      http_request.open("GET", url, true);
      http_request.onload = function () {
        if (this.status >= 200 && this.status < 300){
          resolve(JSON.parse(http_request.responseText));
        }else{
          reject(this.statusText);
        }
      };
      http_request.onerror = function(){
        reject(this.statusText);
      }
      http_request.send();
    });
    
  };

  var extractPath = function(){
    var scripts = document.getElementsByTagName("script");

    for(var idx = 0; idx < scripts.length; idx++){
      var script = scripts.item(idx);

      if(script.src && script.src.match(/web-remote-control-client\.js$/))
      { 
        var path = script.src;
        return path.substring(0, path.indexOf('plugins'));
      }
    }
    return "";
  };

  function ScriptLoader() {
    var promises = [];

    this.add = function(url, type) {
      var promise = new Promise(function(resolve, reject) {


        var elementToAttach = null;
        var tag = document.createElement(type);
        switch(type){
          case 'script':
            tag.src = url;
            tag.type = "text/javascript";
            elementToAttach = document.body;
          break;
          case 'link':
            tag.rel = "stylesheet";
            tag.type = "text/css";    
            tag.href = url;
            tag.media = 'all';
            elementToAttach = document.getElementsByTagName('head')[0];
          break;
        }

        tag.addEventListener('load', function() {
            resolve(tag);
        }, false);

        tag.addEventListener('error', function() {
            console.log('%s was rej',url);
            reject(tag);
        }, false);


        elementToAttach.appendChild(tag);
      });

      promises.push(promise);
    };

    this.loaded = function() {
      return new Promise(function(resolve, reject){
        Promise.all(promises).then(function(results) {
          resolve(results);
        }, function(error){
          reject(error);
        });
      });
    };
  }

  // Load all the additionnals javascript libraries needed (QrCode)
  var loadAdditionnalScripts = function(){
    let path = extractPath()+'plugins/'+(conf.devMode ? 'src/' : '');
    let loader = new ScriptLoader();
    loader.add(path+'components/qrcode/qrcode.min.js', 'script');
    loader.add(path+'css/main.css', 'link');
    return loader.loaded();    
  }

  var checkAdditionnalConfiguration = function(){
    return new Promise(function(resolve, reject){
      if (!additionnalConfiguration){
        additionnalConfiguration = {};
      }

      if (!additionnalConfiguration.controlsColor){
        additionnalConfiguration.controlsColor = 'white';
      }

      if (!additionnalConfiguration.engine || !additionnalConfiguration.engine.name){
        reject('No Engine Select');
      }

      resolve();
    });
  };
  
  // Initialise with the configuration file
  var initConfig = function(){
    document.onkeydown = keyPress;

    return new Promise(function(resolve, reject){
      Promise.all([
        ajaxJSONGet(extractPath()+'/plugins/conf/conf.json'),
        ajaxJSONGet(extractPath()+'/plugins/conf/ips.json')
        ])
      .then(function(values){
        let confData = values[0];
        conf = confData;
        //initWS();
        loadAdditionnalScripts();
        let ipData = values[1];
        ips = ipData;
        resolve();
      }, function(error){
        reject(error);
      });

    });         

      
  };      

  var loadPlugins = function(pluginUrls){
    if(pluginUrls && pluginUrls.length > 0){
      var loader = new ScriptLoader();
      for (var i = 0; i < pluginUrls.length; i++){
        loader.add(pluginUrls[i].src, 'script');
      }
      return loader.loaded();
    }
    return new Promise(function(){
      resolve();
    });
    
  }

  // Use to detect the call of server presentation
  var keyPress = function(e){
    var evtobj = window.event? event : e
    //keyCode = 80 = q for QRCode
    if (evtobj.keyCode === 81 && evtobj.ctrlKey) showRemoteQrCode();
  }


  var showRemoteQrCode = function(){

    // We show the qrcode for the phone
    if (!document.querySelector('#sws-show-qr-code')){
      var container = document.createElement('DIV');
      container.setAttribute('id', 'sws-show-qr-code');
      container.innerHTML = '<div id="sws-show-qr-header">'+
        '<h1 class="title">Choose, Generate and Scan !</h1><div class="close"> "Ctrl+Q" to hide</div>'+
        '<p>Choose the right network interface and click on \'Generate\' button</p>'+
        '<div id="listIp"></div>'+
        '</div>'+
        '<div id="sws-show-qr-bottom">'+
        '<a id="qrCodeLink"><div id="qrCode"></div></a>'+
        '<h1>Scan with your phone</h1>'+
        '<div id="sws-show-qr-url"></div>'+
        '</div>';

      document.body.appendChild(container);
      qrCode = new QRCode("qrCode", {
            text: "",
            width: 256,
            height: 256,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
      var list = "<select id='sws-show-qr-code-select'>";
      for (var i = 0; i < ips.length; i++){
          list+= "<option value='"+ips[i].id+"' id='ip"+ips[i].id+"' index='"+ips[i].id+"' >"+ips[i].name+"</option>";                
      }
      list += "</select>";
      list += "<button id='sws-show-qr-code-generate'>Generate</button>";
      document.querySelector('#listIp').innerHTML = list;
      var pathPlugin = extractPath();
      document.querySelector('#sws-show-qr-code-generate').addEventListener('click', function(event){
        var get_id = document.getElementById('sws-show-qr-code-select');
        var result = get_id.options[get_id.selectedIndex].value;
        var urlRemote = "http://"+ips[result].ip // HOST
          +":"+conf.port // PORT
          +pathPlugin.substr(pathPlugin.indexOf(conf.port)+(''+conf.port).length, pathPlugin.length) // PATHNAME
          +(conf.devMode ?"remote/src/" : "remote/")+"notes-speaker.html";
        qrCode.clear();
        qrCode.makeCode(urlRemote);
        document.querySelector("#qrCodeLink").setAttribute("href",urlRemote);
        document.querySelector("#sws-show-qr-url").innerHTML = '<span style="text-transform:uppercase; font-weight:bold;">Or goto : </span><br>'+urlRemote;
      });
      
    }

    var area = document.querySelector('#sws-show-qr-code');
    area.style.display= area.style.display === 'none' ? '' : 'none';

  }

  /**
   * Converts the target object to an array.
   */
  var toArray = function( o ) {

    return Array.prototype.slice.call( o );

  }
   
  // Init the WebSocket connection
  var initWS = function(){
        // Get the number of slides

        var confNbSlides = engine.countNbSlides();      
        
        // Connect to websocket
        socket = io.connect('http://'+window.location.hostname+':'+conf.port);
        // On Connection message
        socket.on('connect', function(){            
            socket.emit('message', {
               type :"config", 
               url : window.location.pathname, 
               controlsColor : additionnalConfiguration.controlsColor,
               nbSlides : confNbSlides.nbSlides, 
               mapPosition : confNbSlides.map
            });
            // If we are on the slides of speaker, we specify the controls values
           socket.emit('message', {
               type :"config", 
               indices : engine.getPosition()
           });
        });
        // On message recieve
        socket.on('message', function (data) {
            if( data.type === "operation" && data.data === "show"){
                engine.goToSlide(data);                
            }else if( data.type === "ping"){                       

                if (document.querySelector('#sws-show-qr-code')){
                  document.querySelector('#sws-show-qr-code').style.display = 'none';
                }

                // We have to check the controls in order to show the correct directions              
                socket.emit('message', {
                    type :"config", 
                    url : window.location.pathname, 
                    controlsColor : additionnalConfiguration.controlsColor,
                    nbSlides : confNbSlides.nbSlides, 
                    mapPosition : confNbSlides.map
                });
                socket.emit('message', {
                    type :"config", 
                    indices : engine.getPosition()
                  
                });
            }else if( data.type === "ping-plugin"){                      
                // We have to check the controls in order to show the correct directions
              
                var pluginIds = Object.keys(pluginList);
                for (var i =0; i < pluginIds.length; i++){
                  socket.emit('message', {
                    type :"plugin", 
                    action :"activate", 
                    id : pluginIds[i]
                  });
                }
                // Delegate to plugins 
                
            }else if( data.type === "communicate-plugin"){                      
                // We have to check the controls in order to show the correct directions              
                if (data.id && pluginList[data.id] ){
                  pluginList[data.id](data.data);
                }
                
                
            }
        });
  }; 

  var engineCallBack = function(event){
    // If we're on client slides
    if (socket &&  event.data.notes !== undefined) {
      socket.emit('message', {type : 'notes', data : event.data});       
    }
    // If we're on speaker slides
    if (socket){                            
        socket.emit("message", {
            type:'config', 
            indices : engine.getPosition()
        });                
    }   
  }

  var loadEngine = function (engineConf){
    var loader = new ScriptLoader();
    let path = extractPath()+'plugins/'+(conf.devMode ? 'src/' : '');
    loader.add(`${path}/engines/${engineConf.name}-client-engine.js`, 'script');
    return loader.loaded();
  }

  // Init the correct Engine
  var initEngine = function (engineConf){
    return new Promise(function( resolve, reject){
      switch(engineConf.name){
        case 'revealjs':
            engine = RevealEngine;            
            break;
      }

      if (engine){
        engine.initEngineListener(engineCallBack)
        resolve();
      }else{
        reject('Engine not initialize ! ');
      }
    });          
  };

  

  /*
  * **************************************
  * --------EXPOSED METHODS----------------
  * **************************************
  */
 
  var registerPlugin = function (id, callbackAction){
    pluginList[id] = callbackAction;
  }
  

  // We init the client side (websocket + engine Listener)
  var init = function(conf){
    // We check if this script ins't in the iframe of the remote control
    if(!window.parent || !window.parent.document.body.getAttribute('sws-remote-iframe-desactiv')){
        console.log('Initialize Client side');
        additionnalConfiguration = conf;
        checkAdditionnalConfiguration()
        .then(function(){
          return initConfig();
        })
        .then(function(){
          return loadEngine(conf.engine);
        })
        .then(function(){
          return initEngine(conf.engine);
        })
        .then(function(){
          return new Promise(function(resolve, reject){
            initWS();
            resolve();
          });
        })
        .then(function(){
          return loadPlugins(conf.plugins);
        })
        .then(function(){
          console.info('All is load ! ');
        })
        .catch(function(err){
          console.error('Error : %s \n %s', err.message, err.stack);
        });        
    }        
  }

  /*
  * **************************************
  * --------INITIALIZATION----------------
  * **************************************
  */


  return {
    init : init,
    registerPlugin : registerPlugin
  }
})();
