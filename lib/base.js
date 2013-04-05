Entity = new Meteor.Collection("entity");

BOARDSIZE = {x: 40, y: 20};

// intentionally global
random_empty_position = function() {
  var guess = {
    x: Math.floor(Math.random() * BOARDSIZE.x),
    y: Math.floor(Math.random() * BOARDSIZE.y)
  };

  if (!Entity.findOne({position: guess})) {
    return guess;
  } else {
    return random_empty_position();  // try again
  }
}
