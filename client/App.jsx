// App component - represents the whole app
App = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      error: false,
      index: 0
    }
  },

  componentDidMount: function() {
    Accounts.onLogin(this.onLogin);
  },

  onLogin: function() {
    this.setState({error: false});
    if(this.data.count === 0){
      this.getNext();
    }
  },

  // this is called reactively when data changes
  // and makes returned object available as this.data
  getMeteorData() {

    var beers = Beers.find({}, {sort: {createdAt: -1}, limit: 1}).fetch();
    return {
      beers: Beers.find({}, {sort: {createdAt: -1}}).fetch(),
      beer: beers[this.state.index],
      currentUser: Meteor.user(),
      count: Beers.find().count()
    }
  },

  renderBeer() {

    var index = 0;

    // if in history mode
    if(this.state.index !== 0){
      index = this.state.index + this.data.count - this.state.historySize;
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
            <button disabled={!this.showForwardButton()} className="history" onClick={this.forward}>
              &#10095;
            </button>
            {beer.name || "No beer yet"}
          </li>

          { this.state.error ?
            <li className="error">{this.state.error}</li> : ''
          }
          <Beer key={beer._id} beer={beer} user={this.data.currentUser} />

        </ul>
    );
  },

  showBackButton() {
    return this.state.index < this.data.count - 1;
  },

  showForwardButton() {
    return this.state.index > 0;
  },

  back() {
    if(this.showBackButton()){
      if(this.state.index === 0){
        // enter history mode
        this.state.historySize = this.data.count;
      }
      this.setState({index: this.state.index + 1});
    }
  },

  forward() {
    if(this.showForwardButton()){
      this.setState({index: this.state.index - 1});
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
        this.setState({index: 0});
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