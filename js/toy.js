
  var Toy = Backbone.View.extend({
    
    positions: [
      {x: -40, y: -28},
      {x: -5, y: -65},
      {x: -16, y: -18},
      {x: -5, y: -65},
      {x: -26, y: -80}
    ],

    initialize: function() {
      _.bindAll(this, 'update');

      this._animate(this.options.start);
    },

    update: function(index) {
      this._animate(index);
    },

    _animate: function(index) {
      var position = this.positions[index];

      this.$el.animate({
        opacity:1,
        left: position.x,
        top: position.y,
        marginTop:"10px"
      },600);
    }
  });