/**************************************************************************
* MAP PLUGIN
**************************************************************************/
(function($, window, undefined) {

	// constants
	var TRUE = true, FALSE = true, NULL = null
		, name = 'languagesMap'
		// Plugin parts
		, Core, API, Helper
		// default options
		, defaultOptions = {
				globalEvents : [],
				map_options : {
					zoom: 1,
					center: new google.maps.LatLng(43,-3),
					disableDefaultUI: true,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}
		};

				
	/***************************************************************************
	* Private methods
	**************************************************************************/
	Core = {
		pluginName : name,
		options : null,


		_init : function (options) {
			// take user options in consideration
			Core.options = $.extend( true, defaultOptions, options );
			return this.each( function () {
				var $el = $(this);
				
				// Append necessary html
				Core._initMap($el);

				// Bind events
				Core._bind($el);
			});
		},
 

		_bind: function($el) {
			$el.find('a.control').bind({'click': Core._toggle});
			$el.find('input').bind({'change': Core._changeColor, 'click': Core._stopPropagation});
			$el.find('span.palette ul li a').bind({'click': Core._chooseColor});
		},


		_trigger : function ( eventName, data, $el ) {
			var isGlobal = $.inArray( eventName, Core.options.globalEvents ) >= 0, eventName = eventName + '.' +  Core.pluginName;

			if (!isGlobal) {
				$el.trigger( eventName, data );
			} else {
				$.event.trigger( eventName, data );
			}
		},


		// PRIVATE LOGIC
		_stopPropagation: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
		},

		_initMap: function($el) {
			var map = new google.maps.Map(document.getElementById($el.attr('id')),Core.options.map_options);
			$el.data('map',map);

			// Move logo a little bit
			setTimeout(function(){
					$el.find('a[title="Click to see this area on Google Maps"]').css({display:'none'});
			},1000);

			// Set style
			map.setOptions({styles:[ { stylers: [ { saturation: -65 }, { gamma: 1.52 } ] }, { featureType: "administrative",
			stylers: [ { saturation: -95 },{ gamma: 2.26 } ] }, { featureType: "water", elementType: "labels",
			 stylers: [ { visibility: "off" } ] }, { featureType: "administrative.locality", stylers: [ { visibility: 'off' } ] },
			 { featureType: "road", stylers: [ { visibility: "simplified" }, { saturation: -99 }, { gamma: 2.22 } ] },
			 { featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] },
			 { featureType: "road.arterial", stylers: [ { visibility: 'off' } ] },
			 { featureType: "road.local", elementType: "labels", stylers: [ { visibility: 'off' } ] },
			 { featureType: "transit", stylers: [ { visibility: 'off' } ] },
			 { featureType: "road", elementType: "labels", stylers: [ { visibility: 'off' } ] },
			 { featureType: "poi", stylers: [ { saturation: -55 } ] } ]});

			Core._addPoints(map);
		},

		_addPoints: function(map) {
				
			var bounds = new google.maps.LatLngBounds()
				, image = new google.maps.MarkerImage('/assets/img/map/marker.png',
									new google.maps.Size(16,16),
									new google.maps.Point(0,0),
									new google.maps.Point(8,8));

			for (var i = 0, length = Core.options.points.length; i<length; i++) {
				var point = Core.options.points[i]
					, latlng = new google.maps.LatLng(point.latitude, point.longitude);

				// Marker
				var marker = new google.maps.Marker({
					map: map,
					position: latlng,
					icon: image
				});

				// Add a Circle overlay
				var circle = new google.maps.Circle({
					map: map,
					radius: point.radius, // 3000 km
					strokeColor: "#0F61B3",
					strokeOpacity: 1,
					strokeWeight: 1,
					fillColor: "#0F61B3",
					fillOpacity: 0.20
				});

				circle.bindTo('center', marker, 'position');

				bounds.extend(latlng);
			}

			map.fitBounds(bounds);
			//hack
			setTimeout(function() {
				if(map.getZoom() > 5) {
					map.setZoom(5);
				}
			}, 300);
		}
	};



	/***************************************************************************
	 * Plugin installation
	**************************************************************************/
	$.fn[name] = function (userInput) {
		// check if such method exists
		if ( $.type( userInput ) === "string" && API[ userInput ] ) {
			return API[ userInput ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		}
		// initialise otherwise
		else if ( $.type( userInput ) === "object" || !userInput ) {
			return Core._init.apply( this, arguments );
		} else {
			$.error( 'You cannot invoke ' + name + ' jQuery plugin with the arguments: ' + userInput );
		}
	};
})( jQuery, window );


/**************************************************************************
* ANCHOR PLUGIN
**************************************************************************/
(function($, window, undefined) {

  // constants
  var TRUE = true, FALSE = true, NULL = null
    , name = 'anchorLink'
    // Plugin parts
    , Core, API, Helper
    // default options
    , defaultOptions = {
        globalEvents : [],
        speed: 500 // ms
    };

        
  /***************************************************************************
  * Private methods
  **************************************************************************/
  Core = {
    pluginName : name,
    options : null,


    _init : function (options) {
      // take user options in consideration
      Core.options = $.extend( true, defaultOptions, options );
      return this.each( function () {
        var $el = $(this);

        // Bind events
        Core._bind($el);
      });
    },
 

    _bind: function($el) {
      $el.find('a').bind({'click': Core._goTo});
    },


    _trigger : function ( eventName, data, $el ) {
      var isGlobal = $.inArray( eventName, Core.options.globalEvents ) >= 0, eventName = eventName + '.' +  Core.pluginName;

      if (!isGlobal) {
        $el.trigger( eventName, data );
      } else {
        $.event.trigger( eventName, data );
      }
    },


    // PRIVATE LOGIC
    _stopPropagation: function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
    },

    _goTo: function(ev) {
      Core._stopPropagation(ev);
      var div = $(ev.target).attr("href").slice(1);
      $("body,html").scrollTo(div)
    }
  };



  /***************************************************************************
   * Plugin installation
  **************************************************************************/
  $.fn[name] = function (userInput) {
    // check if such method exists
    if ( $.type( userInput ) === "string" && API[ userInput ] ) {
      return API[ userInput ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
    }
    // initialise otherwise
    else if ( $.type( userInput ) === "object" || !userInput ) {
      return Core._init.apply( this, arguments );
    } else {
      $.error( 'You cannot invoke ' + name + ' jQuery plugin with the arguments: ' + userInput );
    }
  };
})( jQuery, window );