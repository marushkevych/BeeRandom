// App component - represents the whole app
App = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      error: false
    }
  },

  componentDidMount: function() {
    Accounts.onLogin(this.onLogin);
  },

  onLogin: function() {
    this.setState({error: false});
    if(this.data.beer == null){
      this.getNext();
    }
  },

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

          { this.state.error ?
            <li className="error">{this.state.error}</li> : ''
          }
          <Beer key={beer._id} beer={beer} user={this.data.currentUser} />

        </ul>
    );
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