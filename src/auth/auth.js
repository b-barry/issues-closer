export const getAccessToken = ({Github,  Config}) => {

  const  auth_url = Github.auth.config({
    id:Config.GITHUB_CLIENT_ID,
    secret: Config.GITHUB_CLIENT_SECRET,
  });

  return (req, res) => {
    const {payload:body} = req;

    Github.auth
      .login(body.code)
      .then((token)=>{
        return Github.client(token).me().info();
      })
      .then((user)=>{
        return res(user);
      })
      .catch((err)=>{
        console.log(' Error acces token ', {err:err});
        return res('Getting access token error');
      });
  };
};
