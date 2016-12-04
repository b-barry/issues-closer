import {Server} from "hapi";
import Mongoose from "mongoose";
import good from "good";
import HapiAuthJwt2 from 'hapi-auth-jwt2';
import JWT from 'jsonwebtoken';
import Config, {MONGO_URL} from "./config";
import Bluebird from "bluebird";
import Github from "octonode";
import auth from "./auth";


const GithubPromise = Bluebird.promisifyAll(Github, {multiArgs: true});
GithubPromise.auth = Bluebird.promisifyAll(Github.auth);
// Use native promises
Mongoose.Promise = global.Promise;
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
    Github: GithubPromise,
    Config,
    Mongoose,
    HapiAuthJwt2,
    JWT
  }
});


/**
 * Good Options
 *
 */
const goodOptions = {

  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        log: '*',
        response: '*',
        error: '*',
        request:'*'
      }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
};

const startServer = (server) => {
  // Start the server
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
};


/**
 *  Server plugins
 */

const registers = [
  {
    register: good,
    options: goodOptions,
  }
];


server
  .register(registers, (err) => {
    if (err) {
      return console.error(err);
    }

    DB.on('error', console.error.bind(console, 'connection with database  error'));
    DB.once('open', () => {
      console.log("Connection with database succeeded.");
      startServer(server)
    });

  });
