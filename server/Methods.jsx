Meteor.publish("beers", function () {
  return Beers.find({userId: this.userId}, { fields: { createdAt: 1, name: 1, image_url: 1 } });
});

Meteor.methods({
  getNext() {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    insertRandomBeer();
  },

});


function insertRandomBeer(){
  var beer = getNextBeer();

  // skip beer if no image
  if(beer.image_url == null) {
    insertRandomBeer();
    return;
  }

  beer.createdAt = new Date();
  beer.userId = Meteor.userId();

  try {
    Beers.insert(beer);
  } catch (error) {
    console.log(JSON.stringify(error));
    // duplicate
    insertRandomBeer();
  }
}

function getNextBeer(){

  var pageInfo = getBeers(1);

  var totalPages = pageInfo.pager.total_pages;

  var beers = getBeers(getRandomInclusive(totalPages)).result;

  return beers[getRandomArrayIndex(beers.length)];


  //return pageInfo.result[0];
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