Meteor.methods({
  getNext(text) {
    // Make sure the user is logged in before inserting a task
    //if (! Meteor.userId()) {
    //  throw new Meteor.Error("not-authorized");
    //}

    Tasks.insert({
      text: '' + new Date(),
      createdAt: new Date(),
      //username: Meteor.user().username
    });
  },

});

Meteor.publish("tasks", function () {
  return Tasks.find();
});