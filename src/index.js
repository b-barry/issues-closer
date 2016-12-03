import {Server} from 'hapi';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  MONGO_URL
} from './config';


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

// Start the server
server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
