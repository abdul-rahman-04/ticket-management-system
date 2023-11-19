// This is the main entry point for Node.js server

// Setting up the server with necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ticket_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());
app.use('/api', routes); // Ensure that routes are prefixed with '/api'

// Serve static files
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});