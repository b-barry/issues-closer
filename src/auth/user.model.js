export default (({Mongoose}) => {

  const Schema = Mongoose.Schema;

  const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    repos_url: {type: String},
    access_token_gh: {type: String, required: true, unique: true},
    admin: Boolean,
    location: String,
    meta_gh: {
      name: String,
      login: String,
      avatar_url: String,
      company: String,
      website: String
    },
    repositories: [
      {
        url: String,
        source: String,
        activate: String,
        lastCheck:Date

      }
    ],
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now()}
  });

  const User = Mongoose.model('User', userSchema);

  return User;
})()
