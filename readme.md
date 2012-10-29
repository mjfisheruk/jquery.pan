Readme
======

jQuery.pan is a jQuery plugin that packages up commonly used mouse-based panning behaviours. Whilst being quite configurable, it aims to have sensible default options to get things up and running quickly.

Minimal Example
---------------

A minimal example is shown below. The container holds the content to be panned. The call to _$('#container').pan()_ tells jQuery.pan to put the first child element of the container under pan control. Currently, a position of absolute or relative must be set on both the container and the content to obtain expected behaviour. Of course, the container must have at least one dimension smaller than the content in order to see panning behaviour.

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

* Kinetic panning (the default). Clicking and dragging on content moves it around. If you release the mouse button whilst the cursor is still moving, content will move along with its own velocity before coming to rest - [live example.](http://htmlpreview.github.com/?https://github.com/mjfisheruk/jquery.pan/blob/master/examples/kinetic.html)
* Edge panning. Moving your cursor near to the borders of a content's container will cause the content to pan in that direction - [live example.](http://htmlpreview.github.com/?https://github.com/mjfisheruk/jquery.pan/blob/master/examples/edge.html)
* Proportional panning. Moving the mouse over content will cause it to immediately pan to a point based on the relative position of the cursor - [live example.](http://htmlpreview.github.com/?https://github.com/mjfisheruk/jquery.pan/blob/master/examples/proportional.html)

These can be switched by setting the _mouseControl_ option to either 'edge', 'proportional' or 'kinetic':
	
	$('#container').pan({
		mouseControl: 'proportional'
	});