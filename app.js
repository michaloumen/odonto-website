const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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

// middlewares
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(cookieParser());

// routes
app.use('/api', userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
