(function( $ ){

    $.fn.pan = function(options) {

        //Container is element this plugin is applied to;
        //we're pan it's child element, content
        var container = this;
        var content = this.children(':first');

        //Precalculate the limits of panning - offset stores
        //the current amount of pan throughout
        var offset = {
            'x': Number(content.css('left').replace('px', '')),
            'y': Number(content.css('top').replace('px', ''))
        };
        var containerSize = {
            'width': container.width(), 
            'height': container.height()
        };
        var contentSize = {
            'width': content.width(), 
            'height': content.height()
        };
        var minOffset = {
            'x': -contentSize.width + containerSize.width,
            'y': -contentSize.height + containerSize.height
        }
        var maxOffset = {
            'x': 0,
            'y': 0
        };

        var settings = $.extend( {
            'auto'                  : true,
            'autoHorizontalSpeed'   : 1,
            'autoVerticalSpeed'     : 1,
            'mouseSpeed'            : 2,
            'mouseBorder'           : Math.min(containerSize.width, containerSize.height) * 0.25,
            'updateInterval'        : 100
        }, options);

        //Mouse state variables, set by bound mouse events below
        var mouseOver = false;
        var mousePosition = {
            'x': 0,
            'y': 0
        };
        
        //Delay in ms between updating position of content
        var updateInterval = settings.updateInterval;

        var onInterval = function() {
            
            //User's mouse being over the element stops autoPanning
            if(mouseOver) {
                
                //If we're in the interaction zones to either
                //end of the element, pan in response to the
                //mouse position.
                if(mousePosition.x < settings.mouseBorder) {
                    offset.x += settings.mouseSpeed;
                }
                if (mousePosition.x > containerSize.width - settings.mouseBorder) {
                    offset.x -= settings.mouseSpeed;
                }
                if(mousePosition.y < settings.mouseBorder) {
                    offset.y += settings.mouseSpeed;
                }
                if (mousePosition.y > containerSize.height - settings.mouseBorder) {
                    offset.y -= settings.mouseSpeed;
                }
            } else if(settings.auto) {
                //Mouse isn't over - just pan normally
                offset.x += settings.autoHorizontalSpeed;
                offset.y += settings.autoVerticalSpeed;
            }

            //If the previous updates have take the content
            //outside the allowed min/max, bring it back in
            constrainToBounds();
            
            //If we're panning automatically, make sure we're
            //panning in the right direction if the content has
            //moved as far as it can go
            if(settings.auto) {
                if(offset.x == minOffset.x) settings.autoHorizontalSpeed = Math.abs(settings.autoHorizontalSpeed);
                if(offset.x == maxOffset.x) settings.autoHorizontalSpeed = -Math.abs(settings.autoHorizontalSpeed);
                if(offset.y == minOffset.y) settings.autoVerticalSpeed = Math.abs(settings.autoVerticalSpeed);
                if(offset.y == maxOffset.y) settings.autoVerticalSpeed = -Math.abs(settings.autoVerticalSpeed);
            }

            //Finally, update the position of the content
            //with our carefully calculated value
            content.css('left', offset.x + "px");
            content.css('top', offset.y + "px");
        }

        var constrainToBounds = function() {
            if(offset.x < minOffset.x) offset.x = minOffset.x;
            if(offset.x > maxOffset.x) offset.x = maxOffset.x;
            if(offset.y < minOffset.y) offset.y = minOffset.y;
            if(offset.y > maxOffset.y) offset.y = maxOffset.y;
        }

        this.bind('mousemove', function(evt) {
            mousePosition.x = evt.pageX - container.offset().left;
            mousePosition.y = evt.pageY - container.offset().top;
            mouseOver = true;
        });

        this.bind('mouseout', function(evt) {
            mouseOver = false;
        });

        //Kick off the main panning loop and return
        //this to maintain jquery chainability
        setInterval(onInterval, updateInterval);
        return this;
    };

})( jQuery );