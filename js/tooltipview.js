
  var Tooltip = Backbone.View.extend({

    options: {
      text: 'This is a tooltip though!',
      hideIn: 300,
      hideOut: 300
    },

    initialize: function() {
      _.bindAll(this, "show", "hide");
      this.options.target.hover(this.show, this.hide);
    },

    render: function() {
      var $content = $("<div>").addClass("tooltip");
      $content.append("<div class='t'><p>" + this.options.text + "</p></div>");
      $content.append("<div class='b'></div>");

      var w = this.options.target.outerWidth()
        , pos = this.options.target.offset()
        , l = pos.left + (w/2) + 1;

      $content.css({
        left: l
      });

      this.$el = $content

      return $content;
    },

    show: function(ev) {
      var $el = $(ev.target)
        , t = $el.offset().top
        , h = this.$el.outerHeight()
        , top = t - h;

      this.$el.css({
        top: top,
        opacity: 0,
        display: 'block'
      });

      if ($.browser.msie && $.browser.version < 8) {
        this.$el.show();
      } else {
        this.$el.css({
          marginTop:10,
          opacity:0
        });

        this.$el.stop(true).animate({
          opacity: 1,
          marginTop: 0
        }, 250);
      }
    },

    hide: function(ev) {
      if ($.browser.msie && $.browser.version < 8) {
        this.$el.hide();
      } else {
        var self = this;

        this.$el.animate({
          opacity: 0,
          marginTop: -10
        }, 250, function() {
          self.hide();
        });
      }
    }
  });