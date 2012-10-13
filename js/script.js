
	
	$(function() {


    var MiguelJimeno = Backbone.View.extend({

      el: document,

      options: {
        time: 5000,
        start: 0
      },

      events: {
        "click header > nav > a":  "_goAnchor"
      },

      initialize: function() {
        this._initWidgets();
      },

      render: function() {},


      _initWidgets: function() {
        // Tooltips
        // - Away
        var away_tooltip = new Tooltip({
          text: this.$el.find(".tooltip.away").attr("data-tooltip"),
          target: this.$el.find(".tooltip.away")
        });
        this.$("body").append(away_tooltip.render());

        // - Second session (followed)
        var second_tooltip = new Tooltip({
          text: this.$el.find(".tooltip.second").attr("data-tooltip"),
          target: this.$el.find(".tooltip.second")
        });
        this.$("body").append(second_tooltip.render());

        // Toy
        var toy = this.toy = new Toy({
          el: this.$('#toy'),
          time: this.options.time,
          start: this.options.start
        });

        // Slider
        var $nivo = this.$el.find('#gallery').nivoSlider({
          pauseTime: this.options.time,
          randomStart: true,
          startSlide: this.options.start,
          beforeChange: function(){
            var currentSlide = $nivo.data('nivo:vars').currentSlide 
              , nextSlide = (currentSlide > 3 ) ? currentSlide = 0 : currentSlide + 1;

            toy.update(nextSlide);
          }
        });

        // Map
        var map = new Map({
          el: this.$el.find("#map"),
          textBox: this.$el.find("section#place")
        })
      },


      _goAnchor: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        var block = $(ev.target).attr("href")
          , pos   = this.$el.find(block).offset().top;
        
        this.$el.find("body").animate({
          scrollTop: pos
        },350);
      }

    });


    window.migueljimeno = new MiguelJimeno();
	});