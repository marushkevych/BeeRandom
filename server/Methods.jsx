Meteor.publish("beers", function () {
  return Beers.find({}, { fields: { createdAt: 1, name: 1, image_url: 1 } });
});

Meteor.methods({
  getNext() {
    // Make sure the user is logged in before inserting a task
    //if (! Meteor.userId()) {
    //  throw new Meteor.Error("not-authorized");
    //}

    var beer = getNextBeer();
    beer.createdAt = new Date();
    Beers.insert(beer);
  },

});



function getNextBeer(){

  var pageInfo = getBeers(1);

  var pages = pageInfo.data.pager.total_pages;

  var result = getBeers(getRandomInt(pages));

  return result.data.result[0];
}

function getBeers(page){
  var params = {store_id: 511, q: 'beer', order: 'id.asc', page: page};
  return HTTP.call('GET', 'http://lcboapi.com/products', {params});
}

/**
 * Get random between 1 and max inclusive
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * (max)) + 1;
}