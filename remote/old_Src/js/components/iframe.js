/*
* IFRAME Directive
*/
'use strict';

components.directive('iframeControl', ['$rootScope', '$timeout'
  ,function ($rootScope, $timeout ) {

    
   var presentationIFrame = null;

   // Function to manipulate the presentation
   var engineIFrameAction = function(action, scope){
      if (action === 'next'){
        presentationIFrame.next();
      }else if (action === 'prev'){
        presentationIFrame.prev();          
      }else if (action === 'up'){
        presentationIFrame.up();          
      }else if (action === 'down'){
        presentationIFrame.down();          
      }else if (action === 'left'){
        presentationIFrame.left();          
      }else if (action === 'right'){
        presentationIFrame.right();          
      }else if (action === 'reset'){
        presentationIFrame.slide( 0, 0, -1 );          
      }else if (action === 'show'){
        presentationIFrame.slide( scope.model.indices.h, scope.model.indices.v, scope.model.indices.f ? scope.model.indices.f : 0 );          
      }
   }

   // Directive definition
   var directiveDefinitionObject = {
    restrict: 'A',
    require: '^sws',
    priority : 950,
    scope: false,    
    controller: ['$scope', function($scope){

      // Add a method for sharing action to directives
      this.engineAction = function(action){
        engineIFrameAction(action,$scope);      
      }
    }],
    link: function postLink(scope, iElement, iAttrs, swsControl) { 

      // We share the possibility to navigate in the main directive (just the method)
      swsControl.registerControl(engineIFrameAction);

      var iframe = iElement.find('iframe')[0];

      $rootScope.$on('loadIframeEvt', function(evt, url){
        iframe.src = url;
      });  

      // We specify in localstorage that we are in a remote control context
      document.body.setAttribute('sws-remote-iframe-desactiv', true);

      // Scope method

      var updateControls = function(){
        var controls = iframe.contentDocument.querySelector('.controls');
        var upControl = true,
            downControl = true,
            leftControl = true,
            rightControl = true;                
        if (controls){
            controls.style.display = "none";
            upControl = controls.querySelector("div.navigate-up.enabled") ? false : true;
            downControl = controls.querySelector("div.navigate-down.enabled") ? false : true;
            leftControl = controls.querySelector("div.navigate-left.enabled") ? false : true;
            rightControl = controls.querySelector("div.navigate-right.enabled") ? false : true;
        }
        scope.ui.controls = {
            reset : false,
            show : false,
            up : upControl,
            down : downControl,
            left : leftControl,
            right : rightControl,
            next :  scope.model.indices.h+scope.model.indices.v+1 > scope.model.nbSlides,
            prev : scope.model.indices.h+scope.model.indices.v <= 0
        };

      }

      // Directive Methods

      var onIFrameLoad = function(){
        console.log('IFrame load ! ');
        // TODO : make it generic
        presentationIFrame = iframe.contentWindow.Reveal;
        // Configuration of presentation to hide controls
        presentationIFrame.initialize({
            controls: true,
            transition : 'default',
            transitionSpeed : 'fast',
            history : false,
            slideNumber: false,
            keyboard: false,
            touch: false,
            embedded : true
        });
        
        // We listen to reaveal events in order to ajust the screen
        presentationIFrame.addEventListener( 'slidechanged', revealChangeListener);
        presentationIFrame.addEventListener( 'fragmentshown', revealFragementShowListener);
        presentationIFrame.addEventListener( 'fragmenthidden', revealFragementHiddeListener);
        
        updateControls();
        scope.ui.iframeLoad = true;

      }

      // We delay the update of model 
      var revealChangeListener = function(event){
         $timeout(function(){          
            scope.model.indices = presentationIFrame.getIndices();
            scope.model.nextSlideNumber = scope.model.mapPosition[scope.model.indices.h+'-'+scope.model.indices.v];
            
            updateControls();
          }, 500);    
      }


      var revealFragementShowListener = function(event){
        scope.model.indices = presentationIFrame.getIndices();
      }


      var revealFragementHiddeListener = function(event){
        scope.model.indices = presentationIFrame.getIndices();
      }

      iframe.onload = onIFrameLoad;
      
    }
  };
  return directiveDefinitionObject;
}]);