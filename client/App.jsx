// App component - represents the whole app
App = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  // this is called reactively when data changes
  // and makes returned object available as this.data
  getMeteorData() {
    var beers = Beers.find({}, {sort: {createdAt: -1}, limit: 1}).fetch();
    return {
      beer: beers[0],
      currentUser: Meteor.user(),
      count: Beers.find().count()
    }
  },

  renderBeer() {
    var beer = this.data.beer || {};
    return (
        <ul>
          <li>
            { this.data.currentUser ?
                <button className="getbeer" onClick={this.getNext}>
                  Get More Beer
                </button> : ''
            }
            {beer.name || "No beer yet"}
          </li>
            <Beer key={beer._id} beer={beer} user={this.data.currentUser} />
        </ul>
    );
  },

  getNext() {
    spin();
    Meteor.call("getNext", function (error, result) {
      stop();

    });
  },

  render() {

    return (
        <div>
          <div className="container">
            <header>
              <h1>Bee[r]andom </h1>

              { this.data.currentUser ?
                  <label className="hide-completed">
                    Total beers drank: <h1>{this.data.count}</h1>
                  </label> : ''
              }
              <AccountsUIWrapper />
            </header>


            {this.renderBeer()}

          </div>

        </div>
    );
  }
});