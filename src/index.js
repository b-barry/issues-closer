import {Server} from 'hapi';
import Mongoose from 'mongoose';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  MONGO_URL
} from './config';


Mongoose.connect(MONGO_URL);
const DB = Mongoose.connection;
// Create a server with a host and port
const server = new Server();


server.connection({
  host: 'localhost',
  port: 8000
});

// Add the route
server.route({
  method: 'GET',
  path: '/hello',

  handler: function (request, reply) {

    return reply('hello world');
  }
});


server.route({
  method: 'POST',
  path:'/auth/accessToken',

  handler: function (req, res) {
    console.log(' body ', res.body);
    return res('Getting access token');
  }
});

DB.on('error', console.error.bind(console, 'connection with database  error'));
DB.once('open', () =>{
  console.log("Connection with database succeeded.");
  // Start the server
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});

