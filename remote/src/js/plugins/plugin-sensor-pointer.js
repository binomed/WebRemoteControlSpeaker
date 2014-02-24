/*
* Remote pointer plugin
*/
plugins.directive('spPlugin', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    restrict: 'A',
    priority : 103,
    scope: false,    
    link: function postLink($scope, iElement, iAttrs) { 

      $scope.register({
        name : 'sensor pointer',
        icon : 'fa-compass',
        id : 'sp'
      });

      // y = 0 xLeft =  315 xCenter = 280 xRight =  245
      // y = 50 xLeft =  320 xCenter = 255 xRight =  215

      // y = 0 xLeft = 99 xCenter = 70 xRight =  40
      // y = 50 xLeft =  115 xCenter = 77 xRight =  30

      // We have to adjust the limits of the remote
      var xLeftBottom = 99;
      var xLeftTop = 115;
      var xRightBottom = 40;
      var xRightTop = 30;
      var deltaXBottom = xLeftBottom - xRightBottom;
      var deltaXTop = xLeftTop - xRightTop;

      // TODO : We Have to persit on localstorage the callibration for the phone

      var previewElement = iElement.find('#preview');
      var notesElement = null;
      var areaPointer = null;
      var currentColor = 'red';
      var lastTarget = null;
      var initialX = -1;
      var initialY = -1;
      var initialYPercent = -1;
      var maxY = 50;
      var deltaX = 40;
      var deltaY = 30;

      function motionFeedback(event){
        var x = event.accelerationIncludingGravity.x; //inclinaison of phone (right / left)
        var y = event.accelerationIncludingGravity.y; // inclinaison of phone (top / bottom)
        var z = event.accelerationIncludingGravity.z; 

        x = (x < 0 ? Math.max(-3, x) : Math.min(3,x)) +3;
        y = Math.max(0, Math.min(7, y));

        if (initialX === -1 || Math.abs(initialX - x) < 10){
          initialX = x;
        }

        // We have to inverse due to acceleration negativ
        var percentX = 100 - Math.round((initialX / 6) * 100);
        var percentY = 100 - Math.round((y / 7) * 100);

        $scope.pluginCommunication('sp', {
            hide : false,
            x : percentX,
            y : percentY,
            color : currentColor
        });


      }

       function orientationFeedback(event){
        // We don't allow the pointer if the smartphone is directed to the bottom
        if (
          (initialX === -1 || !initialX) 
          && (event.beta < 0 || event.beta > maxY)
            ){
          return;
        }

        if (initialX === -1 || !initialX){
          initialX = event.alpha;
          initialY = event.beta;
          // We calculate the position of smartphone use as reference in Y;
          initialY = Math.max(0, Math.min(maxY, initialY));
          initialYPercent = 100 - Math.round((initialY / maxY) * 100);
          initialYPercent = initialYPercent === 0 ? 1 : initialYPercent;
        }
        var y = event.beta; // inclinaison of phone (top / bottom)        

        //x = (x < 0 ? Math.max(-3, x) : Math.min(3,x)) +3;
        y = Math.max(0, Math.min(maxY, y));   
        // We calculate the percent of Y to evaluate the X
        var percentY = 100 - Math.round((y / maxY) * 100);

        var deltaXTmp = deltaXBottom + (deltaXTop - deltaXBottom) * (y / maxY);
        var xRef = (initialX * percentY) / initialYPercent;
        var x = xRef - event.alpha; //inclinaison of phone (right / left)
        var maxX = deltaXTmp / 2; //10 + ((25 - 10) * (y / maxY));
    
        x = (x < 0 ? Math.max(-maxX, x) : Math.min(maxX,x)) +maxX;
        var percentX = Math.round((x / (maxX*2)) * 100);

        $scope.pluginCommunication('sp', {
            hide : false,
            x : Math.round(percentX),
            y : Math.round(percentY),
            color : currentColor
        });



      }

      function boxClicked(event){
        if (event.target.id === 'sws-sp-box-close'){
          window.removeEventListener('deviceorientation', orientationFeedback, false);
          areaPointer.style.display = 'none';
          notesElement.css('top','');
          notesElement.css('zIndex','');
          $scope.model.showControls = true;
        }else{
          currentColor = event.target.getAttribute('sws-color');
          lastTarget.classList.remove('activ');
          event.target.classList.add('activ');
          lastTarget = event.target;
        }
        console.log(event);
      }


      $scope.spClick = function(){
        if (!window.DeviceOrientationEvent){
          alert('Device Motion not available');
          return;
        }

        if (!areaPointer){
          notesElement = iElement.find('#notes');

          areaPointer = document.createElement('DIV');
          areaPointer.style.position = 'absolute';
          areaPointer.style.width = previewElement.width()+'px';
          areaPointer.style.height = previewElement.height()+'px';
          areaPointer.style.top = previewElement.position().top+'px';
          areaPointer.style.left = previewElement.position().left+'px';
          areaPointer.style['margin'] = previewElement.css('margin');
          areaPointer.style['background-color'] = 'rgba(0,0,0,0)';
          //areaPointer.style.border = 'solid red 5px';

          iElement.find('#main-content')[0].appendChild(areaPointer);

          // We add color div to change the color of pointer
          function addBox(id, color, icon, left){
            var boxDiv = document.createElement('DIV');
            boxDiv.setAttribute('id', 'sws-sp-box-'+id);
            boxDiv.setAttribute('sws-color', color);
            boxDiv.classList.add('sws-plugin-sp-box');
            boxDiv.style.left = left;
            if (icon){              
              boxDiv.classList.add('fa');
              boxDiv.classList.add(icon);
            }else{
              boxDiv.classList.add('color');              
              boxDiv.classList.add(id);              
            }
            return boxDiv;
          }

          lastTarget = addBox('red', '#FF0000', null,'0');
          lastTarget.classList.add('activ');
          areaPointer.appendChild(lastTarget);
          areaPointer.appendChild(addBox('white', '#FFFFFF', null,'20%'));
          areaPointer.appendChild(addBox('black', '#000000', null,'40%'));
          areaPointer.appendChild(addBox('blue', '#005FFF', null,'60%'));
          areaPointer.appendChild(addBox('close', 'black', 'fa-times','calc(100% - 30px)'));

          iElement.find('#sws-sp-box-red').bind('click', boxClicked);
          iElement.find('#sws-sp-box-white').bind('click', boxClicked);
          iElement.find('#sws-sp-box-black').bind('click', boxClicked);
          iElement.find('#sws-sp-box-blue').bind('click', boxClicked);
          iElement.find('#sws-sp-box-close').bind('click', boxClicked);
        }
        
        $scope.model.showControls = false;
        areaPointer.style.display = '';
        notesElement.css('top', (notesElement.position().top - 70)+'px');
        notesElement.css('zIndex',-100);
        
        initialX = -1;
        window.removeEventListener('deviceorientation', orientationFeedback, false);
        window.addEventListener('deviceorientation', orientationFeedback, false);

      }


       /*
        **************************************
        **************************************
        * Style Sheet Management
        **************************************
        **************************************
        */
        var pluginStyleSheet = (function() {
          // Create the <style> tag
          var style = document.createElement("style");

          // Add a media (and/or media query) here if you'd like!
          style.setAttribute("media", "screen");
          style.setAttribute("id", "style-sheet-sws-remote");

          // WebKit hack :(
          style.appendChild(document.createTextNode(""));

          // Add the <style> element to the page
          document.head.appendChild(style);

          return style.sheet ? style.sheet : style.styleSheet;
        })();

        function cssProp(properties){
          return Modernizr.prefixed(properties).replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
        }

        var size = 40;      
        pluginStyleSheet.insertRule('.sws-plugin-sp-box {'+
          'position : absolute;'+
          'width : '+size+'px;'+
          'height : '+size+'px;'+
          'top : -'+(size+20)+'px;'+
          'text-align : center;'+
          'font-size : 25px;'+
          'line-height : '+size+'px;'+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.fa {'+
          'background-color : #7F89A5;'+
          'color : white;'+          
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.color {'+
          cssProp('boxShadow')+' : 0px 0px 10px 0 black; '+
          'border-radius : '+size+'px; '+
          'border : solid 1px white; '+
        '}',0);

         pluginStyleSheet.insertRule('.sws-plugin-sp-box.color.activ::after {'+
          'content : \'\'; '+
          'position : absolute; '+
          'top : '+(size+5)+'px; '+
          'left : 5px; '+
          'width : '+(size-10)+'px; '+
          'height : 5px; '+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.color.red::after, .sws-plugin-sp-box.color.red {'+
          'background-color : #FF0000; '+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.color.white::after, .sws-plugin-sp-box.color.white {'+
          'background-color : #FFFFFF; '+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.color.black::after, .sws-plugin-sp-box.color.black {'+
          'background-color : #000000; '+
        '}',0);

        pluginStyleSheet.insertRule('.sws-plugin-sp-box.color.blue::after, .sws-plugin-sp-box.color.blue {'+
          'background-color : #005FFF; '+
        '}',0);


    }
  };
  return directiveDefinitionObject;
}]);