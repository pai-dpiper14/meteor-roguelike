var KEYS_TO_XY_CHANGE = {
  37: {'position.x':-1, 'position.y': 0}, // left
  39: {'position.x': 1, 'position.y': 0}, // right
  38: {'position.x': 0, 'position.y': -1}, // up
  40: {'position.x': 0, 'position.y': 1}, // down
};

$(document).keydown(function(e) {
  e.preventDefault();
  change = KEYS_TO_XY_CHANGE[e.keyCode] || {};
  Entity.update({_id: Meteor.user().profile.entity_id},
    {$inc: change}
  );
});

Template.world_grid.helpers({
  eachRow: function() {
    return _.range(BOARDSIZE.y).map(function(y) {
      return {y: y};
    });
  },
  eachCell: function() {
    var coords = this;
    return _.range(BOARDSIZE.x).map(function(x) {
      var cell_coords = _.clone(coords);
      cell_coords.x = x;
      return cell_coords;
    });
  }
})

Template.cell.helpers({
  cell_contents: function() {
    var entity = Entity.findOne({position: {x: this.x, y: this.y}});
    return entity || {display: "_"};
  },
  get_body: function() {
    if (this.display_photourl) {
      return "<img class='fb_profilephoto' src='"+this.display_photourl+"'></img>";
    } else {
      return this.display;
    }
  },
  get_color: function() {
    if (Meteor.user() && Meteor.user().profile.entity_id == this._id) {
      return "rgb(0,255,0)";  // you are green
    }

    return this.display_color || "rgb(0,0,0)";  // default color is black
  }
});

Template.scoreboard.helpers({
  players_by_score: function() {
    return Entity.find({score: {$exists: true, $gt: 0}}, {sort: [['score', 'desc']]}).fetch()
  }
});
