const express = require('express');
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());

const cors = require('cors');
app.use(cors());



const todos = [];
// GET endpoint to retrieve the number of todos
app.get('/todos/', (req, res) => {
  res.json(todos);
});

//Get todos by id
app.get('/todos/:id', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3001/todos');
    const data = await response.json();
    const id = parseInt(req.params.id);
    const result = data.filter(todo => todo.id === id);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// POST endpoint to add a new todo
app.post('/todos', (req, res) => {
    //request body
    //retrieve the data sent from the client in the request body, and assings it to a variable name newTodo
  const newTodo = req.body;
  //add the new todo item to the todo array
  todos.push(newTodo);
  //log the new todo item to the console to confirm that it has received on the server side.
  console.log('Received new todo:', newTodo); 
  // set the status code of the response `201 Created', and send the todo item back to the client in JSON format.
//   res.status(201).json(newTodo);
// Will get the updated list of all the todos, 
res.status(201).json(todos);
});

// Route to delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    console.log('Have been deleted', index)
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

// Route to delete all todos


app.delete('/todos', (req, res) => {
  if (req.method !== 'DELETE') {
    res.status(405).send('Method Not Allowed');
    return;
  }
    // Check for authentication token or user permission here
    todos.length = 0;
    res.sendStatus(204)
  
});



app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  // Find the corresponding todo item in the array and update its properties
  const index = todos.findIndex(todo => todo.id === parseInt(id));
  if (index !== -1) {
    todos[index] = { ...todos[index], ...updates };
    res.json(todos[index]);
  } else {
    res.status(404).send(`Todo item ${id} not found`);
  }
}); 




// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
