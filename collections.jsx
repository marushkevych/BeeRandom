Beers = new Mongo.Collection("beers");
CurrentPage = new Mongo.Collection("current_page");

if (Meteor.isServer) {
  Beers._ensureIndex({ id: 1, userId: 1 }, { unique: true })
}

