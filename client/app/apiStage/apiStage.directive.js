'use strict';

var h = new Object();

function drawPath(svg, path, startX, startY, endX, endY, flip) {


  // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
  var stroke =  parseFloat(path.css("stroke-width"));
  // check if the svg is big enough to draw the path, if not, set heigh/width
  if (svg.attr("height") <  endY)                 svg.attr("height", endY);
  if (svg.attr("width" ) < (startX + stroke) )    svg.attr("width", (startX + stroke));
  if (svg.attr("width" ) < (endX   + stroke) )    svg.attr("width", (endX   + stroke));

  var deltaX = (endX - startX) * 0.15;
  var deltaY = (endY - startY) * 0.15;
  // for further calculations which ever is the shortest distance
  var delta  =  deltaY < Math.abs(deltaX) ? deltaY : Math.abs(deltaX);

  // set sweep-flag (counter/clock-wise)
  // if start element is closer to the left edge,
  // draw the first arc counter-clockwise, and the second one clock-wise
  var arc1 = 0; var arc2 = 1;
  if (startX > endX) {
      arc1 = 1;
      arc2 = 0;
  }
  // draw tha pipe-like path
  // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end
  path.attr("d",  "M"  + startX + " " + startY +
                  " V" + (startY + delta) +
                  " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*Math.sign(deltaX)) + " " + (startY + 2*delta) +
                  " H" + (endX - delta*Math.sign(deltaX)) +
                  " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
                  " V" + endY );

}

function connectElements(svg, path, startElem, endElem) {
  var svgContainer= $("#svgContainer");

  // if first element is lower than the second, swap!
  if (startElem.offset().top > endElem.offset().top){
      var temp = startElem;
      startElem = endElem;
      endElem = temp;
      h[path.attr("id")] = true;
      // path.attr("direction", true);

      // console.log(true);
      // console.log(path.attr("direction"));
  } else {
      h[path.attr("id")] = false;
      // path.attr("direction", false);
      // console.log(path.attr("direction"));
  }

  // get (top, left) corner coordinates of the svg container
  var svgTop  = svgContainer.offset().top;
  var svgLeft = svgContainer.offset().left;

  // get (top, left) coordinates for the two elements
  var startCoord = startElem.offset();
  var endCoord   = endElem.offset();

  // calculate path's start (x,y)  coords
  // we want the x coordinate to visually result in the element's mid point
  var startX = startCoord.left + 0.5*startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
  var startY = startCoord.top  + startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset

      // calculate path's end (x,y) coords
  var endX = endCoord.left + 0.5*endElem.outerWidth() - svgLeft;
  var endY = endCoord.top  - svgTop;

  // call function for drawing the path

  for (var k in h) {
    console.log('key is: ' + k + ', value is: ' + eval('h.' + k));
  }

  drawPath(svg, path, startX, startY, endX, endY+(startElem.outerHeight()/2));

    var divs = document.querySelectorAll('path');

  [].forEach.call(divs, function(path) {
    // do whatever
    var length = path.getTotalLength();
    // Clear any previous transition
    path.style.transition = path.style.WebkitTransition =
      'none';
    // Set up the starting positions
    path.style.strokeDasharray = length + ' ' + length;
    console.log("!" + path.getAttribute("id") + " " + eval('h.' + path.getAttribute("id")));
    if (eval('h.' + path.getAttribute("id")) === true) {
          path.style.strokeDashoffset = -length;
    } else {
          path.style.strokeDashoffset = length;
    }

    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    path.getBoundingClientRect();
    // Define our transition
    path.style.transition = path.style.WebkitTransition =
    'stroke-dashoffset 1s ease-in-out';
    // Go!
    path.style.strokeDashoffset = '0';
  });

}


angular.module('hackDisruptApp')
  .directive('apiStage', function ($timeout, $rootScope, Definitions) {
    return {
      templateUrl: 'app/apiStage/apiStage.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        let drawPaths = () => {
          scope.configuration.handles.forEach((entry, idx) => {
            if (idx+1 !== scope.configuration.handles.length) {
              connectElements(element.find('#paths'), element.find(`#path${idx}`), element.find(`#apiEntry${idx}`), element.find(`#apiEntry${idx+1}`))
            }
          });
          connectElements(element.find('#paths'), element.find(`#pathOrigin`), angular.element('#endPointName'), element.find('#apiEntry0'));
        }

        $timeout(() => {
          drawPaths();
        }, 100);

        scope.$watch(() => scope.configuration, () => {
          $timeout(() => { drawPaths() }, 100);
        });

        scope.$watch(() => scope.configuration.handles, () => {
          $timeout(() => { drawPaths() }, 100);
        });

        $rootScope.$on('api-entry-moving', drawPaths)
      }
    };
  });