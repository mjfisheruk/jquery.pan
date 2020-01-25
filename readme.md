Readme
======

jQuery.pan is a jQuery plugin that packages up commonly used mouse-based panning behaviours. Whilst being quite configurable, it aims to have sensible default options to get things up and running quickly.

Minimal Example
---------------

A minimal example is shown below. The container holds the content to be panned. The call to $('#container').pan() tells jQuery.pan to put the first child element of the container under pan control. Currently, a position of absolute or relative must be set on both the container and the content to obtain expected behaviour. Of course, the container must have at least one dimension smaller than the content in order to see panning behaviour.

	<html>
	    <head>
	        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	        <script type="text/javascript" src="https://raw.github.com/mjfisheruk/jquery.pan/master/js/jquery.pan.js"></script>
	        <style type="text/css">
	            #container {
	                position: relative;
	                width: 250px;
	                height: 250px;
	                overflow: hidden;
	            }            
	            #content {
	                position: absolute;
	                width: 500px;
	                height: 500px;
	                background-image: url('https://raw.github.com/mjfisheruk/jquery.pan/master/img/tshirt.jpg');
	            }
	        </style>
	    </head>
	    <body>
	        <div id="container">
	            <div id="content"></div>
	        </div>
	        <script type="text/javascript">
	            $('#container').pan();
	        </script>
	    </body>
	</html>

Panning Modes
-------------

jQuery.pan currently supports three different panning modes:

* Kinetic panning (the default). Clicking and dragging on content moves it around. If you release the mouse button whilst the cursor is still moving, content will move along with its own velocity before coming to rest - [live example](http://htmlpreview.github.com/?https://github.com/mjfisheruk/jquery.pan/blob/master/examples/kinetic.html)
* Edge panning. Moving your cursor near to the borders of a content's container will cause the content to pan in that direction - [live example](http://htmlpreview.github.com/?https://github.com/mjfisheruk/jquery.pan/blob/master/examples/edge.html)
* Proportional panning. Moving the mouse over content will cause it to immediately pan to a point based on the relative position of the cursor - [live example](http://htmlpreview.github.com/?https://github.com/mjfisheruk/jquery.pan/blob/master/examples/proportional.html)

These can be switched by setting the _mouseControl_ option to either 'edge', 'proportional' or 'kinetic':
	
	$('#container').pan({
		mouseControl: 'proportional'
	});

In addition, you can make content pan automatically by setting the autoSpeedX and autoSpeedY options for the horizontal and vertical axis respectively:

	$('#container').pan({
		autoSpeedX: 1,
		autoSpeedY: 2
	});

In this example, the content will pan back and forth along the vertical axis at twice the rate of the horizontal axis.

Options
-------

Options relating to the kinetic panning mode:

	$('#container').pan({
        'mouseControl'    : 'kinetic', //Enable kinetic panning (default)
    
        'kineticDamping'  : 0.8        //Lower numbers will cause the content to come to
        							   //a halt quicker. At zero, content will come to a
        							   //stop immediately after the mouse is release. At
        							   //one, content will not slow until it reaches an edge.
        							   //Numbers lower than zero or higher than one produce
        							   //undefined (but fun) behaviour.
    });

Options relating to edge panning:

	$('#container').pan({
        'mouseControl'    : 'edge',   //Enable edge panning

        'mouseEdgeSpeed'  : 5,        //The speed the content moves when the user
                                      //moves the mouse to the edge of the container
        
        'mouseEdgeWidth'  : 100       //The width in pixels of the mouse sensitive border
                                      //inside the container.	Defaults to a quarter of the
                                      //smallest container dimension.			
    });

The proportional panning mode has no specific options.

	$('#container').pan({
        'mouseControl'           : 'proportional',  //Enable proportional panning
    
        'proportionalSmoothing'  : 0.8              //Controls the level of smoothing on the
                                                    //panning movement - takes a value between
                                                    //zero and one. Values closer to one will
                                                    //result in a smoother movement that will
                                                    //take longer to reach its destination. A
                                                    //value of zero results in an instant pan.
    });

General options that effect all panning modes:

	$('#container').pan({
		'autoSpeedX'      : 0,        //The speed at which the content will pan along the horizontal
		'autoSpeedY'      : 0,        //and vertical axis respectively when no user interaction
		                              //is occuring. Both options default to zero
        
        'updateInterval'  : 50        //The interval (in milliseconds) between updates. Defaults
                                      //to 50, which will yield a rough framerate of 20fps. Note
                                      //that where speeds are specified they are given in pixels
                                      //moved per update, so they are *not* currently framerate
                                      //independent
    });

Flags
-----

Flags my be added as CSS classes to the container element

* `pan-off`: adding this class to the container element will disable any panning behaviour. Removing it will begin the panning again.

