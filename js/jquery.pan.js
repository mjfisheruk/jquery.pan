(function( $ ){
    $.fn.pan = function(options) {

        var settings = $.extend( {
            'speed'           : 1,
            'updateInterval'  : 100
        }, options);

        //Container is element this plugin is applied to;
        //we're pan it's child element, content
        var container = this;
        var content = this.children(':first');

        //Precalculate the limits of panning - offset stores
        //the current amount of pan throughout
        var offset = Number(content.css('left').replace('px', ''));
        var containerSize = container.width();
        var contentSize = content.width();
        var minOffset = -contentSize + containerSize;
        var maxOffset = 0;

        //Determines whether we pan without mouse interaction
        var autoPan = true;
        var autoPanSpeed = settings.speed;
        
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
                if(mousePosition.x < 50) {
                    offset += 2;
                } else if (mousePosition.x > containerSize - 50) {
                    offset -= 2;
                }
            } else if(autoPan) {
                //Mouse isn't over - just pan normally
                offset += autoPanSpeed;
            }

            //If the previous updates have take the content
            //outside the allowed min/max, bring it back in
            constrainToBounds();
            
            //If we're panning automatically, make sure we're
            //panning in the right direction if the content has
            //moved as far as it can go
            if(autoPan) {
                if(offset == minOffset) autoPanSpeed = Math.abs(autoPanSpeed);
                if(offset == maxOffset) autoPanSpeed = -Math.abs(autoPanSpeed);
            }

            //Finally, update the position of the content
            //with our carefully calculated value
            content.css('left', offset + "px");
        }

        var constrainToBounds = function() {
            if(offset < minOffset) offset = minOffset;
            if(offset > maxOffset) offset = maxOffset;
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