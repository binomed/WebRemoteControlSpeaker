'use strict';

/*
* Web Remote Control : Plugin Client V2.0.0
*
*/
const VERSION = '2.0.0';


/*
* **************************************
* ---------INNER CLASS----------------
* **************************************
*/

class ScriptLoader{

  constructor(){
    this.promises = new Array();
  }

  add(url, type) {
      const promise = new Promise((resolve, reject) => {


      let elementToAttach = null;
      const tag = document.createElement(type);
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

      tag.addEventListener('load', () => {
          resolve(tag);
      }, false);

      tag.addEventListener('error', () => {
          console.log('%s was rej',url);
          reject(tag);
      }, false);


      elementToAttach.appendChild(tag);
    });

    this.promises.push(promise);
  };

  loaded() {
    return new Promise((resolve, reject) => {
      Promise.all(this.promises).then((results) => {
        resolve(results);
      }, (error) => {
        reject(error);
      });
    });
  };
}

/*
* **************************************
* ---------INNER METHODS----------------
* **************************************
*/

function _ajaxJSONGet(url){
  return new Promise((resolve, reject) => {
    const http_request = new XMLHttpRequest();
    http_request.open("GET", url, true);
    http_request.onload = function() {
      if (this.status >= 200 && this.status < 300){
        resolve(JSON.parse(http_request.responseText));
      }else{
        reject(this.statusText);
      }
    };
    http_request.onerror = function() {
      reject(this.statusText);
    }
    http_request.send();
  });

};

function _extractPath(){
  const scripts = document.getElementsByTagName("script");

  for(let idx = 0; idx < scripts.length; idx++){
    const script = scripts.item(idx);

    if(script.src && script.src.match(/web-remote-control-client\.js$/))
    {
      const path = script.src;
      return path.substring(0, path.indexOf('plugins'));
    }
  }
  return "";
};


// Load all the additionnals javascript libraries needed (QrCode)
function _loadAdditionnalScripts(){
  let path = _extractPath()+'plugins/'+(this.conf.devMode ? 'src/' : '');
  let loader = new ScriptLoader();
  loader.add(path+'components/qrcode/qrcode.min.js', 'script');
  loader.add(path+'css/main.css', 'link');
  return loader.loaded();
}

function _checkAdditionnalConfiguration(){
  return new Promise((resolve, reject) => {
    if (!this.additionnalConfiguration){
      this.additionnalConfiguration = {};
    }

    if (!this.additionnalConfiguration.controlsColor){
      this.additionnalConfiguration.controlsColor = 'white';
    }

    if (!this.additionnalConfiguration.engine || !this.additionnalConfiguration.engine.name){
      reject('No Engine Select');
    }

    resolve();
  });
};

// Initialise with the configuration file
function _initConfig(){
  document.onkeydown = _keyPress.bind(this);

  return new Promise((resolve, reject) => {
    Promise.all([
      _ajaxJSONGet(_extractPath()+'/plugins/conf/conf.json'),
      _ajaxJSONGet(_extractPath()+'/plugins/conf/ips.json')
      ])
    .then((values) => {
      const confData = values[0];
      this.conf = confData;
      //initWS();
      _loadAdditionnalScripts.bind(this)();
      const ipData = values[1];
      this.ips = ipData;
      resolve();
    }, (error) => {
      reject(error);
    });

  });


};

function _loadPlugins(pluginUrls){
  if(pluginUrls && pluginUrls.length > 0){
    const loader = new ScriptLoader();
    for (let i = 0; i < pluginUrls.length; i++){
      loader.add(pluginUrls[i].src, 'script');
    }
    return loader.loaded();
  }
  return new Promise((resolve, reject) =>{
    resolve();
  });

}

// Use to detect the call of server presentation
function _keyPress(e){
  const evtobj = window.event? event : e
  //keyCode = 80 = q for QRCode
  if (evtobj.keyCode === 81 && evtobj.ctrlKey) _showRemoteQrCode();
}


function _showRemoteQrCode(){

  // We show the qrcode for the phone
  if (!document.querySelector('#sws-show-qr-code')){
    const container = document.createElement('DIV');
    container.setAttribute('id', 'sws-show-qr-code');
    container.innerHTML = `
      <div id="sws-show-qr-header">
        <h1 class="title">Choose, Generate and Scan !</h1>
        <div class="close"> "Ctrl+Q" to hide</div>
        <p>Choose the right network interface and click on 'Generate' button</p>
        <div id="listIp"></div>
      </div>
      <div id="sws-show-qr-bottom">
        <a id="qrCodeLink"><div id="qrCode"></div></a>
        <h1>Scan with your phone</h1>
        <div id="sws-show-qr-url"></div>
      </div>`;

    document.body.appendChild(container);
    this.qrCode = new QRCode("qrCode", {
          text: "",
          width: 256,
          height: 256,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
      });
    let list = "<select id='sws-show-qr-code-select'>";
    for (let i = 0; i < this.ips.length; i++){
        list+= "<option value='"+this.ips[i].id+"' id='ip"+this.ips[i].id+"' index='"+this.ips[i].id+"' >"+this.ips[i].name+"</option>";
    }
    list += "</select>";
    list += "<button id='sws-show-qr-code-generate'>Generate</button>";
    document.querySelector('#listIp').innerHTML = list;
    const pathPlugin = _extractPath();
    document.querySelector('#sws-show-qr-code-generate').addEventListener('click', (event) => {
      const get_id = document.getElementById('sws-show-qr-code-select');
      const result = get_id.options[get_id.selectedIndex].value;
      const urlRemote = "http://"+this.ips[result].ip // HOST
        +":"+this.conf.port // PORT
        +pathPlugin.substr(pathPlugin.indexOf(this.conf.port)+(''+this.conf.port).length, pathPlugin.length) // PATHNAME
        +(this.conf.devMode ?"remote/src/" : "remote/")+"notes-speaker.html";
      this.qrCode.clear();
      this.qrCode.makeCode(urlRemote);
      document.querySelector("#qrCodeLink").setAttribute("href",urlRemote);
      document.querySelector("#sws-show-qr-url").innerHTML = '<span style="text-transform:uppercase; font-weight:bold;">Or goto : </span><br>'+urlRemote;
    });

  }

  const area = document.querySelector('#sws-show-qr-code');
  area.style.display= area.style.display === 'none' ? '' : 'none';

}

/**
 * Converts the target object to an array.
 */
function _toArray( o ) {

  return Array.prototype.slice.call( o );

}

// Init the WebSocket connection
function _initWS(){
      // Get the number of slides

      const confNbSlides = this.engine.countNbSlides();

      // Connect to websocket
      this.socket = io.connect('http://'+window.location.hostname+':'+this.conf.port);
      // On Connection message
      this.socket.on('connect', () =>{
          this.socket.emit('message', {
              type :"config",
              url : window.location.pathname,
              controlsColor : this.additionnalConfiguration.controlsColor,
              nbSlides : confNbSlides.nbSlides,
              mapPosition : confNbSlides.map
          });
          // If we are on the slides of speaker, we specify the controls values
          this.socket.emit('message', {
              type :"config",
              indices : this.engine.getPosition()
          });
      });
      // On message recieve
      this.socket.on('message', (data) => {
          if( data.type === "operation" && data.data === "show"){
              this.engine.goToSlide(data);
          }else if( data.type === "ping"){

              if (document.querySelector('#sws-show-qr-code')){
                document.querySelector('#sws-show-qr-code').style.display = 'none';
              }

              // We have to check the controls in order to show the correct directions
              this.socket.emit('message', {
                  type :"config",
                  url : window.location.pathname,
                  controlsColor : this.additionnalConfiguration.controlsColor,
                  nbSlides : confNbSlides.nbSlides,
                  mapPosition : confNbSlides.map
              });
              this.socket.emit('message', {
                  type :"config",
                  indices : this.engine.getPosition()

              });
          }else if( data.type === "ping-plugin"){
              // We have to check the controls in order to show the correct directions

              const pluginIds = Object.keys(pluginList);
              for (let i =0; i < pluginIds.length; i++){
                this.socket.emit('message', {
                  type :"plugin",
                  action :"activate",
                  id : pluginIds[i]
                });
              }
              // Delegate to plugins

          }else if( data.type === "communicate-plugin"){
              // We have to check the controls in order to show the correct directions
              if (data.id && pluginList[data.id] ){
                this.pluginList[data.id](data.data);
              }


          }
      });
};

function _engineCallBack(event){
  // If we're on client slides
  if (this.socket &&  event.data.notes !== undefined) {
    this.socket.emit('message', {type : 'notes', data : event.data});
  }
  // If we're on speaker slides
  if (this.socket){
      this.socket.emit("message", {
          type:'config',
          indices : this.engine.getPosition()
      });
  }
}

function _loadEngine(engineConf){
  const loader = new ScriptLoader();
  const path = _extractPath()+'plugins/'+(this.conf.devMode ? '.tmp/src/' : '');
  loader.add(`${path}/engines/${engineConf.name}-client-engine.js`, 'script');
  return loader.loaded();
}

// Init the correct Engine
function _initEngine(engineConf){
  return new Promise(( resolve, reject) => {
    switch(engineConf.name){
      case 'revealjs':
          this.engine = new RevealEngine();
          break;
    }

    if (this.engine){
      this.engine.initEngineListener(_engineCallBack.bind(this));
      resolve();
    }else{
      reject('Engine not initialize ! ');
    }
  });
};


class WebRemoteControl {

  constructor(){
    /*
    * **************************************
    * ---------------MODEL------------------
    * **************************************
    */
    this.conf = null;
    this.additionnalConfiguration = null;
    this.socket = null;
    this.ips = null;
    this.qrCode = null;
    this.pluginList = {};
    this.engine = null;


  }




  /*
  * **************************************
  * --------EXPOSED METHODS----------------
  * **************************************
  */

  registerPlugin(id, callbackAction){
    this.pluginList[id] = callbackAction;
  }


  // We init the client side (websocket + engine Listener)
  init(conf){
    // We check if this script ins't in the iframe of the remote control
    if(!window.parent || !window.parent.document.body.getAttribute('sws-remote-iframe-desactiv')){
        console.log('Initialize Client side');
        this.additionnalConfiguration = conf;
        _checkAdditionnalConfiguration.bind(this)()
        .then(_ => {
          return _initConfig.bind(this)();
        })
        .then(_ => {
          return _loadEngine.bind(this)(conf.engine);
        })
        .then(_ => {
          return _initEngine.bind(this)(conf.engine);
        })
        .then(_ => {
          return new Promise((resolve, reject) => {
            _initWS.bind(this)();
            resolve();
          });
        })
        .then(_ => {
          return _loadPlugins.bind(this)(conf.plugins);
        })
        .then(_ => {
          console.info('All is load ! ');
        })
        .catch((err) => {
          console.error('Error : %s \n %s', err.message, err.stack);
        });
    }
  }

};

export default new WebRemoteControl();
