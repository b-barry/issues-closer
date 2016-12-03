import {getAccessToken} from './auth';

export default ({ server, dps : { Github, Config}})=>{


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
    handler: getAccessToken({ Github, Config})
  });
}

