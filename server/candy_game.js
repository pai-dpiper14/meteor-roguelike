var CANDY_DURATION_MS = 4000, CANDY_REWARD = 2, timeout_id = 0, observer;

Meteor.startup(function(){
  new_candy_location();
});

var new_candy_location = function() {
  // out with the old
  Meteor.clearTimeout(timeout_id);
  timeout_id = Meteor.setTimeout(new_candy_location, CANDY_DURATION_MS);
  Entity.remove({type: 'candy'});
  if (observer) {
    observer.stop();  // stop listening for players arriving at old candy
  }

  // in with the new
  var candy_position = random_empty_position();
  Entity.insert({
    type: 'candy',
    position: candy_position,
    display: '%', // arbitrary
    display_color: 'rgb(255,0,0)'
  });

  var players_at_candy = Entity.find({
    score: {$exists: true},
    position: candy_position
  });

  observer = players_at_candy.observe({
    added: function(point_winner) {
      Entity.update({_id: point_winner._id},
        {$inc: {score: CANDY_REWARD}});
      new_candy_location();
    }
  });
};
