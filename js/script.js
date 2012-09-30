
	
	$(function() {


    var MiguelJimeno = Backbone.View.extend({

      el: document,

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


        // Slider 
        this.$el.find('#gallery').nivoSlider({
          pauseTime: 5000
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