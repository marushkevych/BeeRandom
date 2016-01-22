Meteor.publish("beers", function () {
  return Beers.find({userId: this.userId}, {
    fields: { createdAt: 1, name: 1, image_url: 1, price_in_cents: 1 }
  });
});

Meteor.methods({getNext});

/**
 * Moves next random beer from CurrentPage collection
 * to Beers collection (registry of visited beers)
 */
function getNext(){
  // Make sure the user is logged in before loading next beer
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }

  var currentPage = getCurrentPage();

  removeBeerFromCurrentPage();
  addBeer(currentPage.page.result.pop());
}

/**
 * Deletes next beer from CurrentPage collection
 */
function removeBeerFromCurrentPage(){
  CurrentPage.update({userId: Meteor.userId()}, {$pop: {'page.result': 1}});
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
    currentPage = loadNextPage(currentPage);
  }
  return currentPage;
}

/**
 * Add a beer to Beers collection (registry of visited beers).
 * Will skip given beer and proceed to next one if:
 *  - beer already exist in Beers collection
 *  - beer is not a beer
 *  - beer has no image
 *
 * @param beer
 */
function addBeer(beer){

  // skip if no image, or if not Beer (sometimes we get wines tagged as beer)
  if(beer.image_url == null || beer.primary_category !== "Beer") {
    getNext();
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
    getNext();
  }
}

/**
 * Gets first page from the store and inserts it into CurrentPage collection
 * @returns inserted page
 */
function insertFirstPage(){
  var page = {
    userId: Meteor.userId(),
    page: getBeers(1)
  };

  CurrentPage.insert(page);
  return page;
}

/**
 * Get next available page of beers and saves it in db.
 *
 * @param currentPage
 * @returns nextPage
 * @throws 'NO_MORE_BEER' error if there are no more pages
 */
function loadNextPage(currentPage){
  var pageNumber = currentPage.page.pager.next_page;
  if(pageNumber == null){
    throw new Meteor.Error('NO_MORE_BEER');
  }

  var page = {
    userId: Meteor.userId(),
    page: getBeers(pageNumber)
  };
  CurrentPage.update({userId: Meteor.userId()}, page);
  return page;
}

/**
 * Retrieves a page of beers from store #511
 *
 * @param pageNumber
 * @returns page with shuffled beers
 */
function getBeers(pageNumber){
  var params = {store_id: 511, q: 'beer', order: 'id.asc', page: pageNumber};
  var result = HTTP.call('GET', 'http://lcboapi.com/products', {params});
  return shuffleBeers(result.data);
}

/**
 * Shuffled beers in the page object
 *
 * @param page
 * @returns page with shuffled beers
 */
function shuffleBeers(page){
  page.result = _.shuffle(page.result);
  return page;
}
