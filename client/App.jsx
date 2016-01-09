// App component - represents the whole app
App = React.createClass({
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  // this is called reactively when data changes
  // and makes returned object available as this.data
  getMeteorData() {
    return {
      tasks: Tasks.find({}, {sort: {createdAt: -1}, limit: 1}).fetch()
    }
  },

  renderTasks() {
    return this.data.tasks.map((task) => {
      return <Task key={task._id} task={task} />;
    });
  },

  render() {
    return (
        <div className="container">
          <header>
            <h1>Bee[r] Random </h1>
          </header>

          <ul>
            {this.renderTasks()}
          </ul>
        </div>
    );
  }
});