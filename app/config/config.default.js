module.exports = {
  name: 'elpis-demo',
  jwtSecretKey: '6b49d207c8de86ebf6e16ba3ab114579',

  // 数据库配置
  db: {
    client: 'mysql',
    connection: {
      host: '',
      port: '',
      database: '',
      user: '',
      password: ''
    },
    pool: {
      min: 5,
      max: 20,
    }
  },

  apiSignVerify: {
    whiteList: ['/api/auth/logout']
  }
}