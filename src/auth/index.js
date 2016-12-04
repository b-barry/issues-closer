import {getAccessToken} from "./auth";
import UserModel from "./user.model";

export default ({server, dps : {Github, Config, Mongoose}}) => {

  const User = UserModel({Mongoose});

  server.route({
    method: 'POST',
    path: '/auth/accessToken',
    // TODO: fix it after test
    config: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    },
    handler: getAccessToken({Github, Config, DB:{ User}})
  });
}

