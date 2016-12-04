import {Observable} from "rxjs";// Move RXJS in DI
import {getNextPageNumberFromLinkHeader, createJwtToken} from "./utils";

export const getAccessToken = ({Github, Config, DB, JWT}) => {


  const auth_url = Github.auth.config({
    id: Config.GITHUB_CLIENT_ID,
    secret: Config.GITHUB_CLIENT_SECRET,
  });

  const getMeInfo = (token) => {
    console.log('Token getMeInfo ', token);
    const client = Github.client(token);
    return Observable.from(client.me().infoAsync());
  };

  const getMeRepository = (token, page = 1, per_page = 100, sort = 'updated', direction ='desc') => {
    console.log('Token getMeRepository ', token)
    const client = Github.client(token);

    return Observable.from(client.me().reposAsync({
      page, per_page, sort, direction
    }))
      .mergeMap(([repos, header]) => {

        const nextPage = getNextPageNumberFromLinkHeader(header.link);

        const response$ = Observable.of(repos);
        const next$ = nextPage ? getMeRepository(token, nextPage) : Observable.empty();

        return Observable.merge(response$, next$)
      })
      .reduce((acc, next) => {
        return acc.concat(next);
      });
  };

  return (req, reply) => {

    console.log(' Enter in getAccessToken ');

    const {payload:body} = req;

    const accessToken$ = Observable.from(Github.auth.loginAsync(body.code)).share();

    const getInfo$ = accessToken$
      .switchMap((token) => {
        return getMeInfo(token);
      });

    const getRepo$ = accessToken$
      .switchMap((token) => {
        return getMeRepository(token);
      });
    const createOrUpdateUser$ = ([info], token) => {
      console.log('Infos ', info, ' Token : ', token);

      const findByEmail$ = Observable.from(DB.User.findOne({email: info.email}).exec());

      return findByEmail$
        .mergeMap((user) => {
          if (user) {
            user.access_token_gh = token;
            user.updated_at = Date.now();
            return Observable.from(user.save())
          }
          const newUser = new DB.User({
            email: info.email,
            access_token_gh: token
          });

          return Observable.from(newUser.save());
        })
        .catch((err) => {
          console.log('Error findByEmail$ stream', err);
          return Observable.throw('Error findByEmail$ stream');
        });
    };

    const getUser$ = getInfo$
      .withLatestFrom(accessToken$, createOrUpdateUser$)
      .mergeMap((user) => {
        return user
      });


    const response$ = Observable
      .combineLatest(getUser$, getRepo$, (user, repos) => {
        return {
          token: createJwtToken(JWT,Config.SECRET_TOKEN, { email:user.email, isAdmin:false, id:user.id}),
          repos: repos
        }
      });

    response$
      .subscribe((res) => {
        //console.log(' Next getAccessToken ', res);
        reply(res);
      }, (err) => {
        console.log('Err end ', err);
        reply(new Error('Error getAccessToken'))
      }, () => {
        console.log('Complete getAccessToken')
      });
  };
};
