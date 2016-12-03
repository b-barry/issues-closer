import {Server} from 'hapi';
import Mongoose from 'mongoose';
import Config, {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  MONGO_URL
} from './config';
import Promisify from 'promisify-node';
import Github  from 'octonode';
import  auth from './auth';


Promisify(Github);



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


auth({
  server,
  dps: {
    Github,
    Config
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

