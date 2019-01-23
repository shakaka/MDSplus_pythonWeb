/*-------------------------------------------------------------------------------------------------
  This plugin is based on the GAPJUMPER line example http://www.gapjumper.com/research/lines.html.
  Special thanks to its author!
  Author: Tiago do Bem 
  Date: March 2013
  URL: https://github.com/tbem/jquery.line
  The jQuery.line.js plugin is distributed under the GNU General Public License version 3 (GPLv3).
  -------------------------------------------------------------------------------------------------
*/ 

jQuery(function($) {

  var helpers = {
    createLine: function(x1, y1, y2, options){
      
                  // Check if browser is Internet Exploder ;)
                  
                  
                  var vline = document.createElement("div");
                  vline.className = "vline";
                                   
                  var length = Math.abs(y1-y2);

                  vline.style.width = length + "px";
                  vline.style.borderBottom = options.stroke + "px " + options.style;
                  vline.style.borderColor = options.color;
                  vline.style.position = "absolute";
                  vline.style.zIndex = options.zindex;
                    vline.style.top = y1 + 0.5*length + "px";
                    vline.style.left = x1 - 0.5*length + "px";
                    vline.style.transform = vline.style.MozTransform = vline.style.WebkitTransform = vline.style.OTransform= "rotate(" + Math.PI/2 + "rad)";
                  
                  return vline;
                }
  }
  

  $.fn.vline = function( x1, y1, y2, options, callbacks) {
                return $(this).each(function(){
                  if($.isFunction(options)){
                      callback = options;
                      options = null;
                  }else{
                    callback = callbacks;
                  }
                  options = $.extend({}, $.fn.vline.defaults, options);

                  $(this).append(helpers.createLine(x1,y1,y2,options)).promise().done(function(){
                    if($.isFunction(callback)){
                      callback.call();
                    }
                  });

                
              });
  };
  $.fn.vline.defaults = {  zindex : 10000,
                          color : '#000000',
                          stroke: "1",
                          style: "solid",
                        };
});

