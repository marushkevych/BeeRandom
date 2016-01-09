// Task component - represents a single todo item
Task = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    task: React.PropTypes.object.isRequired
  },
  render() {
    return (

          <li>
            <img src={this.props.task.image_url}
                 alt={this.props.task.name}
                 width="400px"
                 className="center"></img>
          </li>
    );
  }
});