export const getNextPageNumberFromLinkHeader = (linkHeader) => {
  /**
   * <https://api.github.com/user/repos?page=2&per_page=2>; rel="next",
   * <https://api.github.com/user/repos?page=27&per_page=2>; rel="last"
   */

  if (!linkHeader) {
    return undefined;
  }
  const pageToken = 'page=';
  const perPageToken = 'per_page=';
  const semiColonToken = ';'

  const pageRaw = linkHeader
    .split(semiColonToken)[0]
    .split(pageToken)[1]
    .split(perPageToken)[0];

  const page = pageRaw.replace(/\D/g, '');

  try {
    const next = parseInt(page);
    return next !== 1 ? next : undefined;
  }
  catch (err) {
    return undefined;
  }

};


export const validateJwtToken = ({User}) => {

  return ({id}, request, callback) => {

    User
      .findByIdAsync(id)
      .then((user) => {
        return user ? callback(null, true) : callback(null, false);
      })
      .catch(() => {
        return callback(null, false);
      });
  };
};

export const createJwtToken = (Jwt, secretToken, payload) => {
  return jwt.sign(
    {
      payload
    }, secretToken, {expiresIn: '120d'});
}
