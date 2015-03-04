/*
* Controls directive
*/
'use strict';

components.directive('controls', ['$timeout'
  ,function ($timeout ) {
   var directiveDefinitionObject = {
    templateUrl: 'partials/components/controls.html',
    replace: true,
    require: '^iframeControl',
    priority : 901,
    restrict: 'E',
    scope: true,    
    link: function postLink(scope, iElement, iAttrs, iframeCtrl) { 

    
      scope.classShow = '';
      scope.classBack = '';
      scope.showBack = true;
      var indices = null;

      scope.$watch('model.indices', function(){
        scope.classShow = '';
        scope.classBack = scope.classBack.indexOf('visible') != -1 ? 'visible' : '';
        $timeout(function() {
          scope.classShow = 'hide';
          scope.classBack += ' hide';
        }, 500);
      });
      
      scope.leftClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          reset();
          iframeCtrl.engineAction('left');
        }
      }
      
      scope.rightClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          reset();
          iframeCtrl.engineAction('right');
        }
      }
      
      scope.upClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          reset();
          iframeCtrl.engineAction('up');
        }
      }
      
      scope.downClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          reset();
          iframeCtrl.engineAction('down');
        }
      }
      
      scope.showClick = function($event){
        if (!$event.target.hasAttribute('disabled')) {
          scope.classShow = '';
          scope.classBack = '';
          indices = null;
          scope.sendMessage({
              type : 'operation', 
              data : 'show', 
              index: scope.model.indices
          });
          iframeCtrl.engineAction('next');
        }
      }

      scope.back = function(){
        scope.classBack = '';
        scope.model.indices.h = indices.h;
        scope.model.indices.v = indices.v;
        scope.model.indices.f = indices.f;
        iframeCtrl.engineAction('show');
      }

      function reset(){
        scope.classShow = '';
        scope.classBack = 'visible';
        if (indices == null){
          indices = {
            h : scope.model.indices.h, 
            v : scope.model.indices.v,
            f : scope.model.indices.f
          };
         }
      }


      // We add a managment of gesture in order to control the engine presentation
      $(iElement[0]).hammer().on('release', function(event){
        if (event.gesture && event.gesture.direction && event.gesture.distance > 1){
          event.gesture.preventDefault();
          reset();
          if (event.gesture.direction === 'left' && !scope.ui.controls.right){
            iframeCtrl.engineAction('right');
          }else if (event.gesture.direction === 'right' && !scope.ui.controls.left){
            iframeCtrl.engineAction('left');
          }else if (event.gesture.direction === 'up' && !scope.ui.controls.down){
            iframeCtrl.engineAction('down');
          }else if (event.gesture.direction === 'down' && !scope.ui.controls.up){
            iframeCtrl.engineAction('up');
          }

        }
      });

     
    }
  };
  return directiveDefinitionObject;
}]);