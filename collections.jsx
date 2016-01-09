Beers = new Mongo.Collection("beers");

if (Meteor.isServer) {
  Beers._ensureIndex({ id: 1, userId: 1 }, { unique: true })
}

