Meteor.publish("beers", function () {
  return Beers.find({userId: this.userId}, { fields: { createdAt: 1, name: 1, image_url: 1 } });
});

Meteor.methods({
  getNext() {
    // Make sure the user is logged in before loading next beer
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    getNextBeer();
  }

});

function getNextBeer(){
  var currentPage = getCurrentPage();

  var nextBeer = currentPage.page.result.pop();

  removeBeerFromCurrentPage();
  addBeer(nextBeer);
}

/**
 * Get current page from DB, or load next page if current page has no entries left
 */
function getCurrentPage(){
  var currentPage = CurrentPage.findOne({userId: Meteor.userId()});

  if(currentPage == null){
    currentPage = insertFirstPage();
  }


  if(currentPage.page.result.length === 0){
    currentPage = loadPage(currentPage.page.pager.next_page);
  }
  return currentPage;
}


function addBeer(beer){

  // skip if no image, or if not Beer (sometimes we get wines tagged as beer)
  if(beer.image_url == null || beer.primary_category !== "Beer") {
    getNextBeer();
    return;
  }

  beer.createdAt = new Date();
  beer.userId = Meteor.userId();

  try {
    Beers.insert(beer);
  } catch (error) {
    console.log(JSON.stringify(error));
    // duplicate
    //TODO set max attempts, sleep
    getNextBeer();
  }
}


function removeBeerFromCurrentPage(){
  CurrentPage.update({userId: Meteor.userId()}, {$pop: {'page.result': 1}});
}

function insertFirstPage(){
  var page = {
    userId: Meteor.userId(),
    page: getBeers(1)
  };

  CurrentPage.insert(page);
  return page;
}

function loadPage(pageNumber){
  var page = {
    userId: Meteor.userId(),
    page: getBeers(pageNumber)
  };
  CurrentPage.update({userId: Meteor.userId()}, page);
  return page;
}

function getBeers(page){
  var params = {store_id: 511, q: 'beer', order: 'id.asc', page: page};
  var result = HTTP.call('GET', 'http://lcboapi.com/products', {params});
  return result.data;
}




///**
// * Get random between 1 and max inclusive
// */
//function getRandomInclusive(max) {
//  return Math.floor(Math.random() * (max)) + 1;
//}
//
//
//function getRandomArrayIndex(length) {
//  return Math.floor(Math.random() * length);
//}

//function getNextBeer(){
//
//  var pageInfo = getBeers(1);
//
//  var totalPages = pageInfo.pager.total_pages;
//
//  var beers = getBeers(getRandomInclusive(totalPages)).result;
//
//  return beers[getRandomArrayIndex(beers.length)];
//
//
//  //return pageInfo.result[0];
//}
