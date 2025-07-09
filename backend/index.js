const express = require('express');
const app = express();
const port = 4000; // The port our backend will run on

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});