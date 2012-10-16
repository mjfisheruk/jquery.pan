(function( $ ){

    var getSize = function($element) {
        return {
            'width': $element.width(), 
            'height': $element.height()
        };
    };

    var toCoords = function(x, y) {
        return {'x': x, 'y': y};
    };

    var vectorsEqual = function(v1, v2) {
        return v1.x == v2.x && v1.y == v2.y;
    }

    $.fn.pan = function(options) {

        //Container is element this plugin is applied to;
        //we're pan it's child element, content
        var container = this;
        var content = this.children(':first');

        //Precalculate the limits of panning - offset stores
        //the current amount of pan throughout
        var offset = toCoords(
            Number(content.css('left').replace('px', '')),
            Number(content.css('top').replace('px', ''))
        );
        
        var containerSize = getSize(container);
        var contentSize = getSize(content);

        var minOffset = toCoords(
            -contentSize.width + containerSize.width,
            -contentSize.height + containerSize.height
        );

        var maxOffset = toCoords(0, 0);

        //By default, assume mouse sensitivity border
        //is 25% of the smallest dimension
        var defaultMouseBorder = 0.25 * Math.min(
            containerSize.width,
            containerSize.height
        );

        var settings = $.extend( {
            'autoSpeedX'            : 0,
            'autoSpeedY'            : 0,
            'mouseControl'          : 'scroll',
            'mouseSpeed'            : 5,
            'mouseBorder'           : defaultMouseBorder,
            'updateInterval'        : 50,
            'mousePan'              : null
        }, options);

        //Mouse state variables, set by bound mouse events below
        var mouseOver = false;
        var mousePanningDirection = toCoords(0, 0);
        var mousePosition = toCoords(0, 0);

        var dragging = false;
        var lastMousePosition = null;
        var kineticVelocity = toCoords(0, 0);
        var kineticDamping = 0.8;

        //Delay in ms between updating position of content
        var updateInterval = settings.updateInterval;

        var onInterval = function() {
            
            //User's mouse being over the element stops autoPanning
            if(mouseOver) {
                var mouseControlHandlers = {
                    'scroll'        : updateScroll,
                    'proportional'  : updateProportional,
                    'kinetic'       : updateKinetic
                };
                mouseControlHandlers[settings.mouseControl]();
            } else {
                //Mouse isn't over - just pan normally
                offset.x += settings.autoSpeedX;
                offset.y += settings.autoSpeedY;
            }

            //If the previous updates have take the content
            //outside the allowed min/max, bring it back in
            constrainToBounds();
            
            //If we're panning automatically, make sure we're
            //panning in the right direction if the content has
            //moved as far as it can go
            if(offset.x == minOffset.x) settings.autoSpeedX = Math.abs(settings.autoSpeedX);
            if(offset.x == maxOffset.x) settings.autoSpeedX = -Math.abs(settings.autoSpeedX);
            if(offset.y == minOffset.y) settings.autoSpeedY = Math.abs(settings.autoSpeedY);
            if(offset.y == maxOffset.y) settings.autoSpeedY = -Math.abs(settings.autoSpeedY);

            //Finally, update the position of the content
            //with our carefully calculated value
            content.css('left', offset.x + "px");
            content.css('top', offset.y + "px");
        }

        var updateScroll = function() {
            //The user's possibly maybe mouse-navigating,
            //so we'll find out what direction in case we need
            //to handle any callbacks
            var newDirection = toCoords(0, 0);
            
            //If we're in the interaction zones to either
            //end of the element, pan in response to the
            //mouse position.
            if(mousePosition.x < settings.mouseBorder) {
                offset.x += settings.mouseSpeed;
                newDirection.x = -1;
            }
            if (mousePosition.x > containerSize.width - settings.mouseBorder) {
                offset.x -= settings.mouseSpeed;
                newDirection.x = 1;
            }
            if(mousePosition.y < settings.mouseBorder) {
                offset.y += settings.mouseSpeed;
                newDirection.y = -1;
            }
            if (mousePosition.y > containerSize.height - settings.mouseBorder) {
                offset.y -= settings.mouseSpeed;
                newDirection.y = 1;
            }

            updateMouseDirection(newDirection);
        }

        var updateProportional = function() {
            var rx = mousePosition.x / containerSize.width;
            var ry = mousePosition.y / containerSize.height;
            offset = toCoords(
                (minOffset.x - maxOffset.x) * rx + maxOffset.x,
                (minOffset.y - maxOffset.y) * ry + maxOffset.y
            );
        }

        var updateKinetic = function() {
            if(dragging) {
                if(lastMousePosition == null) {
                    lastMousePosition = toCoords(mousePosition.x, mousePosition.y);    
                }

                kineticVelocity = toCoords(
                    mousePosition.x - lastMousePosition.x,
                    mousePosition.y - lastMousePosition.y
                );

            }

            offset.x += kineticVelocity.x;
            offset.y += kineticVelocity.y;

            kineticVelocity = toCoords(
                kineticVelocity.x * kineticDamping,
                kineticVelocity.y * kineticDamping
            );

            lastMousePosition = toCoords(mousePosition.x, mousePosition.y);
        }

        var constrainToBounds = function() {
            if(offset.x < minOffset.x) offset.x = minOffset.x;
            if(offset.x > maxOffset.x) offset.x = maxOffset.x;
            if(offset.y < minOffset.y) offset.y = minOffset.y;
            if(offset.y > maxOffset.y) offset.y = maxOffset.y;
        }

        var updateMouseDirection = function(newDirection) {
            if(!vectorsEqual(newDirection, mousePanningDirection)) {
                mousePanningDirection = newDirection;
                if(settings.mousePan) {
                   settings.mousePan(mousePanningDirection);
                }
            }   
        }

        this.bind('mousemove', function(evt) {
            mousePosition.x = evt.pageX - container.offset().left;
            mousePosition.y = evt.pageY - container.offset().top;
            mouseOver = true;
        });

        this.bind('mouseout', function(evt) {
            mouseOver = false;
            dragging = false;
            updateMouseDirection(toCoords(0, 0));
        });

        this.bind('mousedown', function(evt) {
            if(!dragging) {
                dragStartPosition = toCoords(mousePosition.x, mousePosition.y);
                dragStartOffset = toCoords(offset.x, offset.y);
            }
            dragging = true;
            return false;
        });

        this.bind('mouseup', function(evt) {
            dragging = false;
        });

        //Kick off the main panning loop and return
        //this to maintain jquery chainability
        setInterval(onInterval, updateInterval);
        return this;
    };

})( jQuery );