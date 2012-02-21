    





    function initMap() {
      fleky = new google.maps.LatLng(40.33323080843243, -3.837350606918335);
      you_image = new google.maps.MarkerImage('../img/marker-2.png',new google.maps.Size(23, 32),new google.maps.Point(0,0),new google.maps.Point(12, 32));
      fleky_image = new google.maps.MarkerImage('../img/marker-1.png',new google.maps.Size(30,30),new google.maps.Point(0,0),new google.maps.Point(15, 15));
      
      directionsService = new google.maps.DirectionsService();
      var map_style = [{featureType: "all",elementType: "all",stylers: [{ saturation: -100 }]},{featureType: "all",elementType: "all",stylers: []}];
      
      var mapOptions = {
        zoom: 16,
      	center: new google.maps.LatLng(40.3491158, -3.8288109),
      	mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'migueljimeno']},
      	streetViewControl: false,
      	disableDefaultUI: true
      };

    	map = new google.maps.Map(document.getElementById("map"),mapOptions);
    	var styledMapOptions = {name: "migueljimeno"}
    	var myMapType = new google.maps.StyledMapType(map_style, styledMapOptions);
    	map.mapTypes.set('migueljimeno', myMapType);
    	map.setMapTypeId('migueljimeno');
    	 
    	 
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        function(position){
          showRoad(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        },onErrorGeolocation(),{enableHighAccuracy:true});
      } else {
       	onErrorGeolocation();
      }	
    }
    
    
    function onErrorGeolocation() {
  		var marker = new google.maps.Marker({position: fleky,map:map,title:"¡Esta es nuestra clínica!",icon:fleky_image});
  		map.setCenter(fleky);
  		map.setZoom(14);
  		map.panBy(70,0);
      $('div.info p').html('No hemos podido geolocalizar tu posición, en cualquier caso, ya sabes que puedes'+
			' visitarme en:</br></br>C/Mediterráneo, 2. Portal 4, 2º A. Alcorcón.');
			$('div.info').fadeIn();
    }
    
    
    
    function showRoad(initialLocation) {
    	var bounds = new google.maps.LatLngBounds();
    	bounds.extend(initialLocation);
    	bounds.extend(fleky);

    	var distance = distHaversine(initialLocation,fleky);

    	if (distance<0.05) {
        var marker = new google.maps.Marker({position: fleky,map: map,title:"¡Esta es mi clínica!",icon:fleky_image});
    		map.setCenter(fleky);
    	} else if (distance>=0.05 && distance<0.5) {
    		calcRoute(initialLocation,"walking");
    	} else if (distance>=0.5 && distance<800) {
    		calcRoute(initialLocation,"driving");
    	} else if (distance>=800) {
    		var distance = distHaversine(initialLocation,vizzuality);
    		var hours = Math.ceil(distance/700);
    		var marker = new google.maps.Marker({position: fleky,map:map,title:"¡Esta es mi clínica!",icon:fleky_image});
    		var marker = new google.maps.Marker({position: initialLocation, map: map, title:"¿Aquí estas tú?!",icon:you_image});
    		var geodesic_line = [fleky,initialLocation];
    	  var geodesic_path = new google.maps.Polyline({
    	    path: geodesic_line,
    	    strokeColor: '#090909',
    	    strokeOpacity: 0.7,
    	    strokeWeight: 7.0,
    			geodesic: true,
    			map: map
    	  });
    		$('div.info p').html('Ops! Al parecer estás un poco lejos de la clínica, ' +hours+((hours==1)?' hora':' horas')+ ' en avión'+
				'</br></br>Si decides venir a Madrid puedes visitarme en C/Mediterráneo, 2. Portal 4, 2º A. Alcorcón.');
				$('div.info').fadeIn();
    	}
    	map.fitBounds(bounds);
    }
    	
    	
    	
    	function calcRoute(origin,kind) {
    	  var start = origin;
    	  var end = fleky;

    	  var request = {origin:origin, destination:end,travelMode: (kind=="driving")? google.maps.DirectionsTravelMode.DRIVING : google.maps.DirectionsTravelMode.WALKING};
    	  directionsService.route(request, function(response, status) {
    	    if (status == google.maps.DirectionsStatus.OK) {
      			var marker = new google.maps.Marker({position: end,map:map,title:"¡Esta es mi clínica!",icon:fleky_image});
      			var marker = new google.maps.Marker({position: start, map: map, title:"¿Aquí estas tú?!",icon:you_image});
    				var steps = response.routes[0].legs[0].steps;             
    				createColorPoly(steps);
    				map.panBy(70,0);     
    				$('div.info p').html('Al parecer estás sólo a <strong>' + response.routes[0].legs[0].duration.text.replace('mins','minutos').replace('hours','horas') + '</strong> ' + kind.replace('walking','andando').replace('driving','conduciendo') +
    				' de la clínica, ¡acércate!.</br></br>Si decides visitarnos ven a C/Mediterráneo, 2. Portal 4, 2º A. Alcorcón.');
    				$('div.info').fadeIn();
    			}
    	  });
      }


    	function createColorPoly(steps){    
  	    var path = Array();
        for(var step = 0; step < steps.length; step++){
            for(var stepP = 0; stepP < steps[step].path.length; stepP++){
                 path.push(steps[step].path[stepP]);
            }
     	  }
  	    var poly_options = {'strokeWeight':'5','strokeColor':'#0099CC'} ;
  	    var newPoly = new google.maps.Polyline(poly_options);
  	    newPoly.setPath(path);
  	    newPoly.setMap(map);
      }
    	
    	rad = function(x) {return x*Math.PI/180;}

    	distHaversine = function(p1, p2) {
    	  var R = 6371; // earth's mean radius in km
    	  var dLat  = rad(p2.lat() - p1.lat());
    	  var dLong = rad(p2.lng() - p1.lng());

    	  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
    	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    	  var d = R * c;

    	  return d.toFixed(3);
    	}