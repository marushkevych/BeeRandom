// Task component - represents a single todo item
Beer = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    beer: React.PropTypes.object.isRequired
  },
  render() {
    return (

          <li className="beer">
            <img src={this.props.beer.image_url}
                 alt={this.props.beer.name}
                 width="400px"
                 className="center"></img>
          </li>
    );
  }
});