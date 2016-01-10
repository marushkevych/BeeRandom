// Task component - represents a single todo item
Beer = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    beer: React.PropTypes.object.isRequired
  },

  renderBeer() {
    if(this.props.user){
      return <img src={this.props.beer.image_url} width="400px" className="center"></img>;
    } else {
      return <div className="center">Please Login</div>
    }
  },

  render() {
    return (
          <li className="beer">
            {this.renderBeer()}
          </li>
    );
  }
});