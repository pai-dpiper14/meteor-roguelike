// user creation
Accounts.onCreateUser(function(options, user) {
  var entity_id = Entity.insert({
    type: "player",
    position: random_empty_position(),
    display: options.profile.name[0],
    display_color: "rgb(0,0,255)",
    display_photourl:
      "http://graph.facebook.com/" + user.services.facebook.id + "/picture",
    name: options.profile.name,
    score: 0
  });

  user.profile = options.profile;
  user.profile.entity_id = entity_id;
  return user;
});

// movement
Entity.allow({
  update: function(userId, old_entity, fieldNames, mods) {
    var changable_fieldnames = ['position'];
    if (_.difference(fieldNames, changable_fieldnames).length) {
      return false;  //we don't let you change this field from client
    }

    var new_entity = EJSON.clone(old_entity);
    LocalCollection._modify(new_entity, mods);
    if (_.contains(fieldNames, 'position')) {
      return new_entity.position.x >= 0
          && new_entity.position.y >= 0
          && new_entity.position.x < BOARDSIZE.x
          && new_entity.position.y < BOARDSIZE.y;
    }
    return true;
  }
});
