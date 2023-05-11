import { useState, useEffect } from "react";
import './App.css';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ariaLabel = { 'aria-label': 'description' };






function TodoList() {
  const [todos, setTodos] = useState([]); 
  const [newTodo, setNewTodo] = useState("");

  function inputChange(event) {
    setNewTodo(event.target.value);
  }

  //Hook allow you to perform side effect in your components
  //Some example of side effect are: fetching data, directly update DOM, and timers
  //useEffect accepts two argumenT. The second argument is optional
  useEffect(() => {
    deleteAllTodos(); // Send delete request on initial load
  }, []);


  //  async function getData(){
  //    console.log('Get todo')
  //  }

async function addTodo() {
    // setTodos([...todos, newTodo]);
    // setNewTodo("");
    const newId = todos.length + 1;
    const newTodoObject = { id: newId, task: newTodo, completed: false };
    const updatedTodos = [...todos, newTodoObject];
    setTodos(updatedTodos);//When click addTodo button, the newTodoObject will sabe in useState([]);
    // setNewTodo("");

      const endpoint = 'http://localhost:3001/todos'
      const response = await fetch (endpoint,{
        method: 'POST',
        headers:{
          'content-type':'application/json'
        },
        body: JSON.stringify({
          id: todos.length+1,
          task: newTodo,
          completed: false
        })
      })
      const data = await response.json()
      console.log(data)
      
  }

async function deleteTodo(index) {
  const id = todos[index].id;

  const endpoint = `http://localhost:3001/todos/${id}`;
  const response = await fetch(endpoint, {
    method: "DELETE",
  });

  //If there is not response from server for delete request, So the response.json() method is trying to parse 
  //JSON.parse() convert a JSON string into javascript object.
    if (response.ok){
      const updatedTodos = [...todos];
      updatedTodos.splice(index, 1);
      setTodos(updatedTodos)
      console.log(`Delete todo with id :${id}`)
    } else {
      console.log('Error deleteting error')
    }
}


  async function toggle(index) {
    const id = todos[index].id;
    const updatedTodo = { ...todos[index], completed: !todos[index].completed };
  
    const endpoint = `http://localhost:3001/todos/${id}`;
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });
  
    if (response.ok) {
      const updatedTodos = [...todos];
      updatedTodos[index] = updatedTodo;
      setTodos(updatedTodos);
      console.log(`toggle id:${id}`)
    } else {
      console.log("Error updating todo");
    }
  }

  const deleteAllTodos = async () => {
    try {
      const response = await fetch('http://localhost:3001/todos', {
        method: 'DELETE'
      });
      if (response.ok) {
        setTodos([]);
        console.log('All todos deleted!');
      } else {
        console.log('Error deleting todos');
      }
    } catch (error) {
      console.log('Error deleting todos:', error);
    }
  };
  


  return (
    <>


    <div className="content">
      <div className="inputAndAddButton">
      <Input defaultValue="" type="text" className="input" id="inputTask"   inputProps={{ ...ariaLabel, maxLength: 20 }}
 value={newTodo} onChange={inputChange} />

      {/* <input className="input" type="text" id="inputTask" value={newTodo} onChange={inputChange}/><span></span> */}
      {/* <button onClick={toggle}>{isToggled? "undo" : "Completed"}</button> */}
    {/* <button onClick={getData}>Get data</button> */}
    <div>
  </div>
      {/* <button id="post-todo-button" className="addTodo" onClick={addTodo} style={{border: 'none'}}>+</button> */}
      <Box sx={{ '& > :not(style)': { m: 1 } }} className="addTodo">
      <Fab size="small" color="secondary" aria-label="add" >
        <AddIcon id="post-todo-button"  onClick={addTodo}/>
      </Fab>
    </Box>
      </div>
      {/* const todos = [
        { id:1, task: Learn HTML, complete: false}
        { id:2, task: Learn Css, complete: false}
        { id:3, task: Learn Javascript, complete: false}


        const todoListItem = todos.map((todo, index) =>{
          <li key={index}>
          {todo.task}
          </li>


          output: 
          [
            <li key="0">Learn html</li>
            <li key="1">Learn CSs</li>
            <li key="2">Learn Javascript</li>


            
          ]
        });
      ] */}
    
    <ul id="order-list" style={{ display: 'flex', alignItems: 'center' }}>
  {todos.map((todo, index) => (
    <li className="itemList" key={index} style={{ textDecoration: todo.completed ? 'line-through' : 'none', display: 'flex', alignItems: 'center' }}>
      <span>{todo.task}</span>

      <div className="inline-button" style={{ marginLeft: 'auto' }}>
        <Stack spacing={2} direction="row" className="inline-button">
          <IconButton aria-label="delete" onClick={() => deleteTodo(index)} className="closeButton">
            <DeleteIcon />
          </IconButton>
        </Stack>
        <Checkbox {...label} checked={todo.completed} onChange={() => toggle(index)} />
      </div>
    </li>
  ))}
</ul>

      <div className="taskInfo">
      <div className="totalTask">



      </div>
      <p className="taskLeft">{todos.length} Task Left</p>

      {/* <Button variant="contained" onClick={deleteAllTodos} className="deleteAllTodos">Clean</Button> */}
      <Button variant="outlined" onClick={deleteAllTodos} className="clean-all">Clean All</Button>
      {/* <button onClick={deleteAllTodos} className="deleteAllTodos">Clean</button> */}
    </div>
    

      </div>

      {/* <Button variant="contained" onClick={deleteAllTodos} className="deleteAllTodos">Clean</Button> */}


    </>
  );
}

export default TodoList;
