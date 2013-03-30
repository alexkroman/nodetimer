module.exports = {
  development: {
    root: require('path').normalize(__dirname + '/..'),
    app: {
      name: 'Node timer'
    },
    db: 'mongodb://localhost/noobjs_dev'
  },
  test: {

  },
  production: {
    root: require('path').normalize(__dirname + '/..'),
    app: {
      name: 'Node timer'
    },
    db: process.env.MONGOLAB_URI
  }
};