const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();

// Load the JWT secret from the Secret file
const jwtSecret = fs.readFileSync('/run/secrets/jwt-secret', 'utf8');

// Define the authentication middleware
app.use((req, res, next) => {
  // Retrieve the JWT token from the request headers
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (token) {
    try {
      // Verify and decode the JWT token using the secret
      const decodedToken = jwt.verify(token, jwtSecret);
      // Access the authenticated user information
      req.user = decodedToken;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      res.status(401).send('Unauthorized');
      return;
    }
  } else {
    res.status(401).send('Unauthorized');
    return;
  }

  // The request is authorized, proceed to the next middleware
  next();
});

// Handle incoming requests
app.get('/', (req, res) => {
  // Access the authenticated user information from the request object
  const username = req.user?.preferred_username;

  res.send(`Hello, ${username}! You are authenticated.`);
});

// Start the server
app.listen(3000, () => {
  console.log('Authorization service listening on port 3000');
});
