Meteor.publish("beers", function () {
  return Beers.find({userId: this.userId}, { fields: { createdAt: 1, name: 1, image_url: 1 } });
});

Meteor.methods({
  getNext() {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var beer = getNextBeer();
    beer.createdAt = new Date();
    beer.userId = Meteor.userId();
    Beers.insert(beer);
  },

});

// TODO skip results with no image

function getNextBeer(){

  var pageInfo = getBeers(1);

  var totalPages = pageInfo.pager.total_pages;

  var beers = getBeers(getRandomInclusive(totalPages)).result;

  return beers[getRandomArrayIndex(beers.length)];
}

function getBeers(page){
  var params = {store_id: 511, q: 'beer', order: 'id.asc', page: page};
  var result = HTTP.call('GET', 'http://lcboapi.com/products', {params});
  return result.data;
}

/**
 * Get random between 1 and max inclusive
 */
function getRandomInclusive(max) {
  return Math.floor(Math.random() * (max)) + 1;
}


function getRandomArrayIndex(length) {
  return Math.floor(Math.random() * length);
}