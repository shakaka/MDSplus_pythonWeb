/* global window, Image, jQuery */
/**
 * @author 360Learning
 * @author Catalin Dogaru (https://github.com/cdog - http://code.tutsplus.com/tutorials/how-to-create-a-jquery-image-cropping-plugin-from-scratch-part-i--net-20994)
 * @author Adrien David-Sivelle (https://github.com/AdrienDS - Refactoring, Multiselections & Mobile compatibility)
 */
(function($) {
    $.imageArea = function(parent, id) {
        var options = parent.options,
            $image = parent.$image,
            $trigger = parent.$trigger,
            $outline,            
            $resizeHandlers = {},
            resizeHorizontally = true,
            resizeVertically = true,
            selectionOffset = [0, 0],
            selectionOrigin = [0, 0],
            area = {
                id: id,
                x: 0,
                y: 0,
                z: 0,
                height: 0,
                width: 0
            },
            
            focus = function () {
                
                area.z = 100;
                refresh();
            },
            getData = function () {
                return area;
            },
            fireEvent = function (event) {
                $image.trigger(event, [area.id, parent.areas()]);
            },
            cancelEvent = function (e) {
                var event = e || window.event || {};
                event.cancelBubble = true;
                event.returnValue = false;
                event.stopPropagation && event.stopPropagation(); // jshint ignore: line
                event.preventDefault && event.preventDefault(); // jshint ignore: line
            },
            off = function() {
                $.each(arguments, function (key, val) {
                    on(val);
                });
            },
            on = function (type, handler) {
                var browserEvent, mobileEvent;
                switch (type) {
                    case "start":
                        browserEvent = "mousedown";
                        mobileEvent = "touchstart";
                        break;
                    case "move":
                        browserEvent = "mousemove";
                        mobileEvent = "touchmove";
                        break;
                    case "stop":
                        browserEvent = "mouseup";
                        mobileEvent = "touchend";
                        break;
                    default:
                        return;
                }
                if (handler && jQuery.isFunction(handler)) {
                    $(window.document).on(browserEvent, handler).on(mobileEvent, handler);
                } else {
                    $(window.document).off(browserEvent).off(mobileEvent);
                }
            },
            updateSelection = function () {
                // Update the outline layer
                $outline.css({
                    cursor: "default",
                    width: area.width,
                    height: area.height,
                    left: area.x,
                    top: area.y,
                    "z-index": area.z
                });

                // Update the selection layer
                
            },
            
            
           
            refresh = function(sender) {
                switch (sender) {
                    case "startSelection":
                        parent._refresh();
                        updateSelection();
                         break;
                    
                    //case "releaseSelection":
                    default:
                        updateSelection();
                        
                        
                }
            },
            startSelection  = function (event) {
                cancelEvent(event);

                // Reset the selection size
                area.width = 10;
                area.height = 10;
                focus();
                on("move", resizeSelection);
                on("stop", releaseSelection);

                // Get the selection origin
                selectionOrigin = getMousePosition(event);
                if (selectionOrigin[0] + area.width > $image.width()) {
                    selectionOrigin[0] = $image.width() - area.width;
                }
                if (selectionOrigin[1] + area.height > $image.height()) {
                    selectionOrigin[1] = $image.height() - area.height;
                }
                // And set its position
                area.x = selectionOrigin[0];
                area.y = selectionOrigin[1];

                refresh("startSelection");
            },
            
            resizeSelection = function (event) {
                cancelEvent(event);
                focus();

                var mousePosition = getMousePosition(event);

                // Get the selection size
                var height = mousePosition[1] - selectionOrigin[1],
                    width = mousePosition[0] - selectionOrigin[0];

                
                // Test if the selection size exceeds the image minus the off bounds
                //if (selectionOrigin[0] + width < 0 ||selectionOrigin[0] + width > $image.width()) {
                  //  width = - width;
               // }
                
                //if (selectionOrigin[1] + height <0 || selectionOrigin[1] + height > $image.height()) {
                  //  height = - height;
                //}
              

                // Set the selection size
                if (resizeHorizontally) {
                    area.width = width;
                }
                if (resizeVertically) {
                    area.height = height;
                }
                
             
                if (area.width < 0) {
                    area.width = Math.abs(area.width);
                    area.x = selectionOrigin[0] - area.width;
                } else {
                    area.x = selectionOrigin[0];
                }
                
                if (area.height < 0) {
                    area.height = Math.abs(area.height);
                    area.y = selectionOrigin[1] - area.height;
                } else {
                    area.y = selectionOrigin[1];
                }

                fireEvent("changing");
                refresh("resizeSelection");
            },
            
            
            releaseSelection = function (event) {
                cancelEvent(event);
                off("move", "stop");

                // Update the selection origin
                selectionOrigin[0] = area.x;
                selectionOrigin[1] = area.y;

                // Reset the resize constraints
                resizeHorizontally = true;
                resizeVertically = true;

                fireEvent("changed");

                refresh("releaseSelection");
            },
            deleteSelection = function (event) {
                cancelEvent(event);
                
                $outline.remove();
                $.each($resizeHandlers, function(card, $handler) {
                    $handler.remove();
                });
                parent._remove(id);
                fireEvent("changed");
            },
            getElementOffset = function (object) {
                var offset = $(object).offset();

                return [offset.left, offset.top];
            },
            getMousePosition = function (event) {
                var imageOffset = getElementOffset($image);

                if (! event.pageX) {
                    if (event.originalEvent) {
                        event = event.originalEvent;
                    }

                    if(event.changedTouches) {
                        event = event.changedTouches[0];
                    }

                    if(event.touches) {
                        event = event.touches[0];
                    }
                }
                var x = event.pageX - imageOffset[0],
                    y = event.pageY - imageOffset[1];

                x = (x < options.off_img_x[0]) ? options.off_img_x[0] : (x > $image.width()-options.off_img_x[1]) ? $image.width()-options.off_img_x[1] : x;
                y = (y < options.off_img_y[0]) ? options.off_img_y[0] : (y > $image.height()-options.off_img_y[1]) ? $image.height()-options.off_img_y[1] : y;

                return [x, y];
            };


        // Initialize an outline layer and place it above the trigger layer
        $outline = $("<div class=\"select-areas-outline\" />")
            .css({
                opacity : 1,
                position : "absolute"
            })
            .insertAfter($trigger);

        // Initialize a selection layer and place it above the outline layer
        

        // Initialize all handlers
        
        focus();

        return {
            getData: getData,
            startSelection: startSelection,
            deleteSelection: deleteSelection,
            options: options,
            
            focus: focus,
           
            set: function (dimensions, silent) {
                area = $.extend(area, dimensions);
                selectionOrigin[0] = area.x;
                selectionOrigin[1] = area.y;
                if (! silent) {
                    fireEvent("changed");
                }
            },
            contains: function (point) {
                return (point.x >= area.x) && (point.x <= area.x + area.width) &&
                       (point.y >= area.y) && (point.y <= area.y + area.height);
            }
        };
    };


    $.imageSelectAreas = function() { };

    $.imageSelectAreas.prototype.init = function (object, customOptions) {
        var that = this,
            defaultOptions = {
                allowSelect: true,
                off_img_x: [0, 0],
                off_img_y: [0, 0],
                width: 0,
                areas: [],
                onChanging: null,
                onChanged: null
            };

        this.options = $.extend(defaultOptions, customOptions);


        this._areas = {};

        // Initialize the image layer
        this.$image = $(object);

        this.ratio = 1;
        if (this.options.width && this.$image.width() && this.options.width !== this.$image.width()) {
            this.ratio = this.options.width / this.$image.width();
            this.$image.width(this.options.width);
        }

        if (this.options.onChanging) {
            this.$image.on("changing", this.options.onChanging);
        }
        if (this.options.onChanged) {
            this.$image.on("changed", this.options.onChanged);
        }
        if (this.options.onLoaded) {
            this.$image.on("loaded", this.options.onLoaded);
        }

        // Initialize an image holder
        this.$holder = $("<div />")
            .css({
                position : "relative",
                width: this.$image.width(),
                height: this.$image.height()
            });

        // Wrap the holder around the image
        this.$image.wrap(this.$holder)
            .css({
                position : "absolute"
            });

        // Initialize an overlay layer and place it above the image
        this.$overlay = $("<div class=\"select-areas-overlay\" />")
            .css({
                opacity : 1,
                position : "absolute",
                top: this.options.off_img_y[0], 
                left: this.options.off_img_x[0],
                width: this.$image.width()-this.options.off_img_x[0]-this.options.off_img_x[1],
                height: this.$image.height()-this.options.off_img_y[0]-this.options.off_img_y[1],
            })
            .insertAfter(this.$image);

        // Initialize a trigger layer and place it above the overlay layer
        this.$trigger = $("<div class=\"trigger-layer\" />")
            .css({
                backgroundColor : "#000000",
                opacity : 0,
                position : "absolute",
                top: this.options.off_img_y[0], 
                left: this.options.off_img_x[0],
                width: this.$image.width()-this.options.off_img_x[0]-this.options.off_img_x[1],
                height: this.$image.height()-this.options.off_img_y[0]-this.options.off_img_y[1],
                
           })
            .insertAfter(this.$overlay);

        $.each(this.options.areas, function (key, area) {
            that._add(area, true);
        });


        this._refresh();

        if (this.options.allowSelect) {
            // Bind an event handler to the "mousedown" event of the trigger layer
            this.$trigger.mousedown($.proxy(this.newArea, this)).on("touchstart", $.proxy(this.newArea, this));
        }
        
    };

    $.imageSelectAreas.prototype._refresh = function () {
        var nbAreas = this.areas().length;
        this.$overlay.css({
            display : nbAreas? "block" : "none"
        });
        
        this.$trigger.css({
            cursor : this.options.allowSelect ? "crosshair" : "default"
        });
    };

    $.imageSelectAreas.prototype._eachArea = function (cb) {
        $.each(this._areas, function (id, area) {
            if (area) {
                return cb(area, id);
            }
        });
    };

    

    $.imageSelectAreas.prototype.newArea = function (event) {
        var id = -1;
        
        this._eachArea(function (area, index) {
            id = Math.max(id, parseInt(index, 10));
        });
        id += 1;

        this._areas[id] = $.imageArea(this, id);
        if (event) {
            this._areas[id].startSelection(event);
        }
        return id;
    };
    $.imageSelectAreas.prototype._remove = function (id) {
        delete this._areas[id];
        this._refresh();
    };
    $.imageSelectAreas.prototype.remove = function (id) {
        if (this._areas[id]) {
            this._areas[id].deleteSelection();
        }
    };
   
    
    $.imageSelectAreas.prototype.areas = function () {
        var ret = [];
        this._eachArea(function (area) {
            ret.push(area.getData());
        });
        return ret;
    };
    
    $.imageSelectAreas.prototype.reset = function () {
        var that = this;
        this._eachArea(function (area, id) {
            that.remove(id);
        });
        this._refresh();
    };

    $.imageSelectAreas.prototype.destroy = function () {
        this.reset();
        this.$holder.remove();
        this.$overlay.remove();
        this.$trigger.remove();
        this.$image.css("width", "").css("position", "").unwrap();
        this.$image.removeData("mainImageSelectAreas");
    };

    


    $.selectAreas = function(object, options) {
        var $object = $(object);
        if (! $object.data("mainImageSelectAreas")) {
            var mainImageSelectAreas = new $.imageSelectAreas();
            mainImageSelectAreas.init(object, options);
            $object.data("mainImageSelectAreas", mainImageSelectAreas);
            $object.trigger("loaded");
        }
        return $object.data("mainImageSelectAreas");
    };


    $.fn.selectAreas = function(customOptions) {
        if ( $.imageSelectAreas.prototype[customOptions] ) { // Method call
            var ret = $.imageSelectAreas.prototype[ customOptions ].apply( $.selectAreas(this), Array.prototype.slice.call( arguments, 1 ));
            return typeof ret === "undefined" ? this : ret;

        } else if ( typeof customOptions === "object" || ! customOptions ) { // Initialization
            //Iterate over each object
            this.each(function() {
                var currentObject = this,
                    image = new Image();

                // And attach selectAreas when the object is loaded
                image.onload = function() {
                    $.selectAreas(currentObject, customOptions);
                };

                // Reset the src because cached images don"t fire load sometimes
                image.src = currentObject.src;

            });
            return this;

        } else {
            $.error( "Method " +  customOptions + " does not exist on jQuery.selectAreas" );
        }
    };
}) (jQuery);
