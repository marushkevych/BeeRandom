// App component - represents the whole app
App = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  componentDidMount: function() {
    Accounts.onLogin(this.onLogin);
  },

  onLogin: function() {
    this.setState({error: false, index: null});
    if(this.data.count === 0){
      this.getNext();
    }
  },

  // this is called reactively when data changes
  // and makes returned object available as this.data
  getMeteorData() {

    var beers = Beers.find({}, {sort: {createdAt: -1}, limit: 1}).fetch();

    var allBeers = Beers.find({}).fetch();

    // TODO CACHE last most expensive beer along with its index, so next time we only have to go through new beers
    var max = allBeers.reduce(function (prev, beer) {
      if(!prev) return beer;
      return beer.price_in_cents > prev.price_in_cents ? beer : prev;
    }, null);


    return {
      beers: Beers.find({}, {sort: {createdAt: -1}}).fetch(),
      beer: beers[this.state.index],
      currentUser: Meteor.user(),
      count: Beers.find().count(),
      mostExpensiveBeer: max
    }
  },

  getInitialState() {
    return {
      error: false,
      index: null
    }
  },

  renderBeer() {

    var index = 0;

    // if in history mode
    if(this.isHistoryMode()){
      index = this.getHistoryIndex();
    }

    var beer = this.data.beers[index] || {};

    return (
        <ul>
          <li>
            { this.data.currentUser ?
                <button className="getbeer" onClick={this.getNext}>
                  Get More Beer
                </button> : ''
            }

            <button disabled={!this.showBackButton()} className="history" onClick={this.back}>
              &#10094;
            </button>
            {this.state.index || this.data.count}
            <button disabled={!this.showForwardButton()} className="history" onClick={this.forward}>
              &#10095;
            </button>
            {beer.name || "No beer yet"}
          </li>

          { this.state.error ?
            <li className="error">{this.state.error}</li> : ''
          }

          { this.data.mostExpensiveBeer ?
            <li className="error">
              Most expensive beer:&nbsp;
              {this.data.mostExpensiveBeer.name} ${this.data.mostExpensiveBeer.price_in_cents/100}
            </li> : ''
          }
          <Beer key={beer._id} beer={beer} user={this.data.currentUser} />

        </ul>
    );
  },

  isHistoryMode() {
    return this.state.index !== null;
  },

  getHistoryIndex() {
    return this.state.index ? this.data.count - this.state.index : null;
  },

  showBackButton() {
    return (!this.isHistoryMode() && this.data.count > 1) || this.state.index > 1;
  },

  showForwardButton() {
    return this.isHistoryMode();
  },

  back() {
    if(this.showBackButton()){
      if(!this.isHistoryMode()){
        // enter history mode
        this.setState({index: this.data.count - 1});
      } else {
        this.setState({index: this.state.index - 1});
      }
    }
  },

  forward() {
    if(this.showForwardButton()){
      if(this.getHistoryIndex() - 1 === 0) {
        this.setState({index: null});
      } else {
        this.setState({index: this.state.index + 1});
      }
    }
  },

  getNext() {
    spin();
    this.setState({error: false});
    Meteor.call('getNext', (error, result) => {
      if(error){
        if(error.error === 'NO_MORE_BEER'){
          this.setState({error: 'No More Beer :('});
        } else {
          console.log(error);
          this.setState({error: 'Sorry an error has occurred'});
        }
      } else {
        this.setState({index: null});
      }
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