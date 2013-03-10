module.exports = {
  development: {
    root: require('path').normalize(__dirname + '/..'),
    app: {
      name: 'Node timer'
    },
    db: 'mongodb://localhost/noobjs_dev',
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
  },
  test: {

  },
  production: {
    root: require('path').normalize(__dirname + '/..'),
    app: {
      name: 'Node timer'
    },
    db: process.env.MONGOLAB_URI,
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    }
  }
};