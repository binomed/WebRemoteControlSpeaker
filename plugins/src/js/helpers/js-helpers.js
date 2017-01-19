'use strict'
import {ScriptLoader} from './script-loader.js';

/**
 * Equivalent of fetch
 */
export function _ajaxJSONGet(url){
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

/**
 * Extract the path of library based on paths
 */
export function _extractPath(){
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

/**
 *  Load all the additionnals javascript libraries needed (QrCode)
 */
export function _loadAdditionnalScripts(devMode){
  let path = _extractPath()+'plugins/'+(devMode ? 'src/' : '');
  let loader = new ScriptLoader();
  loader.add(path+'components/qrcode/qrcode.min.js', 'script');
  loader.add(path+'css/main.css', 'link');
  return loader.loaded();
}