import React from 'react';
import ReactDOM from 'react-dom';


const TodoContainer = React.createClass({
  getInitialState() {
    return {
      items: ['Buy Groceries', 'Visit NY', 'Sell Car']
    };
  },

  render() {
    return (
      <div>
        <h3>List of things TODO</h3>
        <TodoList items={this.state.items} />
      </div>
    );
  }

});


const TodoList = React.createClass({
  propTypes: {
    items: React.PropTypes.object
  },
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>{item}</li>
        ))}
      </ul>
    );
  }
});

// insert into the DOM
ReactDOM.render(<TodoContainer />, document.getElementById('main_container'));

