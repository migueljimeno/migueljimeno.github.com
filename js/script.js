
	
	$(function() {


    var MiguelJimeno = Backbone.View.extend({

      el: document,

      options: {
        alcorcon: {
          place: new google.maps.LatLng(40.33323080843243, -3.837350606918335),
          address: "C/Mediterráneo, 2. Portal 4, 2º A. Alcorcón"
        },
        mataelpino: {
          place: new google.maps.LatLng(40.7365348, -3.9453771),
          address: "C/Pocillo 20, Mataelpino, El Boalo"
        },
        center: {
          place: new google.maps.LatLng(40.554,-3.7133),
          zoom: 9
        },
        map_options: {
          zoom: 16,
          center: new google.maps.LatLng(40.3491158, -3.8288109),
          mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'migueljimeno']},
          streetViewControl: false,
          disableDefaultUI: true
        },
        base_map: [{featureType: "all",elementType: "all",stylers: [{ saturation: -100 }]},{featureType: "all",elementType: "all",stylers: []}],
        fleky_markerImage: new google.maps.MarkerImage('../img/marker-1.png',new google.maps.Size(30,30),new google.maps.Point(0,0),new google.maps.Point(15, 15)),
        user_markerImage: new google.maps.MarkerImage('../img/marker-2.png',new google.maps.Size(23, 32),new google.maps.Point(0,0),new google.maps.Point(12, 32))
      },

      events: {
        "click header > nav > a":  "_goAnchor"
      },

      initialize: function() {
        _.bindAll(this,"_onErrorGeolocation");

        this._initSlider();
        this._initMap();
        this._geolocateUser();
      },

      render: function() {},



      _initSlider: function() {
        this.$el.find('#gallery').nivoSlider();
      },



      _initMap: function() {
        // Create map
        var map = this.map = new google.maps.Map(this.$el.find("#map")[0], this.options.map_options);
        
        // Set base map tiles
        var styledMapOptions = {name: "migueljimeno"}
          , myMapType = new google.maps.StyledMapType(this.options.base_map, styledMapOptions);

        map.mapTypes.set('migueljimeno', myMapType);
        map.setMapTypeId('migueljimeno');

        // Init directions service
        this.directionsService = new google.maps.DirectionsService();

        // Add both clinics to the map
        var alcorcon_marker = new google.maps.Marker({position: this.options.alcorcon.place, map:map, title:this.options.alcorcon.address,icon:this.options.fleky_markerImage})
        , mataelpino_marker = new google.maps.Marker({position: this.options.mataelpino.place, map:map, title:this.options.mataelpino.address,icon:this.options.fleky_markerImage});
      },


      _geolocateUser: function() {
        if (navigator.geolocation) {
          var self = this;
          navigator.geolocation.getCurrentPosition(
            function(position){

              var user_pos = self.user_position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                , alcorcon_dist = self.options.alcorcon.dist = parseFloat(self.distHaversine(user_pos,self.options.alcorcon.place))
                , mataelpino_dist = self.options.mataelpino.dist = parseFloat(self.distHaversine(user_pos,self.options.mataelpino.place));

              // Add new user marker
              var user_marker = new google.maps.Marker({position:user_pos, map:self.map, title:"Esta es tu posición", icon:self.options.user_markerImage})

              if (alcorcon_dist < mataelpino_dist) {
                self._showRoad(user_pos, self.options.alcorcon, true);
                self._showRoad(user_pos, self.options.mataelpino, false);
              } else {
                self._showRoad(user_pos, self.options.mataelpino, true);
                self._showRoad(user_pos, self.options.alcorcon, false);                
              }
            },
            self._onErrorGeolocation,
            {enableHighAccuracy:true}
          );
        } else {
          this._onErrorGeolocation();
        }
      },


      _onErrorGeolocation: function(e) {
        this.map.setCenter(this.options.center.place);
        this.map.setZoom(this.options.center.zoom);

        this.$el.find('div.info p').html('No hemos podido geolocalizar tu posición, en cualquier caso, ya sabes que puedes visitarnos en:</br></br>' + 
          this.options.alcorcon.address + "<br/><span style='display:inline-block;margin:5px 0'>ó</span><br/>" + this.options.mataelpino.address);
        this.$el.find('div.info').fadeIn();
      },


      _showRoad: function(user, clinic, active) {
        if (active) {
          var bounds = new google.maps.LatLngBounds()
          bounds.extend(user);
          bounds.extend(clinic.place);
          this.map.fitBounds(bounds);
        }

        if (clinic.dist<0.05) {
          this.map.setCenter(clinic.place);
        } else if (clinic.dist>=0.05 && clinic.dist<0.5) {
          this._createRoute(user,clinic.place,active,"walking");
        } else if (clinic.dist>=0.5 && clinic.dist<800) {
          this._createRoute(user,clinic.place,active,"driving");
        }

        if (active) {
          this.$el.find('div.info p').html('La clínica que más cerca tienes está a ' + clinic.dist.toFixed(1) + 'km, y la puedes encontrar en: </br></br>' + clinic.address + ".");
        } else {
          this.$el.find('div.info p').append('</br></br>Sino también nos tienes a ' + clinic.dist.toFixed(1) + 'km en: </br></br>' + clinic.address + ".");
        }


        if (clinic.dist>=800) {
          var hours = Math.ceil(distance/700);

          var geodesic_line = [clinic.place,user];
          var geodesic_path = new google.maps.Polyline({
            path: geodesic_line,
            strokeColor: '#090909',
            strokeOpacity: (active) ? 1 : 0.7,
            strokeWeight: 7.0,
            geodesic: true,
            map: this.map
          });

          if (active)
            this.$el.find('div.info p').html('Ops! Al parecer estás un poco lejos de nosotros, ' +hours+((hours==1)?' hora':' horas')+ ' en avión'+
              '</br></br>Si decides venir a Madrid puedes visitarnos en:</br></br>' + this.options.alcorcon.address +
              "<br/><span style='display:inline-block;margin:5px 0'>ó</span><br/>" + this.options.mataelpino.address);
        }

        this.$el.find('div.info').fadeIn();
      },


      _createRoute: function(origin,end,active,kind) {
        var request = {origin:origin, destination:end, travelMode: (kind=="driving")? google.maps.DirectionsTravelMode.DRIVING : google.maps.DirectionsTravelMode.WALKING}
          , self = this;

        this.directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            var steps = response.routes[0].legs[0].steps;             
            self._createPolyline(steps, active);
            self.map.panBy(70,0);
          }
        });
      },


      _createPolyline: function(steps,active) {
        var path = Array();
        for(var step = 0; step < steps.length; step++){
          for(var stepP = 0; stepP < steps[step].path.length; stepP++){
            path.push(steps[step].path[stepP]);
          }
        }
        var polyline_options = {'strokeWeight':'5', 'strokeColor':'#0099CC', 'strokeOpacity':(active) ? '0.85' : '0.25'} ;
        var polyline = new google.maps.Polyline(polyline_options);
        polyline.setPath(path);
        polyline.setMap(this.map);
      },


      _goAnchor: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        var block = $(ev.target).attr("href")
          , pos   = this.$el.find(block).offset().top;
        
        this.$el.find("body").animate({
          scrollTop: pos
        },350);
      },



      /*
       * HELPER FUNCTIONS
       */

      distHaversine: function(p1, p2) {
        var R = 6371; // earth's mean radius in km
        var dLat  = this.rad(p2.lat() - p1.lat());
        var dLong = this.rad(p2.lng() - p1.lng());

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;

        return d.toFixed(3);
      },

      rad: function(x) {
        return x*Math.PI/180;
      }

    });


    Window.migueljimeno = new MiguelJimeno();
	});