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
    console.log(value);
  }

  getTasks(then){
    request
      .get('http://localhost:8000/tasks')
      .end((err, res) => {
        if(err){
          console.error(err);
        } else {
          console.log(res.body.tasks);
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

  mark_as_done(id){
    request
      .post(`http://localhost:8000/realized/${id}`)
      .end((err,res) => {
        if(err){
          console.error(err);
        }else{
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
        <button onClick={() => this.saveTask()}>Add task</button>
        <table border="1" height="20">
        <tbody>
          <tr>
            <td>Valor</td>
            <td>Marcado como realizado</td>
            <td>Opciones</td>
          </tr>
          {
            this.state.tasks.map((task,id) => (
              <tr key={id}>
                <td style={{textDecoration:task[1]?'underline':'none'}} width="120" >{task[0]}</td>
                <td width="100">{task[1]}</td>
                <td>
                  <form>
                    <button style={{width: '80px'}} type="submit" onClick={() => this.mark_as_done(id)}>Realizado</button>
                    <button style={{width: '80px'}} type="submit" onClick={() => this.deleteTask(id)}>Eliminar</button>
                  </form>
                </td>
              </tr>
            ))
          }
        </tbody>
        </table>
      </div>
    );
  }
}

export default App;
