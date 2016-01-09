Meteor.publish("beers", function () {
  return Beers.find();
});

Meteor.methods({
  getNext(text) {
    // Make sure the user is logged in before inserting a task
    //if (! Meteor.userId()) {
    //  throw new Meteor.Error("not-authorized");
    //}

    var beer = getNextBeer();
    beer.createdAt = new Date();
    Beers.insert(beer);
  },

});

var index = -1;


function getNextBeer(){
  var result = HTTP.call('GET', 'http://lcboapi.com/products',
      {params: {store_id: 511, q: 'beer', order: 'id.asc'}});

  index +=1;
  return result.data.result[index];
}