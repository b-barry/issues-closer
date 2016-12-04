import {getAccessToken} from "./auth";
import UserModel from "./user.model";
import {validateJwtToken} from './utils'

export default ({server, dps : {Github, Config, Mongoose, HapiAuthJwt2, JWT}}) => {

  const User = UserModel({Mongoose});


  const routes = (server)=>{
    server.route([
      {
        method: 'POST',
        path: '/auth/accessToken',

        config: {
          auth: false,
          // TODO: fix it after test
          cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
          }
        },
        handler: getAccessToken({Github, Config,JWT, DB: {User}})
      },
      // For testing purpose
      {
        method: 'GET', path: '/restricted', config: {auth: 'jwt'},
        handler: function (request, reply) {
          reply({text: 'You used a Token!'})
            .header("Authorization", request.headers.authorization);
        }
      }
    ]);
  };

  server.register(HapiAuthJwt2, function (err) {

    if (err) {
      console.log(err);
    }

    server.auth.strategy('jwt', 'jwt',
      {
        key: Config.SECRET_TOKEN,
        validateFunc: validateJwtToken({User}),
        verifyOptions: {algorithms: ['HS256'], ignoreExpiration: false}
      });

    server.auth.default('jwt');

    routes(server);

  });
}

