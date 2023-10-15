const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// app
const app = express();

// database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected');
}).catch((error) => {
  console.error('Error connecting to the database:', error);
});

// routes
app.get('/', (req, res) => {
  res.send('hello from nodeeee');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});