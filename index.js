const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // **** new line, added package and required it here

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.post('/api/register', (req, res) => {
  // grab username and password from the body
  const creds = req.body

  // generate the has from the user's password
  const hash = bcrypt.hashSync(creds.password, 14); //rounds is 2^X in this case it is 2^14
  // override the user.password with the hash
  creds.password = hash;
  // save the user to the database
  db('users')
  .insert(creds)
  .then(ids => {
    res.status(201).json(ids);
  })
  .catch(err => json(err));
});

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password') // **** changed this for class*** never ever send password back!! leave it out
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
