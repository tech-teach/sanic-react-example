import React, { Component } from 'react';
import './App.css';

import request from 'superagent';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      tasks: [],
      task: "",
    }
  }

  componentDidMount(){
    this.getTasks();
  }

  handleInputChange(value){
    this.setState({ task: value });
  }

  getTasks(then){
    request
      .get('http://localhost:8000/tasks')
      .end((err, res) => {
        if(err){
          console.error(err);
        } else {
          this.setState({ tasks: res.body.tasks});
        }
      })
  }

  saveTask(){
    request
      .post('http://localhost:8000/task')
      .send({task: this.state.task})
      .end((err, res) => {
        if(err){
          console.error(err);
        } else {
          console.log(res.body);
          this.getTasks();
        }
      })
  }

  deleteTask(id){
    request
      .delete(`http://localhost:8000/task/${id}`)
      .end((err, res) => {
        if(err){
          console.error(err);
        } else {
          console.log(res.body);
          this.getTasks();
        }
      })
  }

  render() {
    return (
      <div className="App">
        <input
          type="text"
          onChange={event => this.handleInputChange(event.target.value)}
        >
        </input>
        <button onClick={ () => this.saveTask() }>Add task</button>
        <ul>
          {
            this.state.tasks.map(
              (task, id) => (
                <li
                  key={id}
                  onClick={() => this.deleteTask(id)}
                >
                  {task}
                </li>
              )
            )
          }
        </ul>
      </div>
    );
  }
}

export default App;
