module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/coupevideos01'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true'
  }
};
